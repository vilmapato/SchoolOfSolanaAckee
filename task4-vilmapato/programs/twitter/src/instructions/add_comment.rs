//-------------------------------------------------------------------------------
///
/// TASK: Implement the add comment functionality for the Twitter program
/// 
/// Requirements:
/// - Validate that comment content doesn't exceed maximum length
/// - Initialize a new comment account with proper PDA seeds
/// - Set comment fields: content, author, parent tweet, and bump
/// - Use content hash in PDA seeds for unique comment identification
/// 
///-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
///
/// TASK: Implement the add comment functionality for the Twitter program
/// 
/// Requirements:
/// - Validate that comment content doesn't exceed maximum length
/// - Initialize a new comment account with proper PDA seeds
/// - Set comment fields: content, author, parent tweet, and bump
/// - Use content hash in PDA seeds for unique comment identification
/// 
///-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
///
/// TASK: Implement the add comment functionality for the Twitter program
/// 
/// Requirements:
/// - Validate that comment content doesn't exceed maximum length
/// - Initialize a new comment account with proper PDA seeds
/// - Set comment fields: content, author, parent tweet, and bump
/// - Use content hash in PDA seeds for unique comment identification
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;
use crate::errors::TwitterError;
use crate::states::*;
use anchor_lang::solana_program::hash::hash;

// Put the Accounts struct ABOVE the handler so the macro sees the instruction args.
#[derive(Accounts)]
#[instruction(comment_content: String)] // expose arg to seeds
pub struct AddCommentContext<'info> {
    #[account(mut)]
    pub comment_author: Signer<'info>,

    // parent tweet must be declared before 'comment' so we can use its key in seeds
    #[account(mut)]
    pub tweet: Account<'info, Tweet>,

    #[account(
        init,
        payer = comment_author,
        space = 8 + Tweet::INIT_SPACE,
        seeds = [
            COMMENT_SEED.as_bytes(),
            comment_author.key().as_ref(),
            {&hash(comment_content.as_bytes()).to_bytes().as_ref()},
            tweet.key().as_ref(),
        ],
        bump
    )]
    pub comment: Account<'info, Comment>,

    pub system_program: Program<'info, System>,
}

pub fn add_comment(ctx: Context<AddCommentContext>, comment_content: String) -> Result<()> {
    // bytes-length check (not chars)
    if comment_content.as_bytes().len() > COMMENT_LENGTH {
        return Err(TwitterError::CommentTooLong.into());
    }

    let tweet = &ctx.accounts.tweet;
    let comment = &mut ctx.accounts.comment;

    comment.content = comment_content;
    comment.comment_author = ctx.accounts.comment_author.key();
    comment.parent_tweet = tweet.key();
    comment.bump = ctx.bumps.comment; // bump provided by the macro

    Ok(())
}