"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { fetchPatients, User } from "@/services/apiService";
import ProtectedRoute from "@/components/protectedRoute";
import CreatePatientModal from "@/components/createPatientModal";
import PatientStatsModal from "@/components/patientStatsModal";

export default function Dashboard() {
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [therapistId, setTherapistId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);

  // Decode JWT token and set therapistId
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
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
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPatients();
  }, [therapistId]); // Runs when therapistId changes

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openStatsModal = (patient: User) => setSelectedPatient(patient);
  const closeStatsModal = () => setSelectedPatient(null);

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-8 bg-gray-100">
        {/* Header */}
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Stroke Recovery Dashboard</h1>
          <button 
            onClick={openModal} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Patient
          </button>
        </header>

        {/* Patient List */}
        <main className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-center text-gray-600">Loading patients...</p>
          ) : (
            patients.map((patient) => (
              <div 
                key={patient._id} 
                onClick={() => openStatsModal(patient)}
                className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition"
              >
                <h2 className="text-lg font-semibold">{patient.username}</h2>
                <p className="text-gray-600">Affected Limb: {patient.preferences.hand}</p>
              </div>
            ))
          )}
        </main>

        {/* Patient Modals */}
        <CreatePatientModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          therapistId={therapistId || ""}
        />
        {selectedPatient && (
          <PatientStatsModal patient={selectedPatient} onClose={closeStatsModal} />
        )}
      </div>
    </ProtectedRoute>
  );
}
