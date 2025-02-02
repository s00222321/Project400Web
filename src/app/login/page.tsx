"use client";
import { useState } from "react";
import Link from "next/link";
import { login } from "@/services/apiService";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset previous errors
    setIsLoading(true);

    const result = await login(username, password);

    if ("error" in result) {
        setError(result.error); // Display error in the UI
        setIsLoading(false);
        return;
    }

    console.log("Logged in! Token: ", result.token);
    window.location.href = "/dashboard"; // Redirect after successful login
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-[#5C9DF5] mb-6">
          Login to Touch & Response
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm text-gray-700">Username</label>
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

          <div>
            <label htmlFor="password" className="block text-sm text-gray-700">Password</label>
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

          <button
            type="submit"
            className={`w-full py-2 mt-4 text-white rounded-md transition-colors ${
              username && password ? "bg-[#FFA76E] hover:bg-[#1F9F8A]" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!username || !password || isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
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
