import { PublicKey } from "@solana/web3.js";

export const getCleanerPda = async (wallet: PublicKey, programId: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("cleaner"), wallet.toBuffer()],
    programId
  );

export const getClientPda = async (wallet: PublicKey, programId: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("client"), wallet.toBuffer()],
    programId
  );

export const getJobPda = (
  client: PublicKey,
  cleaner: PublicKey,
  date: string,
  programId: PublicKey
) =>
  PublicKey.findProgramAddressSync(
    [
      Buffer.from("job"),
      client.toBuffer(),
      cleaner.toBuffer(),
      Buffer.from(date),
    ],
    programId
  );
