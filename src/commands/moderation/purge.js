const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js');
const embeds = require('../../lib/embeds');
const { fail } = require('../../lib/respond');

const TWO_WEEKS = 14 * 86_400_000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete recent messages in this channel')
    .addIntegerOption((o) =>
      o.setName('amount').setDescription('How many messages to scan (1-100)').setMinValue(1).setMaxValue(100).setRequired(true))
    .addUserOption((o) => o.setName('user').setDescription('Only delete messages from this user'))
    .addBooleanOption((o) => o.setName('bots').setDescription('Only delete messages from bots'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount', true);
    const user = interaction.options.getUser('user');
    const botsOnly = interaction.options.getBoolean('bots') ?? false;
    const { channel } = interaction;
    if (!channel?.bulkDelete) return fail(interaction, 'Messages cannot be purged in this channel.');

    if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageMessages)) {
      return fail(interaction, 'I need the **Manage Messages** permission in this channel.');
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const fetched = await channel.messages.fetch({ limit: amount });
    const cutoff = Date.now() - TWO_WEEKS;
    const targets = fetched.filter(
      (m) =>
        m.createdTimestamp > cutoff &&
        !m.pinned &&
        (!user || m.author.id === user.id) &&
        (!botsOnly || m.author.bot),
    );

    if (targets.size === 0) return fail(interaction, 'No matching messages from the last 14 days to delete.');

    const deleted = await channel.bulkDelete(targets, true);
    return interaction.editReply({ embeds: [embeds.success(`Deleted **${deleted.size}** message(s).`)] });
  },
};
