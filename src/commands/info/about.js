const { SlashCommandBuilder, EmbedBuilder, version: djsVersion } = require('discord.js');
const { colors } = require('../../config');
const { formatDuration } = require('../../lib/duration');
const pkg = require('../../../package.json');

module.exports = {
  data: new SlashCommandBuilder().setName('about').setDescription('Information about the bot'),

  async execute(interaction) {
    const { client } = interaction;
    const members = client.guilds.cache.reduce((sum, g) => sum + (g.memberCount ?? 0), 0);

    const embed = new EmbedBuilder()
      .setColor(colors.primary)
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
      .setDescription(pkg.description)
      .addFields(
        { name: 'Servers', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Members', value: members.toLocaleString(), inline: true },
        { name: 'Commands', value: `${client.commands.size}`, inline: true },
        { name: 'Uptime', value: formatDuration(client.uptime), inline: true },
        { name: 'Memory', value: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`, inline: true },
        { name: 'Versions', value: `Node ${process.version}\ndiscord.js v${djsVersion}`, inline: true },
      );
    return interaction.reply({ embeds: [embed] });
  },
};
