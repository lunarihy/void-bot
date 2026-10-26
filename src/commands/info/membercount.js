const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require('discord.js');
const { colors } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Show how many members the server has')
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    await interaction.deferReply();
    const members = await interaction.guild.members.fetch();
    const bots = members.filter((m) => m.user.bot).size;

    const embed = new EmbedBuilder()
      .setColor(colors.primary)
      .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() ?? undefined })
      .addFields(
        { name: 'Total', value: members.size.toLocaleString(), inline: true },
        { name: 'Humans', value: (members.size - bots).toLocaleString(), inline: true },
        { name: 'Bots', value: bots.toLocaleString(), inline: true },
      );
    return interaction.editReply({ embeds: [embed] });
  },
};
