"use client";

import RegisterClientForm from "@/components/RegisterClientForm";
import WalletSection from "@/components/WalletSection";

export default function RegisterClientPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">Register as Client 🧑‍💼</h1>
      <WalletSection />
      <RegisterClientForm />
    </main>
  );
}
