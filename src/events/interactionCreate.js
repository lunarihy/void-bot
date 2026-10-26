const { Events, MessageFlags } = require('discord.js');
const { ownerIds } = require('../config');
const embeds = require('../lib/embeds');

async function reply(interaction, payload) {
  if (interaction.deferred || interaction.replied) return interaction.followUp(payload);
  return interaction.reply(payload);
}

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isAutocomplete()) {
      const command = interaction.client.commands.get(interaction.commandName);
      return command?.autocomplete?.(interaction).catch((error) => console.error('Autocomplete error:', error));
    }
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    if (command.ownerOnly && !ownerIds.includes(interaction.user.id)) {
      return reply(interaction, { embeds: [embeds.error('This command is restricted to bot owners.')], flags: MessageFlags.Ephemeral });
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error in /${interaction.commandName}:`, error);
      await reply(interaction, {
        embeds: [embeds.error('Something went wrong running that command.')],
        flags: MessageFlags.Ephemeral,
      }).catch(() => {});
    }
  },
};
