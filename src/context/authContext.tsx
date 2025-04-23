"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import toast from "react-hot-toast";

// define the shape of the auth context
type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
};

// create a context for authentication
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // check for existing token in session storage on mount
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
    setLoading(false); // done loading after checking storage
  }, []);

  // automatically logout when token expires
  useEffect(() => {
    if (token) {
      try {
        // decode JWT token payload to get expiry time
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        const expiry = exp * 1000 - Date.now(); // convert to ms and get remaining time

        if (expiry > 0) {
          // schedule auto-logout at expiry
          const timer = setTimeout(() => {
            toast("Session expired. You've been logged out.");
            logout();
          }, expiry);

          return () => clearTimeout(timer); // clean up on token change or unmount
        } else {
          // if token already expired
          toast("Session expired. You've been logged out.");
          logout();
        }
      } catch (err) {
        console.error("Invalid token:", err);
        toast.error("Invalid session. Please log in again.");
        logout();
      }
    }
  }, [token]);

  // helper to update token in state and sessionStorage
  const setAuthToken = (newToken: string | null) => {
    if (newToken) {
      sessionStorage.setItem("token", newToken);
      setToken(newToken);
      setIsLoggedIn(true);
    } else {
      sessionStorage.removeItem("token");
      setToken(null);
      setIsLoggedIn(false);
    }
  };

  const login = (token: string) => setAuthToken(token);
  const logout = () => setAuthToken(null);

  return (
    //provide auth state and actions to children components
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
