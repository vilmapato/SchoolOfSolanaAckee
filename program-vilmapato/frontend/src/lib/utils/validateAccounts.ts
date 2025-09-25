import { Program, web3 } from "@coral-xyz/anchor";
const { PublicKey } = web3;

export async function validateCleanerAccount(
  program: Program,
  cleanerPda: PublicKey
): Promise<boolean> {
  try {
    const cleanerAccount = await program.account.cleaner.fetch(cleanerPda);
    console.log("Cleaner account found:", cleanerAccount);
    return true;
  } catch (error: any) {
    console.warn("Cleaner account not found or invalid:", error.message);
    return false;
  }
}

export async function validateClientAccount(
  program: Program,
  clientPda: PublicKey
): Promise<boolean> {
  try {
    const clientAccount = await program.account.client.fetch(clientPda);
    console.log("Client account found:", clientAccount);
    return true;
  } catch (error: any) {
    console.warn("Client account not found or invalid:", error.message);
    return false;
  }
}
