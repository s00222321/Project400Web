"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // NEW: Track loading state

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
    setLoading(false); // Done loading after checking storage
  }, []);

  const setAuthToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("token");
      setToken(null);
      setIsLoggedIn(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, setToken: setAuthToken, setIsLoggedIn, logout, loading }}>
      {!loading && children} {/* NEW: Prevent rendering until loading is finished */}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
