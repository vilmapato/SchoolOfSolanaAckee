import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Findingmymaid } from "../target/types/findingmymaid";
import { assert } from "chai";
import { Keypair } from "@solana/web3.js";

describe("findingmymaid", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Findingmymaid as Program<Findingmymaid>;

  const CLEANER_SEED = "cleaner";
  const LOCATIONS = ["Zurich", "Geneva", "Basel"];
  const RATES = [2500, 300, 3500]; // in cents

  // I will create three cleaners for testing
  const cassia = anchor.web3.Keypair.generate();
  const emma = anchor.web3.Keypair.generate();
  const vilma = anchor.web3.Keypair.generate();

  const TEST_CLEANERS = [
    {
      keypair: cassia,
      name: "Cassia",
      location: LOCATIONS[0],
      rate: new anchor.BN(RATES[0]),
    },
    {
      keypair: emma,
      name: "Emma",
      location: LOCATIONS[1],
      rate: new anchor.BN(RATES[1]),
    },
    {
      keypair: vilma,
      name: "Vilma",
      location: LOCATIONS[2],
      rate: new anchor.BN(RATES[2]),
    },
  ];

  // Creating three clients for testing
  const alice = anchor.web3.Keypair.generate();
  const bob = anchor.web3.Keypair.generate();
  const carol = anchor.web3.Keypair.generate();

  const JOB_DATES = [
    new Date("2025-09-01T09:00:00Z"),
    new Date("2025-09-03T14:00:00Z"),
    new Date("2025-09-05T17:00:00Z"),
  ];
  const JOB_HOURS = [2, 4, 3];

  const reviews = [1, 5, 4];

  const TEST_CLIENTS = [
    {
      keypair: alice,
      name: "Alice",
      review: reviews[0],
    },
    {
      keypair: bob,
      name: "Bob",
      review: reviews[1],
    },
    {
      keypair: carol,
      name: "Carol",
      review: reviews[2],
    },
  ];

  // function for Airdropping SOL to a given address
  async function airdrop(connection: any, address: any, amount = 1000000000) {
    await connection.confirmTransaction(
      await connection.requestAirdrop(address, amount),
      "confirmed"
    );
  }

  //function to get Address (PDA) of the cleaner
  async function getCleanerPDA(author: anchor.web3.PublicKey) {
    return anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("cleaner"), author.toBuffer()],
      program.programId
    );
  }
  it("Registers a cleaner successfully", async () => {
    const { keypair, name, location, rate } = TEST_CLEANERS[0];

    // await airdrop(provider.connection, cassia.publicKey);

    const [cleanerPda, bump] = await getCleanerPDA(keypair.publicKey);

    await program.methods
      .registerCleaner(name, location, rate, true)
      .accounts({
        authority: keypair.publicKey,
        cleaner: cleanerPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();
    const cleanerAccount = await program.account.cleaner.fetch(cleanerPda);

    assert.equal(cleanerAccount.name, name);
    assert.equal(cleanerAccount.location, location);
    assert.equal(cleanerAccount.hourlyRate.toNumber(), rate.toNumber());
    assert.ok(cleanerAccount.authority.equals(keypair.publicKey));
    assert.equal(cleanerAccount.bump, bump);
  });

  //checking if registering multiple accounts for the same cleaner fails
  it("Fails when registering the same cleaner twice", async () => {
    const { keypair, name, location, rate } = TEST_CLEANERS[0]; // Cassia

    const [cleanerPda] = await getCleanerPDA(keypair.publicKey);

    // Try to register Cassia again
    try {
      await program.methods
        .registerCleaner(name, location, rate, false)
        .accounts({
          authority: keypair.publicKey,
          cleaner: cleanerPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

      assert.fail("Duplicate registration should have failed but didn't.");
    } catch (err) {
      assert.include(
        err.message,
        "already in use",
        "Expected PDA conflict error"
      );
    }
  });

  // Someone else trying to register a cleaner on behalf of another cleaner

  it("Fails when someone else tries to register a cleaner for another authority", async () => {
    const { keypair, name, location, rate } = TEST_CLEANERS[1]; // e.g., Emma

    await airdrop(provider.connection, vilma.publicKey); // Vilma trying to register Emma

    const [cleanerPda, _bump] = await getCleanerPDA(keypair.publicKey); // PDA based on Emma's pubkey

    try {
      await program.methods
        .registerCleaner(name, location, rate, false)
        .accounts({
          authority: keypair.publicKey, // Emma's public key
          cleaner: cleanerPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([vilma]) // ⚠️ Vilma trying to sign on behalf of Emma
        .rpc();

      assert.fail("Should have failed due to mismatched signer and authority");
    } catch (err) {
      assert.include(
        err.message,
        "unknown signer",
        "Expected unauthorized signer rejection"
      );
    }
  });

  //trying to update cleaner info with another cleaner's data
  it("Fails when trying to update another cleaner's data", async () => {
    const { keypair, name, location, rate } = TEST_CLEANERS[2]; // Vilma
    await airdrop(provider.connection, keypair.publicKey);

    const [cleanerPda, _bump] = await getCleanerPDA(keypair.publicKey);

    // First, register Vilma
    await program.methods
      .registerCleaner(name, location, rate, false)
      .accounts({
        authority: keypair.publicKey,
        cleaner: cleanerPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();

    // Now, Emma tries to update Vilma's cleaner account
    try {
      await program.methods
        .updateCleaner("Lausanne", new anchor.BN(4200))
        .accounts({
          authority: emma.publicKey,
          cleaner: cleanerPda,
        })
        .signers([emma])
        .rpc();

      assert.fail("Should not allow unauthorized update");
    } catch (err) {
      assert.include(
        err.message,
        "AnchorError caused by account",
        "has one constraint violated"
      );
    }
  });

  it("Registers a client successfully", async () => {
    const { keypair, name, review } = TEST_CLIENTS[0];

    // await airdrop(provider.connection, keypair.publicKey);

    const [clientPda, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("client"), keypair.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .registerClient(name)
      .accounts({
        authority: keypair.publicKey,
        client: clientPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();

    const clientAccount = await program.account.client.fetch(clientPda);

    assert.equal(clientAccount.name, name);
    assert.equal(clientAccount.review, 0);
    assert.ok(clientAccount.authority.equals(keypair.publicKey));
    assert.equal(clientAccount.bump, bump);
  });

  it("Creates a job successfully", async () => {
    const client = TEST_CLIENTS[0];
    const cleaner = TEST_CLEANERS[0];

    const location = "Zurich";
    const date = JOB_DATES[0].toISOString(); // "2025-09-01T09:00:00Z"
    const duration = JOB_HOURS[0]; // e.g. 2 hours

    // await airdrop(provider.connection, client.keypair.publicKey);

    const [clientPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("client"), client.keypair.publicKey.toBuffer()],
      program.programId
    );

    const [cleanerPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("cleaner"), cleaner.keypair.publicKey.toBuffer()],
      program.programId
    );

    const [jobPda, jobBump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("job"),
        client.keypair.publicKey.toBuffer(),
        cleanerPda.toBuffer(),
        Buffer.from(date),
      ],
      program.programId
    );

    await program.methods
      .createJob(location, date, duration)
      .accounts({
        client: client.keypair.publicKey,
        cleaner: cleanerPda,
        job: jobPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([client.keypair])
      .rpc();

    const jobAccount = await program.account.job.fetch(jobPda);

    assert.ok(jobAccount.client.equals(client.keypair.publicKey));
    assert.ok(jobAccount.cleaner.equals(cleanerPda));
    assert.equal(jobAccount.location, location);
    assert.equal(jobAccount.date, date);
    assert.equal(jobAccount.duration, duration);
    assert.equal(jobAccount.totalCost, duration * TEST_CLEANERS[0].rate);
    assert.equal(jobAccount.completed, false);
    assert.equal(jobAccount.bump, jobBump);
  });

  it("Fails to create a job if the cleaner is not available", async () => {
    const client = TEST_CLIENTS[0];
    const cleaner = { ...TEST_CLEANERS[1], available: false };
    const duration = JOB_HOURS[0];
    const date = JOB_DATES[0].toISOString();

    // await airdrop(provider.connection, client.keypair.publicKey);
    // await airdrop(provider.connection, cleaner.keypair.publicKey);

    const [clientPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("client"), client.keypair.publicKey.toBuffer()],
      program.programId
    );
    const [cleanerPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("cleaner"), cleaner.keypair.publicKey.toBuffer()],
      program.programId
    );
    await program.methods
      .registerCleaner(cleaner.name, cleaner.location, cleaner.rate, false) // <-- set false here
      .accounts({
        authority: cleaner.keypair.publicKey,
        cleaner: cleanerPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([cleaner.keypair])
      .rpc();
    const [jobPda, _jobBump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("job"),
        client.keypair.publicKey.toBuffer(),
        cleanerPda.toBuffer(),
        Buffer.from(date),
      ],
      program.programId
    );

    try {
      await program.methods
        .createJob(cleaner.location, date, duration)
        .accounts({
          client: client.keypair.publicKey,
          cleaner: cleanerPda,
          job: jobPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([client.keypair])
        .rpc();

      assert.fail("Job creation should have failed due to unavailable cleaner");
    } catch (err) {
      assert.include((err as any).toString(), "CleanerUnavailable");
    }
  });

  // removing a cleaner and checking if the cleaner account is deleted
  it("Removes a cleaner successfully", async () => {
    const cleaner = TEST_CLEANERS[2]; // Vilma

    const [cleanerPda] = await getCleanerPDA(cleaner.keypair.publicKey);

    await program.methods
      .removeCleaner()
      .accounts({
        authority: cleaner.keypair.publicKey,
        cleaner: cleanerPda,
      })
      .signers([cleaner.keypair])
      .rpc();

    try {
      await program.account.cleaner.fetch(cleanerPda);
      assert.fail("Cleaner account should have been deleted");
    } catch (err) {
      assert.include(
        err.message,
        "AccountNotInitialized",
        "The program expected this account to be already initialized"
      );
    }
  });
});
