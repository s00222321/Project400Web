"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/authContext";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navigation = () => {
  const { isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#042d61] text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* logo & title */}
        <Link href={isLoggedIn ? "/dashboard" : "#"} className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Touch & Response Logo"
            width={100}
            height={100}
            className="w-20 h-20 object-contain"
          />
          <h1 className="text-2xl font-bold tracking-wide">Touch & Response</h1>
        </Link>

        {/* desktop navigation */}
        {isLoggedIn && (
          <nav className="hidden md:flex space-x-6 items-center">
            <button
              onClick={logout}
              className="bg-[#FFA76E] text-[#042d61] px-5 py-2 font-semibold rounded-lg hover:bg-[#1e487a] hover:text-white transition-all"
            >
              Log Out
            </button>
          </nav>
        )}

        {/* mobile menu toggle */}
        {isLoggedIn && (
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        )}
      </div>

      {/* mobile navigation menu */}
      {isLoggedIn && menuOpen && (
        <nav className="md:hidden bg-[#1e487a] text-center py-4">
          <button
            onClick={logout}
            className="mt-2 bg-[#FFA76E] text-[#042d61] px-6 py-2 font-semibold rounded-lg hover:bg-[#042d61] hover:text-white transition-all"
          >
            Log Out
          </button>
        </nav>
      )}
    </header>
  );
};

export default Navigation;
