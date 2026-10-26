// Loads every command and builds its registration payload without contacting Discord.
// Catches broken requires, missing exports and invalid option definitions before deploying.
const { loadCommands } = require('../src/lib/loader');

const commands = loadCommands();
for (const [name, command] of commands) {
  command.data.toJSON();
  console.log(`ok  /${name} (${command.category})`);
}
console.log(`\n${commands.size} commands are valid.`);
