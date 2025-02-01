"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Here, you would send the registration data to your API
    console.log("Registered with", { username, email, password });

    // Redirect or handle successful registration
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-[#5C9DF5] mb-6">
          Create a Touch&Response Account
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
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

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
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

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-[#FFA76E] text-white rounded-md hover:bg-[#1F9F8A] transition-colors"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-[#5C9DF5] hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
