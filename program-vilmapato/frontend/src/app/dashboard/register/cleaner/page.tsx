"use client";

import RegisterCleanerForm from "@/components/RegisterCleanerForm";
import WalletSection from "@/components/WalletSection";

export default function RegisterCleanerPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">Register as Cleaner 🧹</h1>
      <WalletSection />
      <RegisterCleanerForm />
    </main>
  );
}
