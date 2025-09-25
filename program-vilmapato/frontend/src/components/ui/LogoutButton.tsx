// components/ui/LogoutButton.tsx
"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function LogoutButton() {
  const { disconnect } = useWallet();
  const router = useRouter();

  const handleLogout = async () => {
    await disconnect();
    router.push("/");
  };

  return (
    <Button
      className="text-sm font-mono bg-white text-purple-700 px-2 py-1 rounded"
      variant="destructive"
      onClick={() => {
        console.log("Logging out...");
        handleLogout();
      }}
    >
      Logout
    </Button>
  );
}
