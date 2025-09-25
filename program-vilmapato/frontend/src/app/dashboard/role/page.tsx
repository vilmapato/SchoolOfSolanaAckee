"use client";

import { useRouter } from "next/navigation";

export default function RoleChooser() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center mt-10 space-y-4">
      <h2 className="text-xl font-semibold">You have both roles</h2>
      <button
        onClick={() => router.push("/dashboard/client")}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Enter Client Dashboard
      </button>
      <button
        onClick={() => router.push("/dashboard/cleaner")}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Enter Cleaner Dashboard
      </button>
    </div>
  );
}
