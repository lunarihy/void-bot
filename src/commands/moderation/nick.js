const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const embeds = require('../../lib/embeds');
const { fail } = require('../../lib/respond');
const { checkHierarchy, auditReason } = require('../../lib/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription("Change or reset a member's nickname")
    .addUserOption((o) => o.setName('member').setDescription('Member to rename').setRequired(true))
    .addStringOption((o) => o.setName('nickname').setDescription('New nickname (leave empty to reset)').setMaxLength(32))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const member = interaction.options.getMember('member');
    const nickname = interaction.options.getString('nickname');

    if (!member) return fail(interaction, 'That user is not in this server.');
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return fail(interaction, 'I need the **Manage Nicknames** permission.');
    }
    if (member.id !== interaction.user.id) {
      const problem = checkHierarchy(interaction, member, 'rename');
      if (problem) return fail(interaction, problem);
    } else if (!member.manageable) {
      return fail(interaction, 'I cannot change your nickname.');
    }

    await member.setNickname(nickname, auditReason(interaction));
    return interaction.reply({
      embeds: [embeds.success(nickname ? `Renamed **${member.user.tag}** to **${nickname}**` : `Reset **${member.user.tag}**'s nickname`)],
    });
  },
};
