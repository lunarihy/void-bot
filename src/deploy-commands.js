// Registers slash commands with Discord. Run this after adding or changing a command.
const { REST, Routes } = require('discord.js');
const config = require('./config');
const { loadCommands } = require('./lib/loader');

if (!config.token || !config.clientId) {
  console.error('DISCORD_TOKEN and CLIENT_ID must be set in .env.');
  process.exit(1);
}

const body = [...loadCommands().values()].map((command) => command.data.toJSON());
const rest = new REST().setToken(config.token);

(async () => {
  const route = config.devGuildId
    ? Routes.applicationGuildCommands(config.clientId, config.devGuildId)
    : Routes.applicationCommands(config.clientId);
  const scope = config.devGuildId ? `guild ${config.devGuildId}` : 'all servers (global)';

  const result = await rest.put(route, { body });
  console.log(`Registered ${result.length} commands for ${scope}.`);
})().catch((error) => {
  console.error('Failed to register commands:', error);
  process.exit(1);
});
