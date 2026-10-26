const { SlashCommandBuilder, EmbedBuilder, time, TimestampStyles } = require('discord.js');
const { colors } = require('../../config');
const { fail } = require('../../lib/respond');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inviteinfo')
    .setDescription('Look up a Discord invite link')
    .addStringOption((o) => o.setName('invite').setDescription('Invite link or code').setRequired(true)),

  async execute(interaction) {
    const input = interaction.options.getString('invite', true).trim();
    const code = input.split('/').pop();
    const invite = await interaction.client.fetchInvite(code, { withCounts: true }).catch(() => null);
    if (!invite?.guild) return fail(interaction, 'That invite is invalid or has expired.');

    const { guild } = invite;
    const embed = new EmbedBuilder()
      .setColor(colors.primary)
      .setTitle(guild.name)
      .setURL(invite.url)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .addFields(
        { name: 'Server ID', value: guild.id, inline: true },
        { name: 'Members', value: `${invite.memberCount?.toLocaleString() ?? '?'} (${invite.presenceCount?.toLocaleString() ?? '?'} online)`, inline: true },
        { name: 'Channel', value: invite.channel ? `#${invite.channel.name}` : 'Unknown', inline: true },
        { name: 'Inviter', value: invite.inviter?.tag ?? 'Unknown', inline: true },
        { name: 'Expires', value: invite.expiresAt ? time(invite.expiresAt, TimestampStyles.RelativeTime) : 'Never', inline: true },
      );
    if (guild.description) embed.setDescription(guild.description);
    return interaction.reply({ embeds: [embed] });
  },
};
