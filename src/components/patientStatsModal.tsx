import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchActions } from "@/services/apiService";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Preferences {
  hand: string;
  calibration: number;
}

interface User {
  _id: string;
  username: string;
  preferences: Preferences;
}

interface Action {
  _id: string;
  reactionTime: number;
  finger: string;
  hand: string;
  gameMode: string;
  timestamp: string;
}

interface Props {
  patient: User;
  onClose: () => void;
}

export default function PatientStatsModal({ patient, onClose }: Props) {
  const [actions, setActions] = useState<Action[]>([]);
  const [filteredActions, setFilteredActions] = useState<Action[]>([]); // State for filtered actions
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedFinger, setSelectedFinger] = useState<string>("Index"); // Default selected finger

  useEffect(() => {
    const fetchPatientActions = async () => {
      try {
        const response = await fetchActions(patient._id);
        setActions(response.data);
        setFilteredActions(response.data); // Initially, no filter applied
        setLoading(false);
      } catch (err) {
        setError("Failed to load actions.");
        setLoading(false);
      }
    };

    fetchPatientActions();
  }, [patient._id]);

  // Handle finger filter change
  const handleFingerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedFinger(selected);

    // Filter actions by the selected finger
    const filtered = actions.filter((action) => action.finger === selected);
    setFilteredActions(filtered);
  };

  // Prepare chart data
  const chartData = {
    labels: filteredActions.map((action) => new Date(action.timestamp).toLocaleString()),
    datasets: [
      {
        label: `${selectedFinger} Finger Reaction Time`,
        data: filteredActions.map((action) => action.reactionTime),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw} ms`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Timestamp",
        },
      },
      y: {
        title: {
          display: true,
          text: "Reaction Time (ms)",
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">{patient.username}'s Stats</h2>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">{patient.username}'s Stats</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  <div className="bg-white p-6 rounded-lg shadow-lg max-w-screen-lg w-full flex flex-col items-center"> {/* Added flexbox properties */}
    <h2 className="text-xl font-bold mb-4 text-center">{patient.username}'s Stats</h2> {/* Centered title */}
    <p className="text-gray-600 text-center">Affected Limb: {patient.preferences.hand}</p> {/* Centered text */}

    <h3 className="text-lg font-semibold mt-4 text-center">Reaction Time Over Time</h3> {/* Centered subtitle */}

    {/* Finger Selection Dropdown */}
    <div className="mt-4 mb-2 text-center"> {/* Center the dropdown */}
      <label htmlFor="fingerSelect" className="mr-2">Select Finger:</label>
      <select
        id="fingerSelect"
        value={selectedFinger}
        onChange={handleFingerChange}
        className="p-2 border border-gray-300 rounded"
      >
        <option value="Index">Index</option>
        <option value="Middle">Middle</option>
        <option value="Ring">Ring</option>
        <option value="Pinkie">Pinkie</option>
      </select>
    </div>

    {filteredActions.length > 0 ? (
      <div className="mt-2 w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    ) : (
      <p className="text-gray-600 mt-2 text-center">No actions found for the selected finger.</p>
    )}

    <button
      onClick={onClose}
      className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Close
    </button>
  </div>
</div>

  );
}
