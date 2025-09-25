"use client";

import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import rawIdl from "@/idl/findingmymaid.json";

const idl = rawIdl as unknown as Idl;

export default function DashboardRedirectPage() {
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const [status, setStatus] = useState("Checking your role...");

  useEffect(() => {
    const checkRolesAndRedirect = async () => {
      if (!publicKey || !signTransaction || !signAllTransactions) {
        setStatus("Please connect your wallet first.");
        return;
      }

      try {
        const provider = new AnchorProvider(
          connection,
          { publicKey, signTransaction, signAllTransactions },
          { commitment: "confirmed" }
        );
        const program = new Program(idl, provider);

        const [clientPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("client"), publicKey.toBuffer()],
          program.programId
        );
        const [cleanerPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("cleaner"), publicKey.toBuffer()],
          program.programId
        );

        let isClient = false;
        let isCleaner = false;

        try {
          await program.account.client.fetch(clientPda);
          isClient = true;
        } catch {}

        try {
          await program.account.cleaner.fetch(cleanerPda);
          isCleaner = true;
        } catch {}

        if (isClient && isCleaner) {
          router.push("/dashboard/role"); // Optional: a chooser page
        } else if (isClient) {
          router.push("/dashboard/client");
        } else if (isCleaner) {
          router.push("/dashboard/cleaner");
        } else {
          setStatus("You're not registered yet. Please register first.");
        }
      } catch (err) {
        console.error(err);
        setStatus("Error checking your roles.");
      }
    };

    checkRolesAndRedirect();
  }, [publicKey, signTransaction, signAllTransactions, connection, router]);

  return (
    <div className="mt-10 text-center text-gray-700">
      <p className="text-lg">{status}</p>
    </div>
  );
}
