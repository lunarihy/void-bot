const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require('discord.js');
const { colors } = require('../../config');

const MAX_SHOWN = 50;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inrole')
    .setDescription('List the members who have a role')
    .addRoleOption((o) => o.setName('role').setDescription('Role').setRequired(true))
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    await interaction.deferReply();
    await interaction.guild.members.fetch();
    const role = interaction.options.getRole('role', true);
    const members = [...role.members.values()];

    const lines = members.slice(0, MAX_SHOWN).map((m) => `${m} (${m.user.tag})`);
    if (members.length > MAX_SHOWN) lines.push(`...and ${members.length - MAX_SHOWN} more`);

    const embed = new EmbedBuilder()
      .setColor(role.colors.primaryColor || colors.primary)
      .setTitle(`Members with ${role.name} (${members.length})`)
      .setDescription(lines.join('\n') || 'Nobody has this role.');
    return interaction.editReply({ embeds: [embed], allowedMentions: { parse: [] } });
  },
};
