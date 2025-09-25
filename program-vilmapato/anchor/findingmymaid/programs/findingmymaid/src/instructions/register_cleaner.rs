use anchor_lang::prelude::*;
use crate::states::*;

pub fn create_cleaner_acc(
    ctx: Context<RegisterCleaner>,
    name: String,
    location: String,
    hourly_rate: u64,
    is_available: bool,
) -> Result<()> {
    let cleaner_account = &mut ctx.accounts.cleaner;

    cleaner_account.authority = ctx.accounts.authority.key();
    cleaner_account.name = name;
    cleaner_account.location = location;
    cleaner_account.hourly_rate = hourly_rate;
    cleaner_account.is_available = is_available;
    cleaner_account.bump = ctx.bumps.cleaner;

    msg!("Cleaner registered: {}", cleaner_account.name);
    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String, location: String, hourly_rate: u64, is_available: bool)]
pub struct RegisterCleaner<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + 50 + 4 + 100 + 8 + 1 + 1, // Adjust space as needed
        seeds = [b"cleaner", authority.key.as_ref()],
        bump
    )]
    pub cleaner: Account<'info, Cleaner>,
    pub system_program: Program<'info, System>,
}