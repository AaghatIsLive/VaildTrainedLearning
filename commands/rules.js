const Discord = require('discord.js');

const rules = [
  {
    title: 'General',
    rules: [
      'No spamming or flooding the chat.',
      'No sharing illegal or copyrighted content.',
      'No discrimination or hate speech.',
      'Respect all members and staff.'
    ]
  },
  {
    title: 'Chatting',
    rules: [
      'Keep conversation appropriate and within the channel\'s topic.',
      'Use proper grammar and spelling.',
      'Do not use all caps or excessive punctuation.',
      'Do not advertise other servers or communities.'
    ]
  },
  {
    title: 'Punishments',
    rules: [
      'Breaking rules may result in a warning, mute, or ban.',
      'Punishments will be determined by staff on a case-by-case basis.',
      'Any attempts to circumvent a punishment will result in an extended ban.'
    ]
  }
];

module.exports = {
  name: 'rules',
  description: 'Displays server rules',
  usage: '[rule_number (optional)]',
  execute(message, args) {
    let selectedRule;

    if (args.length && !isNaN(args[0])) {
      let ruleNum = parseInt(args[0]) - 1;
      let currentIndex = 0;

      for (const category of rules) {
        if (ruleNum >= currentIndex && ruleNum < currentIndex + category.rules.length) {
          selectedRule = {
            title: category.title,
            value: category.rules[ruleNum - currentIndex]
          };
          break;
        }
        currentIndex += category.rules.length;
      }
    }

    const rulesEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Server Rules')
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription(
        selectedRule
          ? `Rule ${selectedRule.title}: ${selectedRule.value}`
          : 'Please read and follow these rules to ensure a pleasant experience for everyone on the server.'
      )
      .addFields(
        selectedRule ? [] : rules.map(category => ({ name: category.title, value: category.rules.join('\n') }))
      )
      .setFooter('Last updated on:')
      .setTimestamp();

    message.channel.send(rulesEmbed);
  }
};
