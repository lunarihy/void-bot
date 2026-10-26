const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const embeds = require('../../lib/embeds');
const { fail } = require('../../lib/respond');
const { checkRole, auditReason } = require('../../lib/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Manage roles')
    .addSubcommand((s) =>
      s.setName('add').setDescription('Give a role to a member')
        .addUserOption((o) => o.setName('member').setDescription('Member').setRequired(true))
        .addRoleOption((o) => o.setName('role').setDescription('Role to give').setRequired(true)))
    .addSubcommand((s) =>
      s.setName('remove').setDescription('Take a role from a member')
        .addUserOption((o) => o.setName('member').setDescription('Member').setRequired(true))
        .addRoleOption((o) => o.setName('role').setDescription('Role to remove').setRequired(true)))
    .addSubcommand((s) =>
      s.setName('create').setDescription('Create a new role')
        .addStringOption((o) => o.setName('name').setDescription('Role name').setMaxLength(100).setRequired(true))
        .addStringOption((o) => o.setName('color').setDescription('Hex color, e.g. #ff0000')))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return fail(interaction, 'I need the **Manage Roles** permission.');
    }

    const sub = interaction.options.getSubcommand();
    if (sub === 'create') return create(interaction);

    const member = interaction.options.getMember('member');
    const role = interaction.options.getRole('role', true);
    if (!member) return fail(interaction, 'That user is not in this server.');
    const problem = checkRole(interaction, role);
    if (problem) return fail(interaction, problem);

    if (sub === 'add') {
      if (member.roles.cache.has(role.id)) return fail(interaction, `**${member.user.tag}** already has ${role}.`);
      await member.roles.add(role, auditReason(interaction));
      return interaction.reply({ embeds: [embeds.success(`Gave ${role} to **${member.user.tag}**`)] });
    }

    if (!member.roles.cache.has(role.id)) return fail(interaction, `**${member.user.tag}** does not have ${role}.`);
    await member.roles.remove(role, auditReason(interaction));
    return interaction.reply({ embeds: [embeds.success(`Removed ${role} from **${member.user.tag}**`)] });
  },
};

async function create(interaction) {
  const name = interaction.options.getString('name', true);
  const color = interaction.options.getString('color');
  if (color && !/^#?[0-9a-f]{6}$/i.test(color)) return fail(interaction, 'Color must be a hex value like `#ff0000`.');

  const role = await interaction.guild.roles.create({
    name,
    colors: color ? { primaryColor: `#${color.replace('#', '')}` } : undefined,
    reason: auditReason(interaction),
  });
  return interaction.reply({ embeds: [embeds.success(`Created ${role}`)] });
}
