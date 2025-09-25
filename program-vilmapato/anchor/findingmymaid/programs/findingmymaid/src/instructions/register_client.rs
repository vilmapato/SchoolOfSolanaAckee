use anchor_lang::prelude::*;
use crate::states::*;

pub fn register_client_acc(
    ctx: Context<RegisterClient>,
    name: String,
) -> Result<()> {
    let client = &mut ctx.accounts.client;
    client.authority = ctx.accounts.authority.key();
    client.name = name;
    client.review = 0; // optional
    client.bump = ctx.bumps.client;

    msg!("Client registered: {}", client.name);
    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct RegisterClient<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,  

    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + 50 + 8 + 1, // Adjust space as needed
        seeds = [b"client", authority.key.as_ref()],
        bump
    )]
    pub client: Account<'info, Client>,
    pub system_program: Program<'info, System>,
}