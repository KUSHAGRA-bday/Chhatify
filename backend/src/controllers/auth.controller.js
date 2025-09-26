import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/Users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

//signup
export async function signup(req, res) {
    const { fullName, email, password, confirmPassword } = req.body;
    try {
        if (!email || !password || !fullName || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use. Use different one" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar
        });

        try {
            //upserting
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || ""
            });
            console.log(`Stream user upserted: ${newUser.fullName}`);
        } catch (error) {
            console.error("Error upserting Stream user:", error);
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "strict"
        });

        res.status(201).json({ success: true, message: "User created successfully", user: newUser, token });
    }
    catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

//login
export async function login(req, res) {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "strict"
        });

        res.status(200).json({ success: true, message: "Login successful", user, token });
    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
//logout
export function logout(req, res) {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logout successful" });
}

export async function onboard(req, res) {
    try {
        const userID = req.user._id
        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body
        if (!fullName || !nativeLanguage || !learningLanguage || !location || !bio) {
            return res.status(400).json(
                {
                    message: "All fields are required",
                    missingFields: [
                        !fullName && "fullName",
                        !nativeLanguage && "nativeLanguage",
                        !learningLanguage && "learningLanguage",
                        !location && "location",
                        !bio && "bio"
                    ].filter(Boolean)
                });
        }
        const updatedUser = await User.findByIdAndUpdate(userID, {
            ...req.body, isOnboarded: true
        }, { new: true });

        if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || ""
            })
            res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
        } catch (streamError) {
            console.error("Error updating Stream user during onboarding:", streamError.message);
        }

    } catch (error) {
        console.error("Error in onboarding controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a password reset token
        const resetToken = user.generateResetToken();
        await user.save();

        // Send the reset token to the user's email
        await sendResetEmail(user.email, resetToken);

        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.error("Error in forgot password controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function sendResetEmail(email, token) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // your email
                pass: process.env.EMAIL_PASS  // your email password or app password
            }
        });

        const resetUrl = `http://localhost:5001/forgot-password/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset",
            text: `Hello there!!
            This is your password reset link: ${resetUrl}
Thank you!`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error("Error sending reset email:", error);
    }
}