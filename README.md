Discord Bleed Bot SRC
https://bleed.bot/
## Setup

Secrets are read from environment variables, not `config.json`. Copy `.env.example` to `.env` and fill in:

- `DISCORD_TOKEN`: your bot token from the Discord Developer Portal
- `LASTFM_API_KEY`: a Last.fm API key, used by the `fm` command
- `MONGO_URI`: your MongoDB connection string

`.env` is git-ignored, so it never gets committed.
