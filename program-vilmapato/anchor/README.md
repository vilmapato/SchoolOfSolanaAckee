# 🧹 FindingMyMaid – Anchor Program

This is the Solana on-chain program powering the **FindingMyMaid** dApp. It is built using [Anchor](https://book.anchor-lang.com/), a framework for Solana smart contract development.

---

## 📦 Prerequisites

Make sure you have the following tools installed before proceeding:

```bash
# Rust (via rustup)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

```bash
# Solana CLI (v1.18.4 or later)
sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"
solana --version
```

```bash
# Anchor CLI (v0.29 or later)
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
anchor --version
```

---

## 🛠️ Setup

Clone the repository and navigate to the `anchor/` directory:

```bash
git clone https://github.com/yourusername/findingmymaid.git
cd findingmymaid/anchor
```

Then build the project:

```bash
anchor build
```

---

## 🧪 Running Tests

To run all unit tests:

```bash
anchor test
```

You can optionally skip build and deploy to test against a running validator:

```bash
anchor test --skip-build --skip-deploy
```

---

## 🚀 Deploy to Devnet

To deploy your program to Solana **Devnet**, run:

```bash
solana config set --url https://api.devnet.solana.com
anchor build
anchor deploy
```

After deployment, Anchor will display the **program ID**. You must copy this and update your frontend or scripts accordingly.

---

## 📤 Sync IDL to Frontend

After `anchor build`, the IDL file is generated here:

```
target/idl/findingmymaid.json
```

Copy it into the frontend:

```bash
cp target/idl/findingmymaid.json ../frontend/src/idl/findingmymaid.json
```

This file is used to initialize the program client in your dApp using `@coral-xyz/anchor`.

---

## 📜 Instruction Summary

### `register_client(name: string)`

- Registers a user as a **client**
- Derives PDA: `["client", authorityPubkey]`

### `register_cleaner(name, location, hourly_rate, is_available)`

- Registers a user as a **cleaner**
- Derives PDA: `["cleaner", authorityPubkey]`

### `create_job(location, date, duration)`

- Client books a job with a registered cleaner
- Derives PDA: `["job", clientPubkey, cleanerPubkey, date]`

### `update_cleaner(new_location, new_rate)`

- Updates a cleaner’s rate and location

---

## 🧾 Account Structures

### `Client`

| Field     | Type     |
| --------- | -------- |
| authority | `pubkey` |
| name      | `string` |
| review    | `u8`     |
| bump      | `u8`     |

### `Cleaner`

| Field        | Type     |
| ------------ | -------- |
| authority    | `pubkey` |
| name         | `string` |
| location     | `string` |
| hourly_rate  | `u64`    |
| is_available | `bool`   |
| bump         | `u8`     |

### `Job`

| Field      | Type     |
| ---------- | -------- |
| client     | `pubkey` |
| cleaner    | `pubkey` |
| location   | `string` |
| date       | `string` |
| duration   | `u8`     |
| total_cost | `u64`    |
| completed  | `bool`   |
| bump       | `u8`     |

---

## ⚠️ Custom Errors

| Code | Name                    | Description                          |
| ---- | ----------------------- | ------------------------------------ |
| 6000 | AlreadyRegistered       | Cleaner already registered           |
| 6001 | ClientAlreadyRegistered | Client already registered            |
| 6002 | CleanerNotFound         | Cleaner not found                    |
| 6003 | ClientNotFound          | Client not found                     |
| 6004 | JobNotFound             | Job not found                        |
| 6005 | Unauthorized            | Unauthorized action                  |
| 6006 | InvalidCleaner          | Cleaner is invalid or not registered |
| 6007 | CleanerUnavailable      | Cleaner is not available             |

---

## 🧭 PDA Seeds

| Account | PDA Format                                   |
| ------- | -------------------------------------------- |
| Client  | `["client", authorityPubkey]`                |
| Cleaner | `["cleaner", authorityPubkey]`               |
| Job     | `["job", clientPubkey, cleanerPubkey, date]` |

---

## 📁 Folder Structure

```
anchor/
├── Cargo.toml
├── programs/
│   └── findingmymaid/
│       └── src/lib.rs      # Program logic
├── tests/
│   └── findingmymaid.ts    # Anchor tests
├── target/
│   └── idl/
│       └── findingmymaid.json
└── migrations/
```

---

## 🧠 Notes

- You can deploy to `devnet`, `testnet`, or `mainnet-beta` by changing the RPC in `solana config`.
- Anchor auto-generates account discriminators and IDL files.
- For frontend, we use the IDL + program ID to create the Anchor `Program` instance.

---

Built with 💜 by [@vilmapato](https://github.com/vilmapato)
