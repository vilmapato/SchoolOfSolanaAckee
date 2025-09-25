"use client";

import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import {
  validateCleanerAccount,
  validateClientAccount,
} from "@/lib/utils/validateAccounts";
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import rawIdl from "@/idl/findingmymaid.json";
import { PublicKey } from "@solana/web3.js";
import WalletSection from "@/components/WalletSection";
import Navbar from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import { Lightbulb } from "lucide-react";
import WalletConnectButton from "@/components/ui/WalletConnectButton";

const idl = rawIdl as unknown as Idl;

export default function Home() {
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [userRoles, setUserRoles] = useState({ cleaner: false, client: false });
  const [idea, setIdea] = useState("");

  useEffect(() => {
    const checkRegistration = async () => {
      if (!publicKey || !signTransaction || !signAllTransactions) return;

      setLoading(true);

      const provider = new AnchorProvider(
        connection,
        { publicKey, signTransaction, signAllTransactions },
        { commitment: "confirmed" }
      );
      const program = new Program(idl, provider);

      const [cleanerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("cleaner"), publicKey.toBuffer()],
        program.programId
      );
      const [clientPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("client"), publicKey.toBuffer()],
        program.programId
      );

      const [cleanerExists, clientExists] = await Promise.all([
        validateCleanerAccount(program, cleanerPda),
        validateClientAccount(program, clientPda),
      ]);

      if (cleanerExists && !clientExists) {
        router.push("/dashboard/cleaner");
        return;
      }

      if (!cleanerExists && clientExists) {
        router.push("/dashboard/client");
        return;
      }

      // If both exist, let the user choose
      setUserRoles({ cleaner: cleanerExists, client: clientExists });
      setLoading(false);
    };

    checkRegistration();
  }, [publicKey]);

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <Navbar />

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] pb-2 relative z-10">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-white text-center mb-10 leading-tight">
            Welcome to
            <br />
            FindingMyMaid
          </h1>

          <p className="text-3xl font-light  text-white text-center mb-30 px-15">
            Connect your wallet to discover trusted cleaning professionals or
            offer your cleaning services. Built on Solana for secure,
            transparent transactions.
          </p>

          <div className="bg-white/80 shadow-lg rounded-xl p-6 w-full max-w-md mx-auto">
            {!publicKey ? (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Connect Your Wallet
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Connect your Solana wallet to get started with FindingMyMaid
                </p>
                <WalletConnectButton />{" "}
                {/* I have to add the catch error for non supported wallets*/}
              </>
            ) : loading ? (
              <p className="text-gray-600">
                Checking your registration status...
              </p>
            ) : userRoles.cleaner && userRoles.client ? (
              <>
                <p className="mb-4 font-medium text-center">
                  You're registered as both roles. Choose one:
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => router.push("/dashboard/cleaner")}
                    className="bg-green-600"
                  >
                    Cleaner Dashboard
                  </Button>
                  <Button
                    onClick={() => router.push("/dashboard/client")}
                    className="bg-purple-600"
                  >
                    Client Dashboard
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-4 font-medium">
                  You are not registered yet. Choose your role:
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => router.push("/register/cleaner")}
                    className="bg-green-600"
                  >
                    🧹 Register as Cleaner
                  </Button>
                  <Button
                    onClick={() => router.push("/register/client")}
                    className="bg-yellow-500"
                  >
                    👩‍💼 Register as Client
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Abstract flowing shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main purple flowing shape */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4">
            <svg
              width="800"
              height="600"
              viewBox="0 0 800 600"
              className="opacity-80"
            >
              <defs>
                <radialGradient id="purpleGradient" cx="50%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#3730a3" stopOpacity="0.4" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M200 400 Q350 200 500 350 Q650 500 400 550 Q150 500 200 400"
                fill="url(#purpleGradient)"
                filter="url(#glow)"
                className="animate-pulse"
              />
            </svg>
          </div>

          {/* Secondary flowing lines */}
          <div className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2">
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              className="opacity-40"
            >
              <defs>
                <linearGradient
                  id="lineGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#3730a3" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path
                d="M50 200 Q200 50 350 200 Q200 350 50 200"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: "1s" }}
              />
              <circle
                cx="200"
                cy="100"
                r="3"
                fill="#8b5cf6"
                className="animate-pulse"
                style={{ animationDelay: "2s" }}
              />
            </svg>
          </div>

          {/* Additional ambient shapes */}
          <div className="absolute top-1/4 left-0 transform -translate-x-1/2">
            <div
              className="w-64 h-64 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "3s" }}
            ></div>
          </div>

          <div className="absolute bottom-1/4 right-1/4">
            <div
              className="w-32 h-32 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "4s" }}
            ></div>
          </div>
        </div>

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>
      {/* <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-purple-50 px-4 py-12 text-center">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-4">
          Welcome to FindingMyMaid 🧼
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Connect your wallet to discover trusted cleaning professionals or
          offer your cleaning services. Built on Solana for secure, transparent
          transactions.
        </p>

        <div className="flex justify-center gap-10 mb-12">
          <div className="max-w-xs">
            <div className="text-blue-600 text-4xl mb-2">🔒</div>
            <h3 className="font-semibold text-lg">Secure & Trusted</h3>
            <p className="text-sm text-gray-600">
              Blockchain-powered security with verified cleaners and transparent
              reviews
            </p>
          </div>
          <div className="max-w-xs">
            <div className="text-green-600 text-4xl mb-2">⏱️</div>
            <h3 className="font-semibold text-lg">Quick Booking</h3>
            <p className="text-sm text-gray-600">
              Find and book cleaning services in minutes with instant
              confirmation
            </p>
          </div>
          <div className="max-w-xs">
            <div className="text-yellow-600 text-4xl mb-2">⭐</div>
            <h3 className="font-semibold text-lg">Quality Guaranteed</h3>
            <p className="text-sm text-gray-600">
              Rated cleaners with satisfaction guarantee and easy dispute
              resolution
            </p>
          </div>
        </div>

        <div className="bg-white/80 shadow-lg rounded-xl p-6 w-full max-w-md mx-auto">
          {!publicKey ? (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Connect your Solana wallet to get started with FindingMyMaid
              </p>
              <WalletSection />
            </>
          ) : loading ? (
            <p className="text-gray-600">
              Checking your registration status...
            </p>
          ) : userRoles.cleaner && userRoles.client ? (
            <>
              <p className="mb-4 font-medium">
                You're registered as both roles. Choose one:
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => router.push("/dashboard/cleaner")}
                  className="bg-green-600"
                >
                  Cleaner Dashboard
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/client")}
                  className="bg-purple-600"
                >
                  Client Dashboard
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="mb-4 font-medium">
                You are not registered yet. Choose your role:
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => router.push("/register/cleaner")}
                  className="bg-green-600"
                >
                  🧹 Register as Cleaner
                </Button>
                <Button
                  onClick={() => router.push("/register/client")}
                  className="bg-yellow-500"
                >
                  👩‍💼 Register as Client
                </Button>
              </div>
            </>
          )}
        </div>
      </div> */}
    </>
  );
}
