import express from "express"  
import { login, logout, onboard, signup, forgotPassword } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.post("/onboarding", protectRoute, onboard)

//forget password
router.post("/forgot-password", forgotPassword)

router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

export default router