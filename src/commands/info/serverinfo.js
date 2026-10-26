const { SlashCommandBuilder, EmbedBuilder, ChannelType, InteractionContextType, time, TimestampStyles } = require('discord.js');
const { colors } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Show information about this server')
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const { guild } = interaction;
    const channels = guild.channels.cache;
    const count = (type) => channels.filter((c) => c.type === type).size;

    const embed = new EmbedBuilder()
      .setColor(colors.primary)
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .addFields(
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'ID', value: guild.id, inline: true },
        { name: 'Created', value: time(guild.createdAt, TimestampStyles.LongDate), inline: true },
        { name: 'Members', value: guild.memberCount.toLocaleString(), inline: true },
        { name: 'Roles', value: `${guild.roles.cache.size - 1}`, inline: true },
        { name: 'Emojis', value: `${guild.emojis.cache.size}`, inline: true },
        {
          name: 'Channels',
          value: `${count(ChannelType.GuildText)} text · ${count(ChannelType.GuildVoice)} voice · ${count(ChannelType.GuildCategory)} categories`,
        },
        { name: 'Boosts', value: `${guild.premiumSubscriptionCount ?? 0} (tier ${guild.premiumTier})`, inline: true },
        { name: 'Verification', value: `Level ${guild.verificationLevel}`, inline: true },
      );
    if (guild.description) embed.setDescription(guild.description);
    if (guild.banner) embed.setImage(guild.bannerURL({ size: 1024 }));
    return interaction.reply({ embeds: [embed] });
  },
};
