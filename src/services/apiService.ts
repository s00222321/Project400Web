const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Preferences {
  hand: string;
  calibration: number;
}

export interface User {
    _id: string;
    username: string;
    therapistId: string;
    preferences: Preferences;
}

// function to register a user
export const registerUser = async (username: string, password: string, therapistId: string, hand: string) => {
    try {
    const response = await fetch(`${API_URL}/user/register-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, therapistId, hand }),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// function to fetch patients for a given therapist
export const fetchPatients = async (therapistId: string): Promise<User[]> => {
    try {
        const response = await fetch(`${API_URL}/user/users/${therapistId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch patients");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching patients:", error);
        return [];
    }
};

// function to fetch actions for a given user	
export const fetchActions = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/data/get-actions/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch actions");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching actions:", error);
    return { data: [] };
  }
};

// function to fetch trends for a given user
export const fetchTrends = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/data/trends/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch trends");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching trends:", error);
    return { data: [] };
  }
};