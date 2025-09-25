"use client";

import { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Idl, Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import rawIdl from "@/idl/findingmymaid.json";
import {
  validateCleanerAccount,
  validateClientAccount,
} from "@/lib/utils/validateAccounts";

const idl = rawIdl as unknown as Idl;

export default function SubmitJobForm() {
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  const [cleanerPubkey, setCleanerPubkey] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(""); // Use format like "2025-09-01"
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!publicKey || !signTransaction || !signAllTransactions) {
      setStatus("Connect your wallet first.");
      return;
    }

    try {
      setStatus("Submitting...");

      const provider = new AnchorProvider(
        connection,
        {
          publicKey,
          signTransaction,
          signAllTransactions,
        },
        { commitment: "confirmed" }
      );

      const program = new Program(idl, provider);

      const cleanerPk = new PublicKey(cleanerPubkey);

      //validate cleaner and client accounts before creating job

      const [cleanerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("cleaner"), cleanerPk.toBuffer()],
        program.programId
      );

      console.log("Resolved cleaner PDA:", cleanerPda.toBase58());

      const cleanerExists = await validateCleanerAccount(program, cleanerPda);
      if (!cleanerExists) {
        setStatus("❌ This cleaner is not registered yet.");
        return;
      }

      const [clientPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("client"), publicKey.toBuffer()],
        program.programId
      );
      const clientExists = await validateClientAccount(program, clientPda);
      if (!clientExists) {
        setStatus("❌ You need to register as a client first.");
        return;
      }

      const [jobPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("job"),
          publicKey.toBuffer(), // client
          cleanerPda.toBuffer(),
          Buffer.from(date), // string date as seed
        ],
        program.programId
      );

      console.log("Job PDA:", jobPda.toBase58());

      await program.methods
        .createJob(location, date, parseInt(duration))
        .accounts({
          client: publicKey,
          cleaner: cleanerPda,
          job: jobPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setStatus("✅ Job submitted successfully!");
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Error: ${err.message}`);
    }
  }, [
    publicKey,
    signTransaction,
    signAllTransactions,
    connection,
    cleanerPubkey,
    location,
    date,
    duration,
  ]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Submit Job</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Cleaner Wallet Address
        </label>
        <input
          type="text"
          value={cleanerPubkey}
          onChange={(e) => setCleanerPubkey(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="Enter cleaner's wallet address"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="2025-09-01"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Duration (hours)
        </label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
      >
        Submit Job
      </button>

      {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
    </div>
  );
}
