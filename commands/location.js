const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'loc',
  description: 'Gives information about a Pokemon based on their species name',
  execute(message, args) {
    let data = fs.readFileSync('./commands/data.txt', 'utf8');
    let species = "SPECIES_" + args[0].toUpperCase();
    let img = args[0].toLowerCase();

    let maps;
    let environments;
    let minLevel;
    let maxLevel;
    let lines = data.split('\n');
    let found = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Map: ')) {
        maps = lines[i].split('Map: ');
      } else if (lines[i].includes('Environment: ')) {
        environments = lines[i].split('Environment: ');
      } else if (lines[i].includes(`Species: ${species}`)) {
        minLevel = lines[i - 2].split('Min level: ');
        maxLevel = lines[i - 1].split('Max level: ');
        found = true;
        break;
      }
    }
    species = args[0];
    if (!found) {
      message.channel.send(`Sorry, the Pokemon ${species} could not be found in the data file.`);
      return;
    }
    const embed = new Discord.MessageEmbed()
      .setColor('000000')
      .setTitle(`${species}`)
      .setThumbnail(`https://play.pokemonshowdown.com/sprites/ani/${img}.gif`)
      .setDescription(`**Map**\n${maps[1].trim()}\n**Environment**\n${environments[1].trim()}\n**Level Range**\n${minLevel[1].trim()} - ${maxLevel[1].trim()}`)
      .setFooter(`                       Mr Kip v1.0.0 by Aaghat`);

    message.channel.send(embed);
  },
};
