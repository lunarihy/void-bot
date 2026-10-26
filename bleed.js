require("dotenv").config();
const { default_prefix, color } = require("./config.json");
const Discord = require("discord.js");
require("@haileybot/sanitize-role-mentions")();
const client = new Discord.Client({
  disableMentions: "everyone",
  fetchAllMembers: true,
  partials: ['MESSAGE', 'REACTION']
});
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(console.log('connected to mongoose'))
const jointocreate = require("./jointocreate");
jointocreate(client);
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.db = require("quick.db");
module.exports = client;
["command", "event"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});
Discord.Constants.DefaultOptions.ws.properties.$browser = "Discord Android"

client.login(process.env.DISCORD_TOKEN)
