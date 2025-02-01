"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would send username and password to your API for validation
    if (username === "test" && password === "password123") {
      // Mock login success
      console.log("Logged in!");
      // Redirect or handle successful login
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-[#5C9DF5] mb-6">
          Login to Touch&Response
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-[#FFA76E] text-white rounded-md hover:bg-[#1F9F8A] transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#5C9DF5] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
