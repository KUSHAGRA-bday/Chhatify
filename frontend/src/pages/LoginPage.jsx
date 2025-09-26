import React from "react";
import { useState } from "react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, mutate: loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
      data-theme="cyberpunk"
    >
      <div className="w-auto max-w-md rounded-lg bg-gray-900 p-8 shadow-lg">
        <div>
          <div>
            <h1 className="flex justify-center text-3xl text-gray-300 tracking-wider font-bold mb-1">
              <img
                src="public/chhatify clone.png"
                alt=""
                className="size-11 mr-3 rounded-lg"
              />
              Welcome Back!!
            </h1>
          </div>
        </div>
        <p className="text-center text-gray-300 tracking-wider font-bold mb-1 mt-0">
          Login to your account
        </p>
        {/* error */}
        {error && (
          <div className="alert alert-error mb-4 text-white rounded-lg text-center">
            {error?.response?.data?.message}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          onChange={(e) =>
            setLoginData({ ...loginData, [e.target.id]: e.target.value })
          }
        >
          {/* Email */}
          <input
            id="email"
            className="bg-slate-900 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800 text-white my-3"
            placeholder="Email"
            type="email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
          />
          {/* password */}
          <input
            id="password"
            className="bg-slate-900 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800 text-white"
            placeholder="Password"
            type="password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
          <button
            type="submit"
            className="inline-block cursor-pointer rounded-md bg-gray-700 px-4 py-3.5 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 active:scale-95 min-w-full mt-2 mb-2"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>{" "}
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
          <label className="flex cursor-pointer items-center gap-1 p-0.1 text-slate-400 justify-center">
            didn't have an account?
            <div className="relative inline-block">
              <Link to="/signup" className="text-blue-700 underline">
                sign up
              </Link>
            </div>
          </label>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
