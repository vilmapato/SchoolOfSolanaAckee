//-------------------------------------------------------------------------------
///
/// TASK: Implement the withdraw functionality for the on-chain vault
/// 
/// Requirements:
/// - Verify that the vault is not locked
/// - Verify that the vault has enough balance to withdraw
/// - Transfer lamports from vault to vault authority
/// - Emit a withdraw event after successful transfer
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;
use crate::state::Vault;
use crate::errors::VaultError;
use crate::events::WithdrawEvent;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    // TODO: Add required accounts and constraints
    #[account(mut)]
    pub vault_authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault", vault_authority.key().as_ref()],
        bump,
        has_one = vault_authority,
        constraint = !vault.locked @ VaultError::VaultLocked
    )]
    pub vault: Account<'info, Vault>,

    pub system_program: Program<'info, System>,
    
}

pub fn _withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    // TODO: Implement withdraw functionality
    let vault = &ctx.accounts.vault;
    let vault_authority = &ctx.accounts.vault_authority;

    // Check if vault has enough funds
    if **vault.to_account_info().lamports.borrow() < amount {
        return Err(VaultError::InsufficientBalance.into());
    }

    // Prepare signer seeds
    let bump = ctx.bumps.vault;
    let signer_seeds: &[&[u8]] = &[
        b"vault",
        vault_authority.key.as_ref(),
        &[bump],
    ];

    // Transfer lamports from vault PDA to vault_authority
    **vault.to_account_info().try_borrow_mut_lamports()? -= amount;
    **vault_authority.to_account_info().try_borrow_mut_lamports()? += amount;

    // Emit the event
    emit!(WithdrawEvent {
        vault: vault.key(),
        vault_authority: vault_authority.key(),
        amount,
    });

    Ok(())
}
//-------------------------------------------------------------------------------