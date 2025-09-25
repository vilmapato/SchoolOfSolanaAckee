use anchor_lang::prelude::*;
use crate::states::*;

pub fn remove_client(ctx: Context<RemoveClient>) -> Result<()> {
    let client = &mut ctx.accounts.client;
    msg!("Client removed: {}", client.name);
    Ok(())
}

#[derive(Accounts)]
pub struct RemoveClient<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        close = authority,
        has_one = authority,
        seeds = [b"client", authority.key.as_ref()],
        bump
    )]
    pub client: Account<'info, Client>,
}