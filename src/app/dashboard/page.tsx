"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { fetchPatients, User } from "@/services/apiService";
import ProtectedRoute from "@/components/protectedRoute";
import CreatePatientModal from "@/components/createPatientModal";
import PatientStatsModal from "@/components/patientStatsModal";

interface DecodedJWT {
  id: string;
}

export default function Dashboard() {
  const [patients, setPatients] = useState<User[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [therapistId, setTherapistId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);

  // Decode JWT token and set therapistId
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedJWT>(token);
        setTherapistId(decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Fetch patients when therapistId is available
  useEffect(() => {
    async function loadPatients() {
      try {
        if (therapistId) {
          const data = await fetchPatients(therapistId);
          setPatients(data);
          setFilteredPatients(data); // Set initial filtered state
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPatients();
  }, [therapistId]);

  // Filter patients based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter((patient) =>
        patient.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openStatsModal = (patient: User) => setSelectedPatient(patient);
  const closeStatsModal = () => setSelectedPatient(null);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F5F5F5] p-8">
        {/* Header */}
        <header className="mb-6 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-[#042d61]">Stroke Recovery Dashboard</h1>
          
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-4 md:mt-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e487a] w-full md:w-1/3"
          />

          {/* Add Patient Button */}
          <button
            onClick={openModal}
            className="mt-4 md:mt-0 bg-[#042d61] text-white px-6 py-2 rounded-lg hover:bg-[#1e487a] transition-all"
          >
            + Add Patient
          </button>
        </header>

        {/* Patient List */}
        <main className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="flex justify-center items-center col-span-full">
              <p className="text-gray-600 text-lg animate-pulse">Loading patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">No matching patients found.</p>
          ) : (
            filteredPatients.map((patient) => (
              <div
                key={patient._id}
                onClick={() => openStatsModal(patient)}
                className="p-6 bg-white rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              >
                <h2 className="text-lg font-semibold text-[#042d61]">{patient.username}</h2>
                <p className="text-gray-600">Affected Limb: {patient.preferences.hand}</p>
              </div>
            ))
          )}
        </main>

        {/* Modals */}
        <CreatePatientModal isOpen={isModalOpen} onClose={closeModal} therapistId={therapistId || ""} />
        {selectedPatient && <PatientStatsModal patient={selectedPatient} onClose={closeStatsModal} />}
      </div>
    </ProtectedRoute>
  );
}
