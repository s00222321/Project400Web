"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { registerTherapist, loginTherapist } from "@/services/authService";
import Image from "next/image";

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

  // Validation errors
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

    // Validation checks
    if (!username) return setUsernameError("Username is required.");
    if (!isValidEmail(email)) return setEmailError("Invalid email format.");
    if (!isValidPassword(password)) return setPasswordError("Must be 8+ characters, include 1 uppercase, 1 lowercase, and 1 number.");
    if (password !== confirmPassword) return setConfirmPasswordError("Passwords do not match.");

    setIsSubmitting(true);

    try {
      await registerTherapist(username, password, email);
      setSuccess("Registration successful! You can now log in.");

      const loginResponse = await loginTherapist(username, password);
      if ("error" in loginResponse) {
        setError(loginResponse.error);
      } else {
        setToken(loginResponse.token);
        setIsLoggedIn(true);
        router.push("/dashboard"); // Redirect on success
      }
    } catch (err) {
      setError("Registration failed. Please try again." + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section - Register Form */}
      <div className="w-1/2 flex items-center justify-center bg-white p-12 rounded-lg">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h2>
          <p className="text-gray-500 mb-6">Please enter your details</p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError(e.target.value.length >= 3 ? "" : "Username must be at least 3 characters.");
                }}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
                required
              />
              {usernameError && <p className="text-xs text-red-500 mt-1">{usernameError}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(isValidEmail(e.target.value) ? "" : "Invalid email format.");
                }}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
              {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(isValidPassword(e.target.value) ? "" : "Must be 8+ characters, include 1 uppercase, 1 lowercase, 1 number.");
                }}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
              {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError(e.target.value === password ? "" : "Passwords do not match.");
                }}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                required
              />
              {confirmPasswordError && <p className="text-xs text-red-500 mt-1">{confirmPasswordError}</p>}
            </div>

            <div className="flex justify-between text-sm">
              <span></span>
              <p className="mt-4 text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-[#5C9DF5] hover:underline">
                  Login here
                </Link>
              </p>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className={`w-full py-3 mt-4 text-white font-medium rounded-md transition-all ${username && email && password && confirmPassword && !usernameError && !emailError && !passwordError && !confirmPasswordError
                  ? "bg-[#042d61] hover:bg-[#1e487a]"
                  : "bg-gray-400 cursor-not-allowed"
                }`}
              disabled={isSubmitting || !!usernameError || !!emailError || !!passwordError || !!confirmPasswordError}
            >
              {isSubmitting ? "Registering..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Section - Illustration & Branding */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-[#F5F7FB] px-12">
        <h2 className="text-2xl font-bold text-gray-900">Touch & Response</h2>
        <p className="text-gray-500 mt-2">Stroke recovery, one touch at a time</p>
        <Image
          src="/login_image.png" // Ensure this is in the public folder or an accessible path
          alt="Register Illustration"
          width={500} // Adjust width as needed
          height={400} // Adjust height as needed
          priority // Helps with faster loading
        />
      </div>
    </div>
  );
}
