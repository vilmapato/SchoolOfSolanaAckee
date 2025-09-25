# 🧹 FindingMyMaid Frontend

**FindingMyMaid** is a decentralized application (dApp) that enables users to register as cleaners and clients on-chain, and allows job creation between them via a smart contract deployed on Solana Devnet.

This frontend is built with **Next.js 13+ App Router** and connects to the Anchor smart contract using the **@coral-xyz/anchor** framework and **Solana Wallet Adapter**.

---

## 🔍 Project Description

In many cities, including Zurich, finding reliable cleaning services on short notice is inefficient and fragmented across platforms. **FindingMyMaid** aims to solve this by building an on-chain, Uber-style cleaner marketplace where:

- 🧼 **Cleaners** can register their availability, location, and hourly rate.
- 🙋 **Clients** can discover and book cleaners based on availability.
- 📝 **Jobs** are created on-chain with details like location, date, and duration.
- 🔒 Everything is decentralized, transparent, and auditable on Solana.

This project was developed as part of the **School of Solana Final Project**, showcasing knowledge of Solana smart contract development using Anchor and building a functional dApp frontend.

---

## ✅ Features Implemented

### 🔐 Wallet Connection

- Phantom wallet integration via Solana Wallet Adapter.
- Users can connect/disconnect wallet from the UI.

### 🧼 Cleaner Registration

- Form to input:
  - Name
  - Location
  - Hourly Rate (in lamports)
  - Availability status
- Sends an on-chain transaction calling the `register_cleaner` instruction.
- Stores the cleaner info in a PDA account (Program Derived Address) owned by the smart contract.

### 🛠️ Smart Contract Integration

- Frontend is fully wired to the deployed Anchor program on Devnet.
- PDA logic and account structure correctly mirrored from the IDL.
- Uses AnchorProvider to send transactions via wallet.

---

## 🧪 Stack

| Layer           | Technology             |
| --------------- | ---------------------- |
| Smart Contracts | Solana + Anchor        |
| Frontend        | Next.js (App Router)   |
| Wallet Adapter  | @solana/wallet-adapter |
| Program Binding | @coral-xyz/anchor      |
| Blockchain      | Solana Devnet          |
| Styling         | TailwindCSS (WIP)      |

---

## 📦 Local Development

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/findingmymaid-frontend.git
cd frontend

# 2. Install dependencies
npm install

# 3. Start local dev server
npm run dev
```
