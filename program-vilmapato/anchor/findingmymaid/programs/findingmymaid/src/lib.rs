#![allow(unexpected_cfgs)]
use crate::instructions::*;
use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod states;

declare_id!("PeDwUBNTDfe2osM61XLn3AsMyUm1LDGA7iB4Q2MRzgX"); // I have to change this when deploying

#[program]
pub mod findingmymaid {
    use super::*;

    pub fn register_cleaner(
        ctx: Context<RegisterCleaner>,
        name: String,
        location: String,
        hourly_rate: u64,
        is_available: bool,
    ) -> Result<()> {
        instructions::register_cleaner::create_cleaner_acc(ctx, name, location, hourly_rate, is_available)
    }

    pub fn update_cleaner(
        ctx: Context<UpdateCleaner>,
        new_location: String,
        new_rate: u64,
    ) -> Result<()> {
        instructions::update_cleaner::update_info_cleaner(ctx, new_location, new_rate)
    }

    pub fn create_job(
        ctx: Context<CreateJob>,
        location: String,
        date: String,
        duration: u8,
    ) -> Result<()> {
        instructions::create_job::create_a_job(ctx, location, date, duration)
    }

    pub fn register_client(
        ctx: Context<RegisterClient>,
        name: String,
    ) -> Result<()> {
        instructions::register_client::register_client_acc(ctx, name)
    }
    pub fn remove_cleaner(ctx: Context<RemoveCleaner>) -> Result<()> {
        instructions::remove_cleaner::remove_cleaner(ctx)
    }

    pub fn remove_client(ctx: Context<RemoveClient>) -> Result<()> {
        instructions::remove_client::remove_client(ctx)
    }
}
