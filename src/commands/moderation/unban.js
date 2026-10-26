const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const embeds = require('../../lib/embeds');
const { fail } = require('../../lib/respond');
const { auditReason } = require('../../lib/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Lift a ban')
    .addStringOption((o) => o.setName('user_id').setDescription('ID of the banned user').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason for the unban').setMaxLength(400))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const userId = interaction.options.getString('user_id', true).replace(/[<@!>]/g, '').trim();
    const reason = interaction.options.getString('reason');

    if (!/^\d{17,20}$/.test(userId)) return fail(interaction, 'That is not a valid user ID.');
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
      return fail(interaction, 'I need the **Ban Members** permission.');
    }

    const ban = await interaction.guild.bans.fetch(userId).catch(() => null);
    if (!ban) return fail(interaction, `No ban found for \`${userId}\`.`);

    await interaction.guild.bans.remove(userId, auditReason(interaction, reason));
    return interaction.reply({ embeds: [embeds.success(`Unbanned **${ban.user.tag}**`)] });
  },
};
