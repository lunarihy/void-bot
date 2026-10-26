const { Client, GatewayIntentBits, Partials } = require('discord.js');
const config = require('./config');
const { loadCommands, loadEvents } = require('./lib/loader');

if (!config.token) {
  console.error('DISCORD_TOKEN is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.GuildMember],
});

client.commands = loadCommands();
loadEvents(client);

process.on('unhandledRejection', (error) => console.error('Unhandled rejection:', error));

client.login(config.token).catch((error) => {
  console.error('Failed to log in:', error.message);
  process.exit(1);
});
