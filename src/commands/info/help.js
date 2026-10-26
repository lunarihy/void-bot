const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { colors } = require('../../config');

const CATEGORY_NAMES = { moderation: 'Moderation', info: 'Information' };

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List commands, or show details for one')
    .addStringOption((o) => o.setName('command').setDescription('Command to look up').setAutocomplete(true)),

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused().toLowerCase();
    const choices = [...interaction.client.commands.keys()]
      .filter((name) => name.includes(focused))
      .slice(0, 25)
      .map((name) => ({ name, value: name }));
    return interaction.respond(choices);
  },

  async execute(interaction) {
    const { commands } = interaction.client;
    const name = interaction.options.getString('command');

    if (name) {
      const command = commands.get(name);
      if (!command) {
        return interaction.reply({ content: `No command named \`${name}\`.`, flags: MessageFlags.Ephemeral });
      }
      const data = command.data.toJSON();
      const describe = (opts = []) => opts.map((o) => `\`${o.name}\`${o.required ? '' : ' (optional)'}: ${o.description}`).join('\n');
      const subcommands = (data.options ?? []).filter((o) => o.type === 1);
      const embed = new EmbedBuilder()
        .setColor(colors.primary)
        .setTitle(`/${data.name}`)
        .setDescription(data.description);
      if (subcommands.length) {
        for (const sub of subcommands) {
          embed.addFields({ name: `/${data.name} ${sub.name}`, value: `${sub.description}\n${describe(sub.options)}`.trim() });
        }
      } else if (data.options?.length) {
        embed.addFields({ name: 'Options', value: describe(data.options) });
      }
      return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }

    const byCategory = new Map();
    for (const command of commands.values()) {
      const list = byCategory.get(command.category) ?? [];
      list.push(`\`/${command.data.name}\``);
      byCategory.set(command.category, list);
    }

    const embed = new EmbedBuilder()
      .setColor(colors.primary)
      .setTitle('Commands')
      .setDescription('Use `/help command:<name>` for details on a command.')
      .addFields(
        [...byCategory].map(([category, list]) => ({
          name: CATEGORY_NAMES[category] ?? category,
          value: list.sort().join(' '),
        })),
      );
    return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },
};
