use anchor_lang::prelude::*;

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

#[account]
pub struct Client {
    pub authority: Pubkey,
    pub name: String,
    pub review: u8, // optional
    pub bump: u8,
}