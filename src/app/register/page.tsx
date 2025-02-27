"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { registerTherapist, loginTherapist } from "@/services/authService";

export default function RegisterPage() {
  const router = useRouter();

  const { setIsLoggedIn, setToken } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time validation errors
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Final validation before submitting
    if (!username) return setUsernameError("Username is required.");
    if (!isValidEmail(email)) return setEmailError("Invalid email format.");
    if (!isValidPassword(password)) return setPasswordError("Must be 8+ characters, include 1 uppercase, 1 lowercase, and 1 number.");
    if (password !== confirmPassword) return setConfirmPasswordError("Passwords do not match.");

    setIsSubmitting(true);

    try {
      const therapist = await registerTherapist(username, password, email);
      setSuccess("Registration successful! You can now log in.");
      console.log("Registered:", therapist);
      const loginResponse = await loginTherapist(username, password);
      if ("error" in loginResponse) {
        setError(loginResponse.error);
      } else {
        setToken(loginResponse.token);
        setIsLoggedIn(true);
        router.push("/dashboard"); // Redirect to dashboard on success
      }
    } catch (err) {
      setError("Registration failed. Please try again." + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-[#5C9DF5] mb-6">
          Create a Touch & Response Account
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError(e.target.value.length >= 3 ? "" : "Username must be at least 3 characters.");
              }}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter your username"
              required
            />
            {usernameError && <p className="text-xs text-red-500 mt-1">{usernameError}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(isValidEmail(e.target.value) ? "" : "Invalid email format.");
              }}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              required
            />
            {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(isValidPassword(e.target.value) ? "" : "Must be 8+ characters, include 1 uppercase, 1 lowercase, 1 number.");
              }}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
              required
            />
            {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError(e.target.value === password ? "" : "Passwords do not match.");
              }}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Confirm your password"
              required
            />
            {confirmPasswordError && <p className="text-xs text-red-500 mt-1">{confirmPasswordError}</p>}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-[#FFA76E] text-white rounded-md hover:bg-[#1F9F8A] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={
              isSubmitting ||
              !!usernameError ||
              !!emailError ||
              !!passwordError ||
              !!confirmPasswordError ||
              !username ||
              !email ||
              !password ||
              !confirmPassword
            }
          >
            {isSubmitting ? "Registering..." : "Register"}
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
