const API_URL = process.env.NEXT_PUBLIC_API_URL;

// define therapist and login response types
export interface Therapist {
  _id: string;
  username: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  therapist: Therapist;
}

// function to log in and get an authentication token
export const loginTherapist = async (
  username: string,
  password: string
): Promise<LoginResponse | { error: string }> => {
  try {
    const response = await fetch(`${API_URL}/auth/login-therapist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { error: "Invalid username or password" };
      } else {
        return { error: "There was a problem logging in, please try again" };
      }
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    return { error: "There was a problem logging in, please try again" };
  }
};

// function to register a therapist
export const registerTherapist = async (username: string, password: string, email: string): Promise<Therapist> => {
  try {
    const response = await fetch(`${API_URL}/auth/register-therapist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status}`);
    }

    const data: Therapist = await response.json();
    return data; // Return the therapist details after successful registration
  } catch (error) {
    console.error('Error registering therapist:', error);
    throw error;
  }
};