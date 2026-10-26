require('dotenv').config();

function parseColor(value, fallback) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value.replace(/^#/, ''), 16);
  return Number.isNaN(parsed) ? fallback : parsed;
}

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  devGuildId: process.env.DEV_GUILD_ID || null,
  ownerIds: (process.env.OWNER_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean),
  colors: {
    primary: parseColor(process.env.EMBED_COLOR, 0x5865f2),
    success: 0x57f287,
    warning: 0xfee75c,
    error: 0xed4245,
  },
};
