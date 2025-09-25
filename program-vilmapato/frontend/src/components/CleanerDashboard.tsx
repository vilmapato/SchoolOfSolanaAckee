"use client";

import { useEffect, useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Idl, Program, AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import rawIdl from "@/idl/findingmymaid.json";
import Navbar from "./ui/Navbar";

const idl = rawIdl as unknown as Idl;

type JobAccount = {
  location: string;
  date: string;
  duration: number;
  totalCost: number;
  completed: boolean;
  client: PublicKey;
};

export default function CleanerDashboard() {
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  const [jobs, setJobs] = useState<JobAccount[]>([]);
  const [status, setStatus] = useState("");

  const fetchCleanerJobs = useCallback(async () => {
    if (!publicKey || !signTransaction || !signAllTransactions) return;

    try {
      setStatus("Loading your jobs...");

      const provider = new AnchorProvider(
        connection,
        { publicKey, signTransaction, signAllTransactions },
        { commitment: "confirmed" }
      );
      const program = new Program(idl, provider);

      // 🔑 Derive your cleaner PDA
      const [cleanerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("cleaner"), publicKey.toBuffer()],
        program.programId
      );

      const allJobs = await program.account.job.all();

      const cleanerJobs = allJobs
        .filter((j) => j.account.cleaner.equals(cleanerPda))
        .map((j) => j.account as JobAccount);

      setJobs(cleanerJobs);
      setStatus("");
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Failed to fetch jobs");
    }
  }, [publicKey, signTransaction, signAllTransactions, connection]);

  useEffect(() => {
    fetchCleanerJobs();
  }, [fetchCleanerJobs]);

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <Navbar />
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">
            🧹 Jobs Assigned to You
          </h2>

          {status && <p className="mb-4 text-gray-600">{status}</p>}

          {jobs.length === 0 && !status && (
            <p className="text-gray-500">No jobs assigned to you yet.</p>
          )}

          <ul className="space-y-4">
            {jobs.map((job, index) => (
              <li
                key={index}
                className="border border-gray-200 rounded-md p-4 bg-gray-50"
              >
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Date:</strong> {job.date}
                </p>
                <p>
                  <strong>Duration:</strong> {job.duration}h
                </p>
                <p>
                  <strong>Total Earned:</strong> {job.totalCost / 1e9} SOL
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {job.completed ? "✅ Completed" : "🕓 Pending"}
                </p>
                <p>
                  <strong>Client:</strong> {job.client.toBase58()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
