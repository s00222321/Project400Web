"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { fetchActions } from "@/services/apiService";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface User {
  _id: string;
  username: string;
  preferences: { hand: string };
}

interface Action {
  _id: string;
  reactionTime: number;
  finger: string;
  timestamp: string;
}

interface Props {
  patient: User;
  onClose: () => void;
}

export default function PatientStatsModal({ patient, onClose }: Props) {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFinger, setSelectedFinger] = useState("Index");

  useEffect(() => {
    fetchActions(patient._id)
      .then((res) => setActions(res.data))
      .catch(() => setError("Failed to load actions."))
      .finally(() => setLoading(false));
  }, [patient._id]);

  const filteredActions = actions.filter((a) => a.finger === selectedFinger);

  const chartData = useMemo(() => ({
    labels: filteredActions.map((a) => new Date(a.timestamp).toLocaleString()),
    datasets: [
      {
        label: `${selectedFinger} Finger Reaction Time`,
        data: filteredActions.map((a) => a.reactionTime),
        borderColor: "#1e487a",
        backgroundColor: "rgba(30, 72, 122, 0.2)",
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 4,
        pointBackgroundColor: "#FFA76E",
      },
    ],
  }), [filteredActions, selectedFinger]);

  if (loading || error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg text-center">
          <h2 className="text-2xl font-bold text-[#042d61]">{patient.username}&apos;s Stats</h2>
          <p className="text-gray-600 mt-4">{loading ? "Loading data..." : error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl transition-transform transform scale-100">
        <h2 className="text-3xl font-bold text-[#042d61] text-center">{patient.username}&apos;s Stats</h2>
        <p className="text-gray-600 text-center mt-2">Affected Limb: <span className="font-semibold">{patient.preferences.hand}</span></p>

        {/* Finger Selection Dropdown */}
        <div className="mt-6 flex justify-center">
          <label className="block text-lg font-semibold text-gray-700">
            Select Finger:
            <select 
              value={selectedFinger} 
              onChange={(e) => setSelectedFinger(e.target.value)}
              className="ml-2 p-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              {["Index", "Middle", "Ring", "Pinkie"].map((finger) => (
                <option key={finger} value={finger}>{finger}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Chart Display */}
        <div className="mt-6 w-full h-[350px] bg-gray-100 p-4 rounded-lg">
          {filteredActions.length ? (
            <Line 
              data={chartData} 
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          ) : (
            <p className="text-gray-600 mt-4 text-center">No actions found for {selectedFinger} finger.</p>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-center">
          <button 
            onClick={onClose} 
            className="bg-[#042d61] text-white px-6 py-3 rounded-lg hover:bg-[#1e487a] transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
