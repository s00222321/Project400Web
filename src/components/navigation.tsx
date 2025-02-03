"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/authContext";

const Navigation = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 bg-[#5C9DF5] text-white shadow-md">
      {/* Always show the title, but link to dashboard only if logged in */}
      <Link href={isLoggedIn ? "/dashboard" : "#"} className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Touch&Response Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <h1 className="text-2xl font-bold tracking-wide">Touch & Response</h1>
      </Link>

      {/* Show navigation only if the user is logged in */}
      {isLoggedIn && (
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/settings" className="hover:text-[#FFA76E] transition-colors">
                Settings
              </Link>
            </li>
            <li>
              <button onClick={logout} className="hover:text-[#FFA76E] transition-colors">
                Log Out
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navigation;
