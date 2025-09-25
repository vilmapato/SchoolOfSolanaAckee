import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const ConnectionTest = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) return;
      const lamports = await connection.getBalance(publicKey);
      setBalance(lamports / web3.LAMPORTS_PER_SOL);
    };

    fetchBalance();
  }, [connection, publicKey]);

  return publicKey ? (
    <p>💰 Balance: {balance !== null ? `${balance} SOL` : "Loading..."}</p>
  ) : (
    <p>Connect your wallet to see balance</p>
  );
};

export default ConnectionTest;
