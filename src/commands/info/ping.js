const { SlashCommandBuilder } = require('discord.js');
const embeds = require('../../lib/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Check the bot latency'),

  async execute(interaction) {
    const { resource } = await interaction.reply({ embeds: [embeds.info('Pinging...')], withResponse: true });
    const roundTrip = resource.message.createdTimestamp - interaction.createdTimestamp;
    return interaction.editReply({
      embeds: [embeds.info(`🏓 Round trip: **${roundTrip}ms** · Gateway: **${interaction.client.ws.ping}ms**`)],
    });
  },
};
