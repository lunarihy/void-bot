# void bot

A Discord moderation and utility bot built on [discord.js](https://discord.js.org) v14 with slash commands.

## Requirements

- Node.js 18.17 or newer
- A Discord application with a bot user

## Setup

1. **Create the bot.** Go to the [Discord Developer Portal](https://discord.com/developers/applications), create an application, and open the **Bot** tab.
   - Click **Reset Token** and copy the token.
   - Under **Privileged Gateway Intents**, turn on **Server Members Intent**. It is needed by `/membercount`, `/inrole` and for role and member lookups.
2. **Install dependencies.**
   ```sh
   npm install
   ```
3. **Configure.** Copy `.env.example` to `.env` and fill it in:

   | Variable | Required | What it is |
   | --- | --- | --- |
   | `DISCORD_TOKEN` | yes | The bot token from step 1 |
   | `CLIENT_ID` | yes | The application ID, from **General Information** |
   | `DEV_GUILD_ID` | no | A server ID. When set, commands are registered to that server only and appear instantly. Leave empty to register globally. |
   | `OWNER_IDS` | no | Comma-separated user IDs allowed to run commands marked `ownerOnly` |
   | `EMBED_COLOR` | no | Hex accent color for embeds, default `#5865F2` |

   `.env` is git-ignored. Never commit your token.
4. **Register slash commands.** Run this once, and again whenever you add or change a command:
   ```sh
   npm run deploy
   ```
   Global commands can take up to an hour to show up. Set `DEV_GUILD_ID` while developing to see changes immediately.
5. **Invite the bot.** Start it once and run `/invite`, or build a link in the portal under **OAuth2 → URL Generator** with the `bot` and `applications.commands` scopes.
6. **Start it.**
   ```sh
   npm start
   ```

## Commands

Moderation commands are hidden from members who lack the matching permission by default. Server admins can change who sees them under **Server Settings → Integrations**.

### Moderation

| Command | Permission | Description |
| --- | --- | --- |
| `/ban user [reason] [delete_days]` | Ban Members | Ban a member, or any user by ID |
| `/unban user_id [reason]` | Ban Members | Lift a ban |
| `/kick member [reason]` | Kick Members | Kick a member |
| `/timeout member duration [reason]` | Timeout Members | Time out a member, e.g. `10m`, `1h30m`, `2d` (max 28 days) |
| `/untimeout member [reason]` | Timeout Members | Remove a timeout |
| `/purge amount [user] [bots]` | Manage Messages | Bulk delete up to 100 recent messages, optionally only from one user or from bots |
| `/lock [channel] [reason]` | Manage Channels | Stop @everyone from sending messages |
| `/unlock [channel] [reason]` | Manage Channels | Undo `/lock` |
| `/nick member [nickname]` | Manage Nicknames | Change or reset a nickname |
| `/role add\|remove member role` | Manage Roles | Give or take a role |
| `/role create name [color]` | Manage Roles | Create a role |

Every moderation action checks role hierarchy, so a moderator can only act on members below them and the bot only on members below its own top role. Actions are recorded in the server audit log with the moderator's name.

### Information

| Command | Description |
| --- | --- |
| `/help [command]` | List commands or show details for one |
| `/ping` | Bot latency |
| `/uptime` | How long the bot has been online |
| `/about` | Bot stats |
| `/invite` | Link to add the bot to a server |
| `/userinfo [user]` | Account and server details for a user |
| `/avatar [user] [server]` | A user's avatar |
| `/serverinfo` | Details about the current server |
| `/roleinfo role` | Details about a role |
| `/membercount` | Humans and bots in the server |
| `/inrole role` | Members who have a role |
| `/inviteinfo invite` | Look up an invite link |

## Project layout

```
src/
  index.js              starts the client
  deploy-commands.js    registers slash commands with Discord
  config.js             reads settings from .env
  commands/<category>/  one file per command
  events/               one file per gateway event
  lib/                  shared helpers (loader, embeds, hierarchy checks, durations)
scripts/
  check-commands.js     validates every command without connecting to Discord
```

## Adding a command

Create a file in `src/commands/<category>/`. The folder name becomes the category shown in `/help`.

```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('hello').setDescription('Say hello'),
  async execute(interaction) {
    await interaction.reply(`Hello, ${interaction.user}!`);
  },
};
```

Optional exports: `autocomplete(interaction)` for options with `.setAutocomplete(true)`, and `ownerOnly: true` to limit the command to `OWNER_IDS`.

Then run `npm run check` to validate it and `npm run deploy` to register it.

## Not yet ported

These features from the original prefix-command code still need to be rebuilt. Most need a database for per-server settings.

- Server configuration: welcome messages, join DMs, autorole, mod logs, anti-invite, alt detection, jail
- Utility: AFK, reminders, polls, embed builder, snipe and edit snipe, emoji tools, server icon and banner tools
- Integrations: Last.fm, Spotify, Urban Dictionary, App Store, Google and image search
- Join-to-create voice channels and XP levels
