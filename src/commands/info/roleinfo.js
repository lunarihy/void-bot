const { SlashCommandBuilder, EmbedBuilder, InteractionContextType, time, TimestampStyles } = require('discord.js');
const { colors } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('Show information about a role')
    .addRoleOption((o) => o.setName('role').setDescription('Role to look up').setRequired(true))
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const role = interaction.options.getRole('role', true);
    const keyPerms = role.permissions.has('Administrator')
      ? 'Administrator'
      : role.permissions.toArray().slice(0, 15).join(', ') || 'None';

    const embed = new EmbedBuilder()
      .setColor(role.colors.primaryColor || colors.primary)
      .setTitle(role.name)
      .addFields(
        { name: 'ID', value: role.id, inline: true },
        { name: 'Color', value: role.hexColor, inline: true },
        { name: 'Members', value: `${role.members.size}`, inline: true },
        { name: 'Position', value: `${role.position}`, inline: true },
        { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
        { name: 'Shown separately', value: role.hoist ? 'Yes' : 'No', inline: true },
        { name: 'Created', value: time(role.createdAt, TimestampStyles.LongDate) },
        { name: 'Permissions', value: keyPerms },
      );
    return interaction.reply({ embeds: [embed] });
  },
};
