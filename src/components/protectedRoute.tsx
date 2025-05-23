"use client";

import { useAuth } from "@/context/authContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      
      router.push("/login"); // redirect if not logged in
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null; // prevent rendering before redirecting

  return <>{children}</>;
};

export default ProtectedRoute;
