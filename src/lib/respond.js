const { MessageFlags } = require('discord.js');
const embeds = require('./embeds');

// Replies with an error only the invoking user can see.
function fail(interaction, message) {
  const payload = { embeds: [embeds.error(message)], flags: MessageFlags.Ephemeral };
  return interaction.deferred || interaction.replied ? interaction.editReply(payload) : interaction.reply(payload);
}

module.exports = { fail };
