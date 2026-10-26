const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const embeds = require('../../lib/embeds');
const { fail } = require('../../lib/respond');
const { checkHierarchy, auditReason } = require('../../lib/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Remove a timeout from a member')
    .addUserOption((o) => o.setName('member').setDescription('Member to un-time-out').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason').setMaxLength(400))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const member = interaction.options.getMember('member');
    if (!member) return fail(interaction, 'That user is not in this server.');
    if (!member.isCommunicationDisabled()) return fail(interaction, `**${member.user.tag}** is not timed out.`);
    const problem = checkHierarchy(interaction, member, 'remove the timeout from');
    if (problem) return fail(interaction, problem);

    await member.timeout(null, auditReason(interaction, interaction.options.getString('reason')));
    return interaction.reply({ embeds: [embeds.success(`Removed the timeout from **${member.user.tag}**`)] });
  },
};
