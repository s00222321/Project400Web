"use client";

import { useEffect, useState } from "react";

interface Preferences {
  hand: string;
  calibration: number;
}

interface User {
  _id: string;
  username: string;
  preferences: Preferences;
  progress: number; // Example field for progress
  affectedLimb: string; // Example field for affected limb
  lastSession: string; // Example field for last session
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function StrokeRecoveryDashboard() {
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch(`${API_URL}/user/users`);
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        const data = await response.json();
        // Assuming the response contains a list of users and their relevant fields
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading patients...</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      {/* Header */}
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Stroke Recovery Dashboard</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Patient
        </button>
      </header>

      {/* Patient List */}
      <main className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient) => (
          <div key={patient._id} className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{patient.username}</h2>
            <p className="text-gray-600">Affected Limb: {patient.preferences.hand}</p>
            <p className="text-gray-600">Recovery Progress: {patient.progress}%</p>
            <p className="text-gray-600">Last Session: {patient.lastSession}</p>
          </div>
        ))}
      </main>
    </div>
  );
}
