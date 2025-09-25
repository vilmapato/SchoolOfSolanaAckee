"use client";

import { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Idl,
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
} from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import rawIdl from "@/idl/findingmymaid.json";
//import { Idl } from "@coral-xyz/anchor";

const idl = rawIdl as unknown as Idl;
console.log("RAW IDL", idl);
const programID = new PublicKey(idl.address);

export default function RegisterCleanerForm() {
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rate, setRate] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [status, setStatus] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!publicKey || !signTransaction || !signAllTransactions) {
      console.log("Wallet not connected");
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

      console.log("idl.accounts", idl.accounts);
      console.log("idl.types", idl.types);

      const programID = new PublicKey(idl.address);

      const [cleanerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("cleaner"), publicKey.toBuffer()],
        programID
      );

      const program = new Program(idl as Idl, provider);

      await program.methods
        .registerCleaner(name, location, new BN(rate), isAvailable)
        .accounts({
          authority: publicKey,
          cleaner: cleanerPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setStatus("✅ Cleaner registered successfully!");
    } catch (error: any) {
      console.error(error);
      setStatus(`❌ Error: ${error.message}`);
    }
  }, [
    connection,
    publicKey,
    signTransaction,
    signAllTransactions,
    name,
    location,
    rate,
    isAvailable,
  ]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Register as Cleaner</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
        <label className="block text-sm font-medium text-gray-700">
          Hourly Rate (in lamports)
        </label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={() => setIsAvailable((prev) => !prev)}
          className="mr-2"
        />
        <label className="text-sm text-gray-700">Available for work</label>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Register
      </button>

      {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
    </div>
  );
}
