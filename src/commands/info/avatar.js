const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { colors } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Show a user's avatar")
    .addUserOption((o) => o.setName('user').setDescription('User (defaults to you)'))
    .addBooleanOption((o) => o.setName('server').setDescription('Show their server-specific avatar if they have one')),

  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const member = interaction.options.getMember('user') ?? (interaction.options.getUser('user') ? null : interaction.member);
    const useServer = interaction.options.getBoolean('server') ?? false;
    const url = (useServer && member?.avatar ? member : user).displayAvatarURL({ size: 1024 });

    const embed = new EmbedBuilder()
      .setColor(colors.primary)
      .setTitle(`${user.username}'s avatar`)
      .setURL(url)
      .setImage(url);
    return interaction.reply({ embeds: [embed] });
  },
};
