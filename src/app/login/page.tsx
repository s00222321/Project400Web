"use client";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { loginTherapist } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setIsLoggedIn, setToken } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset previous errors
    setIsLoading(true);

    const result = await loginTherapist(username, password);

    if ("error" in result) {
      setError(result.error);
      setIsLoading(false);
      return;
    }
    setToken(result.token);
    setIsLoggedIn(true);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section - Login Form */}
      <div className="w-1/2 flex items-center justify-center bg-white p-12 rounded-lg">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-6">Please enter your details</p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex justify-between text-sm">
              <span></span>
              <p className="mt-4 text-center">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-[#5C9DF5] hover:underline">
                  Register here
                </Link>
              </p>
            </div>

            <button
              type="submit"
              className={`w-full py-3 mt-4 text-white font-medium rounded-md transition-all ${username && password ? "bg-[#042d61] hover:bg-[#1e487a]" : "bg-gray-400 cursor-not-allowed"
                }`}
              disabled={!username || !password || isLoading}
            >
              {isLoading ? "Logging in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Section - Illustration & Branding */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-[#F5F7FB] px-12">
        <h2 className="text-2xl font-bold text-gray-900">Touch & Response</h2>
        <p className="text-gray-500 mt-2">Stroke recovery, one touch at a time</p>
        <img
          src="/login_image.png" // Replace with actual image
          alt="Login Illustration"
          className="w-4/4 mt-8"
        />
      </div>
    </div>
  );
}
