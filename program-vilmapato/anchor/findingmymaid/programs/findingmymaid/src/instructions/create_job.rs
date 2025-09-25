use anchor_lang::prelude::*;
use crate::states::*;
use crate::errors::FindingMyMaidError as JobError;

pub fn create_a_job(
    ctx: Context<CreateJob>,
    location: String,
    date: String,
    duration: u8,
) -> Result<()> {
    let job = &mut ctx.accounts.job;
    let cleaner = &ctx.accounts.cleaner;
    
    //the cleaner must be registered and be available
    require!(cleaner.hourly_rate > 0, JobError::InvalidCleaner);
    require!(cleaner.is_available, JobError::CleanerUnavailable);

    job.client = ctx.accounts.client.key();
    job.cleaner = cleaner.key();
    job.location = location;
    job.date = date;
    job.duration = duration;
    job.total_cost = duration as u64 * cleaner.hourly_rate;
    job.completed = false;
    job.bump = ctx.bumps.job;

    Ok(())
}

#[derive(Accounts)]
#[instruction(location: String, date: String, duration: u8)]
pub struct CreateJob<'info> {
    #[account(mut)]
    pub client: Signer<'info>,

    pub cleaner: Account<'info, Cleaner>,

    #[account(
        init,
        payer = client,
        space = 8 + 32 + 32 + 4 + 100 + 4 + 30 + 1 + 8 + 1 + 1, // adjust as needed
        seeds = [b"job", client.key().as_ref(), cleaner.key().as_ref(), date.as_bytes()],
        bump
    )]
    pub job: Account<'info, Job>,
    
    pub system_program: Program<'info, System>,
}