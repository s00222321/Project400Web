"use client";

import { useState } from "react";
import { registerUser } from "@/services/apiService";

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  therapistId: string;
}

export default function CreatePatientModal({ isOpen, onClose, therapistId }: PatientModalProps) {
  const [username, setUsername] = useState("");
  const [affectedLimb, setAffectedLimb] = useState("Left");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation errors
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Final validation before submitting
    if (!username) return setUsernameError("Username is required.");
    if (!isValidPassword(password)) return setPasswordError("Must be 8+ characters, include 1 uppercase, 1 lowercase, and 1 number.");
    if (password !== confirmPassword) return setConfirmPasswordError("Passwords do not match.");
    if (!therapistId) return setError("Therapist ID is missing.");

    setLoading(true);
    try {
      await registerUser(username, password, therapistId, affectedLimb);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      onClose();
    } catch (error) {
      setError("Registration failed. Please try again." + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } bg-black bg-opacity-50`}
    >
      <div className={`bg-white p-8 rounded-xl shadow-xl w-full max-w-lg transition-transform transform ${isOpen ? "scale-100" : "scale-95"
        }`}>

        <h2 className="text-2xl font-bold text-[#042d61] mb-6 text-center">Add New Patient</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter patient name"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError(e.target.value.length >= 3 ? "" : "Username must be at least 3 characters.");
              }}
            />
            {usernameError && <p className="text-xs text-red-500 mt-1">{usernameError}</p>}
          </div>

          {/* Affected Limb Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Affected Limb</label>
            <select
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
              value={affectedLimb}
              onChange={(e) => setAffectedLimb(e.target.value)}
            >
              <option value="Left">Left</option>
              <option value="Right">Right</option>
            </select>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(isValidPassword(e.target.value) ? "" : "Must be 8+ characters, include 1 uppercase, 1 lowercase, 1 number.");
              }}
            />
            {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError(e.target.value === password ? "" : "Passwords do not match.");
              }}
            />
            {confirmPasswordError && <p className="text-xs text-red-500 mt-1">{confirmPasswordError}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 text-white rounded-lg transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#042d61] hover:bg-[#1e487a]"
                }`}
              disabled={loading || !!usernameError || !!passwordError || !username || !password}
            >
              {loading ? "Registering..." : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
