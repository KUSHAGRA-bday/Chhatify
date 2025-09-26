import React from "react";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignup.js";
import { useState } from "react";

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };
  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
      data-theme="cyberpunk"
    >
      <div className="w-auto h-80vh rounded-2xl bg-slate-900">
        <div className="flex flex-col gap-2 p-8">
          <p className="flex justify-center text-3xl text-gray-300 tracking-wider font-bold mb-1">
            <img
              src="public/chhatify clone.png"
              alt=""
              className="size-11 rounded-lg mr-3"
            />
            Welcome to Chhatify!!
          </p>
          <p className="text-center text-gray-300 mb-3">Create your account</p>
          {error && (
            <p className="alert alert-error mb-3 text-white rounded-lg text-center">
              {error?.response?.data?.message || "Something went wrong!"}
            </p>
          )}
          <form
            className="flex flex-col gap-4"
            onChange={(e) =>
              setSignupData({ ...signupData, [e.target.id]: e.target.value })
            }
            onSubmit={handleSignup}
          >
            <input
              id="fullName"
              className="bg-slate-900 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800 text-white"
              placeholder="Full name"
              type="text"
              value={signupData.fullName}
            />
            <input
              id="email"
              className="bg-slate-900 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800 text-white"
              placeholder="Email"
              type="email"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
            />
            <input
              id="password"
              className="bg-slate-900 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800 text-white color-[white]"
              placeholder="Password - should be at least 6 characters"
              type="password"
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
            />
            <input
              id="confirmPassword"
              className="bg-slate-900 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800 text-white"
              placeholder="Confirm password"
              type="password"
              value={signupData.confirmPassword}
              onChange={(e) =>
                setSignupData({
                  ...signupData,
                  confirmPassword: e.target.value,
                })
              }
            />
            <button
              type="submit"
              className="inline-block cursor-pointer rounded-md bg-gray-700 px-4 py-3.5 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 active:scale-95"
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
            <label className="flex cursor-pointer items-center justify-center gap-1 p-0.1 text-slate-400">
              already have an account?
              <div className="relative inline-block">
                <Link to="/login" className="text-blue-700 underline">
                  login
                </Link>
              </div>
            </label>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
