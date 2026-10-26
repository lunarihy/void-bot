const { SlashCommandBuilder, EmbedBuilder, time, TimestampStyles } = require('discord.js');
const { colors } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Show information about a user')
    .addUserOption((o) => o.setName('user').setDescription('User to look up (defaults to you)')),

  async execute(interaction) {
    const user = await (interaction.options.getUser('user') ?? interaction.user).fetch();
    const member = interaction.options.getMember('user') ?? (interaction.options.getUser('user') ? null : interaction.member);

    const embed = new EmbedBuilder()
      .setColor(member?.displayColor || colors.primary)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true },
        { name: 'Account created', value: time(user.createdAt, TimestampStyles.LongDate) + ` (${time(user.createdAt, TimestampStyles.RelativeTime)})` },
      );

    const badges = user.flags?.toArray() ?? [];
    if (badges.length) embed.addFields({ name: 'Badges', value: badges.join(', ') });

    if (member?.joinedAt) {
      embed.addFields({ name: 'Joined server', value: time(member.joinedAt, TimestampStyles.LongDate) + ` (${time(member.joinedAt, TimestampStyles.RelativeTime)})` });
      if (member.nickname) embed.addFields({ name: 'Nickname', value: member.nickname, inline: true });
      if (member.premiumSince) embed.addFields({ name: 'Boosting since', value: time(member.premiumSince, TimestampStyles.LongDate), inline: true });

      const roles = member.roles.cache
        .filter((r) => r.id !== interaction.guild.id)
        .sort((a, b) => b.position - a.position)
        .map((r) => r.toString());
      if (roles.length) {
        const shown = roles.slice(0, 20).join(' ');
        embed.addFields({ name: `Roles (${roles.length})`, value: roles.length > 20 ? `${shown} and ${roles.length - 20} more` : shown });
      }
    }

    if (user.banner) embed.setImage(user.bannerURL({ size: 1024 }));
    return interaction.reply({ embeds: [embed] });
  },
};
