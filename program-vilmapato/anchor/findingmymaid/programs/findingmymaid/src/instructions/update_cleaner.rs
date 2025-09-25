use anchor_lang::prelude::*;
use crate::states::*;

pub fn update_info_cleaner(
    ctx: Context<UpdateCleaner>,
    new_location: String,
    new_rate: u64,
) -> Result<()> {
    let cleaner = &mut ctx.accounts.cleaner;
    cleaner.location = new_location;
    cleaner.hourly_rate = new_rate;
    msg!("Cleaner updated: {}", cleaner.name);
    Ok(())
}

#[derive(Accounts)]
// #[account(mut, has_one = authority)]
pub struct UpdateCleaner<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,


    #[account(
        mut,
        has_one = authority,
        seeds = [b"cleaner", authority.key.as_ref()],
        bump
    )]
    pub cleaner: Account<'info, Cleaner>,
}