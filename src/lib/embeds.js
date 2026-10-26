const { EmbedBuilder } = require('discord.js');
const { colors } = require('../config');

const base = (color, description) => new EmbedBuilder().setColor(color).setDescription(description);

module.exports = {
  info: (description) => base(colors.primary, description),
  success: (description) => base(colors.success, `✅ ${description}`),
  warning: (description) => base(colors.warning, `⚠️ ${description}`),
  error: (description) => base(colors.error, `❌ ${description}`),
};
