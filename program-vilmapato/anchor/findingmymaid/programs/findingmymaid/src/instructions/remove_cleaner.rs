use anchor_lang::prelude::*;
use crate::states::*;

pub fn remove_cleaner(ctx: Context<RemoveCleaner>) -> Result<()> {
    let cleaner = &mut ctx.accounts.cleaner;
    
    msg!("Cleaner removed: {}", cleaner.name);
    Ok(())
}

#[derive(Accounts)]
pub struct RemoveCleaner<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
   
    #[account(
        mut,
        close = authority,
        has_one = authority,
        seeds = [b"cleaner", authority.key.as_ref()],
        bump
    )]
    pub cleaner: Account<'info, Cleaner>,
   
}
