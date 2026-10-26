const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const embeds = require('../../lib/embeds');
const { fail } = require('../../lib/respond');
const { checkHierarchy, auditReason } = require('../../lib/moderation');
const { parseDuration, formatDuration } = require('../../lib/duration');

const MAX_TIMEOUT = 28 * 86_400_000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Time out a member so they cannot talk or join voice')
    .addUserOption((o) => o.setName('member').setDescription('Member to time out').setRequired(true))
    .addStringOption((o) =>
      o.setName('duration').setDescription('How long, e.g. 10m, 1h, 2d (max 28d)').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason for the timeout').setMaxLength(400))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const member = interaction.options.getMember('member');
    const duration = parseDuration(interaction.options.getString('duration', true));
    const reason = interaction.options.getString('reason');

    if (!member) return fail(interaction, 'That user is not in this server.');
    if (!duration) return fail(interaction, 'Invalid duration. Use something like `10m`, `1h30m` or `2d`.');
    if (duration > MAX_TIMEOUT) return fail(interaction, 'Timeouts can be at most 28 days.');
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return fail(interaction, 'I need the **Timeout Members** permission.');
    }
    const problem = checkHierarchy(interaction, member, 'time out');
    if (problem) return fail(interaction, problem);
    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      return fail(interaction, 'Administrators cannot be timed out.');
    }

    await member.timeout(duration, auditReason(interaction, reason));
    return interaction.reply({
      embeds: [embeds.success(`Timed out **${member.user.tag}** for ${formatDuration(duration)}${reason ? `: ${reason}` : ''}`)],
    });
  },
};
