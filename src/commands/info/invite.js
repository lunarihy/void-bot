const { SlashCommandBuilder, OAuth2Scopes, PermissionFlagsBits } = require('discord.js');
const embeds = require('../../lib/embeds');

// Permissions the moderation commands need. Adjust if you add or remove commands.
const PERMISSIONS = [
  PermissionFlagsBits.BanMembers,
  PermissionFlagsBits.KickMembers,
  PermissionFlagsBits.ModerateMembers,
  PermissionFlagsBits.ManageMessages,
  PermissionFlagsBits.ManageRoles,
  PermissionFlagsBits.ManageChannels,
  PermissionFlagsBits.ManageNicknames,
  PermissionFlagsBits.ViewChannel,
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.EmbedLinks,
  PermissionFlagsBits.ReadMessageHistory,
];

module.exports = {
  data: new SlashCommandBuilder().setName('invite').setDescription('Get a link to add the bot to a server'),

  async execute(interaction) {
    const url = interaction.client.generateInvite({
      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
      permissions: PERMISSIONS,
    });
    return interaction.reply({ embeds: [embeds.info(`[Add the bot to your server](${url})`)] });
  },
};
