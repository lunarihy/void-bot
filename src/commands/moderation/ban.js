const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const embeds = require('../../lib/embeds');
const { fail } = require('../../lib/respond');
const { checkHierarchy, auditReason } = require('../../lib/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server, even if they are not a member')
    .addUserOption((o) => o.setName('user').setDescription('User or user ID to ban').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason for the ban').setMaxLength(400))
    .addIntegerOption((o) =>
      o.setName('delete_days').setDescription('Days of their messages to delete (0-7)').setMinValue(0).setMaxValue(7))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason');
    const deleteDays = interaction.options.getInteger('delete_days') ?? 0;

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
      return fail(interaction, 'I need the **Ban Members** permission.');
    }

    const member = interaction.options.getMember('user');
    if (member) {
      const problem = checkHierarchy(interaction, member, 'ban');
      if (problem) return fail(interaction, problem);
    } else if (user.id === interaction.user.id) {
      return fail(interaction, 'You cannot ban yourself.');
    }

    await interaction.guild.bans.create(user.id, {
      reason: auditReason(interaction, reason),
      deleteMessageSeconds: deleteDays * 86_400,
    });

    return interaction.reply({
      embeds: [embeds.success(`Banned **${user.tag}**${reason ? ` for: ${reason}` : ''}`)],
    });
  },
};
