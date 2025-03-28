"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { fetchTrends } from "@/services/apiService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { X } from "lucide-react"; // Importing an 'X' close icon

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface User {
  _id: string;
  username: string;
  preferences: { hand: string };
}

interface Props {
  patient: User;
  onClose: () => void;
}

interface TrendsData {
  daily_average_reaction_time: Record<string, number>;
  weekly_average_reaction_time: Record<string, number>;
  descriptive_statistics: {
    count: number;
    mean: number;
  };
  game_mode_performance: {
    game: number;
    classic: number;
  };
}

export default function PatientStatsModal({ patient, onClose }: Props) {
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTrend, setSelectedTrend] = useState("daily");

  useEffect(() => {
    fetchTrends(patient._id)
      .then((res) => {
        console.log("Fetched Trends:", res);
        if (res.error) {
          setError("No data available for this patient.");
        } else {
          setTrends(res);
        }
      })
      .catch(() => setError("Failed to load trends."))
      .finally(() => setLoading(false));
  }, [patient._id]);

  const chartData = useMemo(() => {
    if (!trends) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const trendData =
      selectedTrend === "daily" ? trends.daily_average_reaction_time : trends.weekly_average_reaction_time;

    return {
      labels: Object.keys(trendData),
      datasets: [
        {
          label: `Average Reaction Time (${selectedTrend.charAt(0).toUpperCase() + selectedTrend.slice(1)})`,
          data: Object.values(trendData),
          borderColor: "#1e487a",
          backgroundColor: "rgba(30, 72, 122, 0.2)",
          borderWidth: 2,
          tension: 0.2,
          pointRadius: 4,
          pointBackgroundColor: "#FFA76E",
        },
      ],
    };
  }, [selectedTrend, trends]);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Close modal when clicking outside
    >
      <div 
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl relative transition-transform transform scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Close Button (Small 'X' in the corner) */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-[#042d61] text-center">{patient.username}&apos;s Stats</h2>
        <p className="text-gray-600 text-center mt-2">
          Affected Limb: <span className="font-semibold">{patient.preferences.hand}</span>
        </p>

        {/* Loading or Error Message */}
        {loading ? (
          <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-50"></div>
          </div>
        ) : error ? (
          <p className="text-gray-600 mt-4 text-center">{error}</p>
        ) : (
          <>
            {/* Trend Selection Dropdown */}
            <div className="mt-4 flex justify-center">
              <label className="block text-lg font-semibold text-gray-700">
                View Trend:
                <select 
                  value={selectedTrend} 
                  onChange={(e) => setSelectedTrend(e.target.value)}
                  className="ml-2 p-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily Average</option>
                  <option value="weekly">Weekly Average</option>
                </select>
              </label>
            </div>

            {/* Chart Display */}
            <div className="mt-6 w-full h-[350px] bg-gray-100 p-4 rounded-lg">
              <Line 
                data={chartData} 
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>

            {/* Key Insights */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">Performance Insights</h3>
              {trends ? (
                <ul className="text-sm text-gray-600">
                  <li>Total Actions Recorded: <span className="font-semibold">{trends.descriptive_statistics.count}</span></li>
                  <li>Average Reaction Time: <span className="font-semibold">{Math.round(trends.descriptive_statistics.mean)} ms</span></li>
                  <li>Average Game Mode Performance: <span className="font-semibold">{Math.round(trends.game_mode_performance.game)} ms</span></li>
                  <li>Average Classic Mode Performance: <span className="font-semibold">{Math.round(trends.game_mode_performance.classic)} ms</span></li>
                </ul>
              ) : (
                <p className="text-gray-600">No significant trends available.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
