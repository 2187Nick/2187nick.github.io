# Experimenting

Games using xyflow library

## How to Play
1. Visit [https://2187nick.github.io/](https://2187nick.github.io/)
2. Click "Start Game" to begin
3. Use arrow keys (on desktop) or the on-screen buttons (on mobile) as controls.

## Space Invaders Leaderboard System

The Space Invaders game now features a global leaderboard system that allows players to submit their high scores and compete with others.

### Features
- Automatic tracking of player scores during gameplay
- High score submission system after game completion
- Global leaderboard displaying the top 3 players
- Real-time updates using GitHub Actions

### How It Works
1. When you complete a game, your score will be compared against the current leaderboard
2. If you achieve a high score, you'll be prompted to enter your nickname
3. Your score will be submitted to the leaderboard via a secure API
4. The GitHub Actions workflow will automatically update the leaderboard

### Technical Implementation
The leaderboard system uses the following components:
- A Cloudflare Worker API to receive score submissions
- GitHub Actions workflow to process new scores and update the leaderboard
- GitHub's repository_dispatch event system for secure communication
- React components for displaying the leaderboard and handling user input

## Setting Up the Leaderboard (For Developers)

To set up the leaderboard system on your own fork:

1. Create a Personal Access Token (PAT) in GitHub with `repo` scope
2. Deploy the Cloudflare Worker from `api/worker.js`
3. Set the `GITHUB_TOKEN` in the Cloudflare Worker to your PAT
4. Update the API URL in `src/hooks/useLeaderboard.js` to point to your deployed worker
5. Push the changes to your repository

