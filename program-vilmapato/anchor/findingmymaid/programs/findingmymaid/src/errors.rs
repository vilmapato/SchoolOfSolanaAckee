use anchor_lang::prelude::*;

#[error_code]
pub enum FindingMyMaidError {
    #[msg("Cleaner already registered.")]
    AlreadyRegistered,
    #[msg("Client already registered.")]
    ClientAlreadyRegistered,
    #[msg("Cleaner not found.")]
    CleanerNotFound,
    #[msg("Client not found.")]
    ClientNotFound,
    #[msg("Job not found.")]
    JobNotFound,
    #[msg("Unauthorized action.")]
    Unauthorized,
    #[msg("Cleaner is invalid or not registered.")]
    InvalidCleaner,
    #[msg("Cleaner is not available.")]
    CleanerUnavailable
}

