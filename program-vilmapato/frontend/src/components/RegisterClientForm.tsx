"use client";

import { useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Idl, Program, AnchorProvider, web3, utils } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import rawIdl from "@/idl/findingmymaid.json";

const idl = rawIdl as unknown as Idl;

export default function RegisterClientForm() {
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  const [name, setName] = useState("");
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

      const [clientPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("client"), publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .registerClient(name)
        .accounts({
          authority: publicKey,
          client: clientPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setStatus("✅ Client registered successfully!");
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Error: ${err.message}`);
    }
  }, [connection, publicKey, signTransaction, signAllTransactions, name]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Register as Client</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Register
      </button>

      {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
    </div>
  );
}
