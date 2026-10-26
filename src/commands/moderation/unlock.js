const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, ChannelType } = require('discord.js');
const embeds = require('../../lib/embeds');
const { fail } = require('../../lib/respond');
const { auditReason } = require('../../lib/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Let @everyone send messages in a locked channel again')
    .addChannelOption((o) =>
      o.setName('channel').setDescription('Channel to unlock (defaults to this one)').addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement))
    .addStringOption((o) => o.setName('reason').setDescription('Reason').setMaxLength(400))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;
    if (!channel?.permissionOverwrites) return fail(interaction, 'Pick a text channel to unlock.');
    if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageRoles)) {
      return fail(interaction, `I need the **Manage Permissions** permission in ${channel}.`);
    }

    // Reset to "inherit" rather than forcing allow, so category and server defaults apply again.
    await channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      { SendMessages: null, SendMessagesInThreads: null, CreatePublicThreads: null },
      { reason: auditReason(interaction, interaction.options.getString('reason')) },
    );
    return interaction.reply({ embeds: [embeds.success(`Unlocked ${channel}`)] });
  },
};
