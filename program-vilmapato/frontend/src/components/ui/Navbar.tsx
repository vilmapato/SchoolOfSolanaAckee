"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/ui/LogoutButton";

export default function Navbar() {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [role, setRole] = useState<"cleaner" | "client" | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("userRole");
      if (storedRole === "cleaner" || storedRole === "client") {
        setRole(storedRole);
      }
    }
  }, []);

  const handleDashboardRedirect = () => {
    if (role) {
      router.push(`/dashboard/${role}`);
    } else {
      router.push("/");
    }
  };

  return (
    <nav className="w-full bg-transparent text-white px-6 py-4 shadow-md flex justify-between items-center">
      <div className="flex space-x-6 items-center">
        <Link
          href="/"
          className="text-xl font-bold hover:text-purple-200 transition"
        >
          FindingMyMaid
        </Link>

        <button
          onClick={handleDashboardRedirect}
          className="text-sm hover:text-purple-200 transition"
        >
          Home
        </button>
      </div>

      {publicKey && (
        <>
          <div className="text-sm font-mono bg-white text-purple-700 px-2 py-1 rounded">
            {publicKey.toBase58().slice(0, 4)}...
            {publicKey.toBase58().slice(-4)}
          </div>
          <LogoutButton />
        </>
      )}
    </nav>
  );
}

{
  /* Navigation */
}
<nav className="flex justify-between items-center p-6 text-white relative z-10">
  <div className="flex items-center space-x-6">
    <span className="text-lg">›</span>
    <span className="text-lg">»</span>
    <span className="hover:text-purple-300 cursor-pointer">Explore</span>
    <span className="hover:text-purple-300 cursor-pointer">Resources</span>
  </div>
  <div className="flex items-center space-x-6">
    <span className="hover:text-purple-300 cursor-pointer">Contact</span>
    <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center">
      <span className="text-sm">C</span>
      <span className="text-xs ml-1">0</span>
    </div>
  </div>
</nav>;
