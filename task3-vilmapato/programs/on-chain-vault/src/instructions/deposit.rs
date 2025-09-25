//-------------------------------------------------------------------------------
///
/// TASK: Implement the deposit functionality for the on-chain vault
/// 
/// Requirements:
/// - Verify that the user has enough balance to deposit
/// - Verify that the vault is not locked
/// - Transfer lamports from user to vault using CPI (Cross-Program Invocation)
/// - Emit a deposit event after successful transfer
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction::transfer;
use crate::state::Vault;
use crate::errors::VaultError;
use crate::events::DepositEvent;

#[derive(Accounts)]
pub struct Deposit<'info> {
    // TODO: Add required accounts and constraints
     #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        //has_one = vault_authority,
        constraint = !vault.locked @ VaultError::VaultLocked
    )]
    pub vault: Account<'info, Vault>,
    //pub vault_authority: Signer<'info>,  //taking out vault authority for deposit
    pub system_program: Program<'info, System>,
}

pub fn _deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    // TODO: Implement deposit functionality
    
     let vault = &ctx.accounts.vault;
    let user = &ctx.accounts.user;

    // Check user has enough lamports
    if **user.lamports.borrow() < amount {
        return Err(VaultError::InsufficientBalance.into());
    }

    // Create transfer instruction
    let transfer_instruction = transfer(
        &user.key(),
        &vault.key(),
        amount,
    );

    // Perform CPI transfer
    invoke(
        &transfer_instruction,
        &[
            user.to_account_info(),
            vault.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    // Emit event
    emit!(DepositEvent {
        user: user.key(),
        vault: vault.key(),
        amount,
    });

    Ok(())
}