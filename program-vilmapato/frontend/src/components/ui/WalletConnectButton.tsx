"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/Button";

export default function WalletConnectButton() {
  const { publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <div className="flex justify-center mt-6">
      {publicKey ? (
        <Button variant="secondary" onClick={() => disconnect()}>
          Disconnect ({publicKey.toBase58().slice(0, 4)}...
          {publicKey.toBase58().slice(-4)})
        </Button>
      ) : (
        <Button variant="default" onClick={() => setVisible(true)}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
}
