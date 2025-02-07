import React, { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { fetchActions } from "@/services/apiService";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

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
    datasets: [{
      label: `${selectedFinger} Finger Reaction Time`,
      data: filteredActions.map((a) => a.reactionTime),
      borderColor: "rgba(75,192,192,1)",
      tension: 0.1,
    }],
  }), [filteredActions, selectedFinger]);

  if (loading || error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
          <h2 className="text-xl font-bold">{patient.username}'s Stats</h2>
          <p className="text-gray-600">{loading ? "Loading data..." : error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">{patient.username}'s Stats</h2>
        <p className="text-gray-600 mb-2">Affected Limb: {patient.preferences.hand}</p>

        <label className="mt-4 block text-lg font-semibold">
          Select Finger:
          <select value={selectedFinger} onChange={(e) => setSelectedFinger(e.target.value)}
            className="ml-2 p-2 border rounded">
            {["Index", "Middle", "Ring", "Pinkie"].map((finger) => (
              <option key={finger} value={finger}>{finger}</option>
            ))}
          </select>
        </label>

        {filteredActions.length ? (
          <div className="mt-6 w-full h-[400px]">
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        ) : (
          <p className="text-gray-600 mt-4">No actions found for {selectedFinger} finger.</p>
        )}

        <button onClick={onClose} className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">
          Close
        </button>
      </div>
    </div>
  );
}
