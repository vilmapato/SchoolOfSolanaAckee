//-------------------------------------------------------------------------------
///
/// TASK: Implement the add reaction functionality for the Twitter program
/// 
/// Requirements:
/// - Initialize a new reaction account with proper PDA seeds
/// - Increment the appropriate counter (likes or dislikes) on the tweet
/// - Set reaction fields: type, author, parent tweet, and bump
/// - Handle both Like and Dislike reaction types
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;

use crate::errors::TwitterError;
use crate::states::*;


pub fn add_reaction(ctx: Context<AddReactionContext>, reaction: ReactionType) -> Result<()> {
   
    let reaction_account = &mut ctx.accounts.tweet_reaction;
    let tweet = &mut ctx.accounts.tweet;
    reaction_account.reaction_author = ctx.accounts.reaction_author.key();
    reaction_account.parent_tweet = tweet.key();
    
    reaction_account.reaction = reaction.clone(); 

     // hanble both Like and Dislike
    // if reaction == ReactionType::Like && tweet.likes >= u64::MAX {
    //     return Err(TwitterError::MaxLikesReached.into());
    // }
    // if reaction == ReactionType::Dislike && tweet.dislikes >= u64::MAX {
    //     return Err(TwitterError::MaxDislikesReached.into());
    // }

    reaction_account.bump = ctx.bumps.tweet_reaction;
    
    match reaction {
        ReactionType::Like => {
            tweet.likes += 1;
        }
        ReactionType::Dislike => {
            tweet.dislikes += 1;
        }
    }

    Ok(())
}

#[derive(Accounts)]
pub struct AddReactionContext<'info> {
    // TODO: Add required account constraints
    #[account(mut)]
    pub reaction_author: Signer<'info>,

    #[account(
        init,
        payer = reaction_author,
        space = 8 + Reaction::INIT_SPACE,
        seeds = [
            TWEET_REACTION_SEED.as_bytes(),
            reaction_author.key().as_ref(),
            tweet.key().as_ref(), // why not using context.tweet.key().as_ref()?
        ],
        bump
    )]
    pub tweet_reaction: Account<'info, Reaction>,

    #[account(mut)]
    pub tweet: Account<'info, Tweet>,

    pub system_program: Program<'info, System>,
}
