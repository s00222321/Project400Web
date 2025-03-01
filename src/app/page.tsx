"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard"); // Redirect to dashboard immediately
  }, [router]);

  return null; // Prevents the "Welcome to the Page" from flashing before redirect
}