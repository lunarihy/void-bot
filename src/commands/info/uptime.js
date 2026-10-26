const { SlashCommandBuilder, time, TimestampStyles } = require('discord.js');
const embeds = require('../../lib/embeds');
const { formatDuration } = require('../../lib/duration');

module.exports = {
  data: new SlashCommandBuilder().setName('uptime').setDescription('How long the bot has been online'),

  async execute(interaction) {
    const { client } = interaction;
    const since = new Date(Date.now() - client.uptime);
    return interaction.reply({
      embeds: [embeds.info(`Online for **${formatDuration(client.uptime)}** (since ${time(since, TimestampStyles.RelativeTime)})`)],
    });
  },
};
