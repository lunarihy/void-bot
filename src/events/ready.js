const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    client.startedAt = Date.now();
    client.user.setActivity('/help', { type: ActivityType.Listening });
    console.log(`Logged in as ${client.user.tag} in ${client.guilds.cache.size} servers with ${client.commands.size} commands.`);
  },
};
