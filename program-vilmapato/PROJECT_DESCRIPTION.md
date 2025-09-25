# 🧹 FindingMyMaid – Final Project

**Deployed Frontend URL:** [(http://localhost:3000/)] vercel deployment still under development (tons of Eslint errors to still fix).

**Solana Program ID:** `PeDwUBNTDfe2osM61XLn3AsMyUm1LDGA7iB4Q2MRzgX`

---

## 🧭 Project Overview

### Description

**FindingMyMaid** is a decentralized marketplace for booking household cleaning services built on **Solana**. The platform empowers:

- Cleaners to register themselves with availability, location, and hourly rate
- Clients to book jobs by selecting cleaners and submitting job details on-chain

This project solves the inefficiency of fragmented, Web2-only solutions in cities like Zurich, by offering a **Web3-native**, transparent, and verifiable solution for service matching.

---

### Key Features

- **🧼 Cleaner Registration:** Cleaners can sign up on-chain with name, location, rate, and availability.
- **🧑‍💻 Client Registration:** Clients can register to use the app and book jobs.
- **📆 Job Creation:** Clients can create on-chain job bookings with selected cleaners, specifying time, duration, and location.
- **🪙 Solana Devnet Integration:** All actions are executed via Anchor smart contract deployed to Solana Devnet.
- **💼 Phantom Wallet Support:** Users can connect and sign transactions through Phantom wallet.
- **✅ PDA Validation:** Accounts like `Cleaner`, `Client`, and `Job` are created with secure PDA patterns.

---

### How to Use the dApp

1. **Connect Wallet**

   - Click “Connect Wallet” and approve the Devnet connection in Phantom.

2. **Register as Cleaner**

   - Fill out the form with your name, location, hourly rate, and availability
   - Click “Register” to send the on-chain transaction

3. [Currentyl integrating all features in the frontend]

---

## 🏗️ Program Architecture

### PDA Usage

PDAs are used for account initialization without exposing private keys:

- **Cleaner PDA**
  - Seeds: `["cleaner", authority pubkey]`
  - Purpose: Stores cleaner's metadata and availability
- **Client PDA**
  - Seeds: `["client", authority pubkey]`
  - Purpose: Stores client name and review field
- **Job PDA**
  - Seeds: `["job", client pubkey, cleaner pubkey, date string]`
  - Purpose: Uniquely identifies jobs created between a client and a cleaner

---

### Program Instructions

**1. `register_cleaner`**

- Creates a `Cleaner` PDA account and stores name, location, hourly rate, and availability.

**2. `register_client`**

- Creates a `Client` PDA account storing name and metadata.

**3. `create_job`**

- Initializes a `Job` PDA account with all job parameters (client, cleaner, location, date, duration, cost).

**4. `update_cleaner`**

- Allows registered cleaner to update their location and rate.

---

### Account Structure

````rust
#[account]
pub struct Cleaner {
    pub authority: Pubkey,
    pub name: String,
    pub location: String,
    pub hourly_rate: u64,
    pub is_available: bool,
    pub bump: u8,
}

#[account]
pub struct Client {
    pub authority: Pubkey,
    pub name: String,
    pub review: u8,
    pub bump: u8,
}

#[account]
pub struct Job {
    pub client: Pubkey,
    pub cleaner: Pubkey,
    pub location: String,
    pub date: String,
    pub duration: u8,
    pub total_cost: u64,
    pub completed: bool,
    pub bump: u8,
}

## 🧪 Testing

### Test Coverage

The program includes unit tests written with **Anchor's Mocha test framework**. Tests were designed to cover both successful use cases (*happy path*) and edge cases (*unhappy path*) for the main instructions.

---

### ✅ Happy Path Tests

- **Registers a Cleaner Successfully**
  Confirms a cleaner can register with name, location, hourly rate, and availability. Verifies the PDA was created correctly and data stored on-chain matches the input.

- **Registers a Client Successfully**
  Registers a new client and checks the PDA and associated data fields (name, authority, bump) were stored correctly.

- **Creates a Job Successfully**
  A client creates a job with a registered and available cleaner. The test checks that the job PDA is derived correctly and that all fields (client, cleaner, date, duration, cost, etc.) are stored accurately.

---

### ❌ Unhappy Path Tests

- **Fails to Register Same Cleaner Twice**
  Attempts to register a cleaner using the same authority twice. The test expects a "PDA already in use" error and confirms the contract prevents duplicate registration.

- **Fails to Register Cleaner with Mismatched Signer**
  Tests that one wallet cannot sign on behalf of another when registering a cleaner. Ensures the program enforces signer-authority match.

- **Fails to Update Cleaner by Another Wallet**
  Confirms that unauthorized users cannot update someone else's cleaner profile. Expects the instruction to fail with a constraint violation.

- **Fails to Create Job with Unavailable Cleaner**
  Tries to assign a job to a cleaner who is marked unavailable. Ensures the `CleanerUnavailable` error is thrown and the job is not created.

---

### Running Tests
```bash
# Commands to run your tests
anchor test
````

### Additional Notes for Evaluators

    •	This project uses Anchor and @coral-xyz/anchor on frontend
    •	PDA logic strictly follows Anchor conventions (explicit seeds)
    •	Phantom wallet is required to interact
    •	Frontend is in active development: currently supports cleaner and client registration along with job submission.
    •	You can register the same wallet as both a Cleaner and a Client but the future features will limit this as you will receive reviews so you can't give yourself reviews (but this will be done at a latter stage).

## Lessons Learned

    •	Working with Anchor IDLs on the frontend and handling PDA derivation in both Rust and TS
    •	Debugging IDL mismatches, typescript errors, and hydration mismatches with wallet adapters
    •	Building from contract → IDL → frontend with minimal guidance → very hard indeed!
