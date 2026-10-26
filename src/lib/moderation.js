// Shared checks so every moderation command enforces the same role hierarchy rules.

// Returns an error message if `moderator` may not act on `target`, otherwise null.
function checkHierarchy(interaction, target, action) {
  const { guild, member: moderator } = interaction;
  const me = guild.members.me;

  if (target.id === moderator.id) return `You cannot ${action} yourself.`;
  if (target.id === me.id) return `I cannot ${action} myself.`;
  if (target.id === guild.ownerId) return `You cannot ${action} the server owner.`;
  if (moderator.id !== guild.ownerId && target.roles.highest.comparePositionTo(moderator.roles.highest) >= 0) {
    return `You cannot ${action} **${target.user.tag}** because their highest role is not below yours.`;
  }
  if (target.roles.highest.comparePositionTo(me.roles.highest) >= 0) {
    return `I cannot ${action} **${target.user.tag}** because their highest role is not below mine.`;
  }
  return null;
}

// Returns an error message if `role` cannot be managed by the moderator or the bot, otherwise null.
function checkRole(interaction, role) {
  const { guild, member: moderator } = interaction;
  if (role.managed) return `**${role.name}** is managed by an integration and cannot be assigned manually.`;
  if (role.id === guild.id) return 'The @everyone role cannot be assigned.';
  if (moderator.id !== guild.ownerId && role.comparePositionTo(moderator.roles.highest) >= 0) {
    return `**${role.name}** is not below your highest role.`;
  }
  if (role.comparePositionTo(guild.members.me.roles.highest) >= 0) {
    return `**${role.name}** is not below my highest role.`;
  }
  return null;
}

// Audit log reason that records which moderator ran the command.
function auditReason(interaction, reason) {
  return `${interaction.user.tag}: ${reason || 'No reason given'}`.slice(0, 512);
}

module.exports = { checkHierarchy, checkRole, auditReason };
