// poll.js

const { MessageEmbed, MessageCollector } = require('discord.js');

module.exports = {
  name: 'poll',
  description: 'Create a poll interactively',
  execute(message) {
    // Check if the user has the necessary permissions
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      return message.reply('You do not have permission to use this command.');
    }

    // Ask for the poll question
    message.channel.send('What should the poll be about?');

    // Collect the response for the poll question
    const collector = new MessageCollector(message.channel, (m) => m.author.id === message.author.id, {
      time: 60000, // 60 seconds timeout
    });

    let pollQuestion;

    collector.on('collect', (collected) => {
      pollQuestion = collected.content;
      collector.stop(); // Stop collecting responses
    });

    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        return message.reply('Poll creation timed out.');
      }

      // Ask users for options and their associated emojis
      message.channel.send('Enter the poll options and their associated emojis (separate with a comma).\nExample: "Openworld 🌎, Storymode 📖"');

      const optionsCollector = new MessageCollector(
        message.channel,
        (m) => m.author.id === message.author.id,
        {
          time: 60000, // 60 seconds timeout
        }
      );

      let options = [];

      optionsCollector.on('collect', (collected) => {
        const enteredOptions = collected.content.split(',').map((option) => option.trim());

        // Use default options if none are provided
        options = enteredOptions.length > 0 ? enteredOptions : options;
        optionsCollector.stop(); // Stop collecting responses
      });

      optionsCollector.on('end', (collected, reason) => {
        if (reason === 'time') {
          return message.reply('Poll creation timed out.');
        }

        // Ask users for the channel to post the poll
        message.channel.send('Enter the name or mention the channel where you want to post the poll.');

        const channelCollector = new MessageCollector(
          message.channel,
          (m) => m.author.id === message.author.id,
          {
            time: 60000, // 60 seconds timeout
          }
        );

        let targetChannel;

        channelCollector.on('collect', (collected) => {
          const mentionedChannel = collected.mentions.channels.first();

          // Use the mentioned channel if available, otherwise use the collected channel name
          targetChannel = mentionedChannel ? mentionedChannel.name : collected.content.replace(/^#/, '');

          channelCollector.stop(); // Stop collecting responses
        });

        channelCollector.on('end', (collected, reason) => {
          if (reason === 'time') {
            return message.reply('Poll creation timed out.');
          }

          // Ask users whether to ping @everyone or not
          message.channel.send('Should `@everyone` be pinged for this poll? (yes/no)');

          const pingEveryoneCollector = new MessageCollector(
            message.channel,
            (m) => m.author.id === message.author.id,
            {
              time: 60000, // 60 seconds timeout
            }
          );

          let pingEveryone = false;

          pingEveryoneCollector.on('collect', (collected) => {
            const response = collected.content.toLowerCase();

            if (response === 'yes' || response === 'no') {
              pingEveryone = response === 'yes';
              pingEveryoneCollector.stop(); // Stop collecting responses
            } else {
              message.channel.send('Please enter "yes" or "no".');
            }
          });

          pingEveryoneCollector.on('end', (collected, reason) => {
            if (reason === 'time') {
              return message.reply('Poll creation timed out.');
            }

            // Create embed for the poll with options and associated emojis
            const pollEmbed = new MessageEmbed()
              .setTitle(pollQuestion);

            // Add options and associated emojis to the embed
            options.forEach((option) => {
              const [emoji, text] = option.split(' ');
              pollEmbed.addField(`${emoji} ${text}`, ' ', false);
            });

            // Set footer with reaction instructions
            pollEmbed.setFooter(`React with ${options.map((option) => option.split(' ')[1]).join('or ')} to vote.`);

            // Send the poll to the specified channel and react with the specified emojis
            const targetChannelObject = message.guild.channels.cache.find(
              (ch) => ch.name === targetChannel || ch.id === targetChannel
            );

            if (targetChannelObject) {
              targetChannelObject.send(pollEmbed).then((sentMessage) => {
                options.forEach((option) => {
                  const emoji = option.split(' ')[1];
                  sentMessage.react(emoji);
                });

                // Optionally ping @everyone
                if (pingEveryone) {
                  sentMessage.channel.send('@everyone');
                }
              });
            } else {
              message.reply(`Unable to find the specified channel: ${targetChannel}`);
            }
          });
        });
      });
    });
  },
};
