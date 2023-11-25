const Discord = require("discord.js");
const fs = require('fs');

module.exports = {
  name: 'log',
  description: 'Logs all channels to a file',
  async execute(message, args) {
    const channels = message.guild.channels.cache;
    const log = [];

    channels.forEach((channel) => {
      if (channel.type === 'text') {
        channel.messages.fetch().then((messages) => {
          log.push(`#${channel.name}:\n`);
          messages.forEach((msg) => {
            log.push(`${msg.author.username}#${msg.author.discriminator} [${msg.createdAt.toISOString()}]: ${msg.content}\n`);
          });
        });
      }
    });

    fs.writeFile('log.txt', log.join(''), (err) => {
      if (err) throw err;
      message.channel.send('Log file created!');
    });
  },
};
