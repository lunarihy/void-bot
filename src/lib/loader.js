const fs = require('node:fs');
const path = require('node:path');

function jsFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return jsFiles(full);
      return entry.name.endsWith('.js') ? [full] : [];
    });
}

// Loads every command under src/commands/<category>/<name>.js.
// Each module must export `data` (a SlashCommandBuilder) and `execute(interaction)`.
function loadCommands() {
  const root = path.join(__dirname, '..', 'commands');
  const commands = new Map();

  for (const file of jsFiles(root)) {
    const command = require(file);
    if (!command.data || typeof command.execute !== 'function') {
      throw new Error(`${path.relative(root, file)} must export "data" and "execute"`);
    }
    const { name } = command.data;
    if (commands.has(name)) {
      throw new Error(`Duplicate command name "${name}" in ${path.relative(root, file)}`);
    }
    command.category = path.basename(path.dirname(file));
    commands.set(name, command);
  }

  return commands;
}

// Loads every event under src/events/. Each module exports `name`, optional `once`, and `execute(...args)`.
function loadEvents(client) {
  const root = path.join(__dirname, '..', 'events');
  for (const file of jsFiles(root)) {
    const event = require(file);
    const handler = (...args) => event.execute(...args);
    if (event.once) client.once(event.name, handler);
    else client.on(event.name, handler);
  }
}

module.exports = { loadCommands, loadEvents };
