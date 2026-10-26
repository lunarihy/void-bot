const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const embeds = require('../../lib/embeds');
const { fail } = require('../../lib/respond');
const { checkHierarchy, auditReason } = require('../../lib/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption((o) => o.setName('member').setDescription('Member to kick').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason for the kick').setMaxLength(400))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const member = interaction.options.getMember('member');
    const reason = interaction.options.getString('reason');

    if (!member) return fail(interaction, 'That user is not in this server.');
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
      return fail(interaction, 'I need the **Kick Members** permission.');
    }
    const problem = checkHierarchy(interaction, member, 'kick');
    if (problem) return fail(interaction, problem);

    await member.kick(auditReason(interaction, reason));
    return interaction.reply({
      embeds: [embeds.success(`Kicked **${member.user.tag}**${reason ? ` for: ${reason}` : ''}`)],
    });
  },
};
