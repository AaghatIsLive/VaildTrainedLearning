const { MessageEmbed, MessageCollector } = require('discord.js');

module.exports = {
  name: 'submit',
  description: 'Create a ticket for reviewing user submissions',
  async execute(message, args) {
    try {
      // Get the category where tickets should be created
      const categoryId = '1097842390955466772';
      const category = message.guild.channels.cache.get(categoryId);

      // Check if the user already has a ticket open
      const user = `submission-${message.author.username}`;
      const existingChannel = category.children.find(channel => channel.name.includes(user.toLowerCase()));
      if (existingChannel) {
        const errorEmbed = new MessageEmbed()
          .setColor('RED')
          .setTitle('Error')
          .setDescription('You already have a submission review ticket open. Please finish that before creating a new one.')
          .setFooter('If you need assistance, please contact the server staff.');
        return await message.channel.send(errorEmbed);
      }

      // Create a new channel for the ticket
      const channel = await message.guild.channels.create(`submission-${message.author.username}`, {
        type: 'text',
        parent: category,
        topic: `Submission review for ${message.author.username}`,
        permissionOverwrites: [
          {
            id: message.guild.id,
            deny: ['VIEW_CHANNEL'],
          },
          {
            id: message.author.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
          },
        ],
      });

// Send a welcome message to the user
const welcomeEmbed = new MessageEmbed()
.setColor('GREEN')
.setTitle('Welcome to your review ticket!')
.setDescription('Please submit your content for review! To ensure a smooth and timely review process, please follow these instructions:')
.addField('Submitting your content', 'Please attach your content to this channel using in the format of a text file `.txt`. If you have any questions or need help with the submission process, please let us know.')
.addField('Review timeline', 'We will review your content as soon as possible, but please note that it may take several days to complete the review.')
.addField('Review criteria', 'We will be evaluating your content based on a set of criteria that have been established to ensure quality and consistency. You can find more information about these criteria in the submission guidelines.')
.addField('Getting help', 'If you have any questions or concerns about the review process, please feel free to ask us. You can also check out the resources listed in the submission guidelines for more information.')
.setFooter('Thank you for submitting your content. We look forward to working with you!')
      await channel.send(welcomeEmbed);

      // Send a message to the user letting them know a new channel has been created
      const infoEmbed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle('New channel created')
        .setDescription(`A new channel has been created for your submission. Please post your submission in ${channel}.`);
      await message.channel.send(infoEmbed);

// Create a message collector to wait for user submission
const collector = new MessageCollector(channel, m => m.author.id === message.author.id);

// Keep track of whether a file has been uploaded already
let fileUploaded = false;

// Wait for user submission
collector.on('collect', async (message) => {
  // Check if the message has attachments
  if (message.attachments.size > 0 && !fileUploaded) {
    // Send a notification to the staff channel
    const staffChannelId = '1041779662323454014';
    const staffChannel = message.guild.channels.cache.get(staffChannelId);
    if (staffChannel) {
      const notificationEmbed = new MessageEmbed()
        .setColor('YELLOW')
        .setTitle('New submission review ticket created')
        .setDescription(`User: ${message.author}\nChannel: ${channel}\n\n${message.content}`)
        .setTimestamp();
      await staffChannel.send(notificationEmbed);
    }
    // Set fileUploaded to true so that the notification is only sent once
    fileUploaded = true;
  }
  // Stop the collector if a file has been uploaded and a message has been sent
  if (fileUploaded && message.content) {
    collector.stop();
  }
});

    } catch (error) {
      console.error(`An error occurred while creating a submission review ticket: ${error}`);
      const errorEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription(`An error occurred while creating your submission review ticket. Please try again later or contact the server staff for assistance.\n\nError message: ${error.message}`)
        .setFooter('We apologize for any inconvenience.');
      await message.channel.send(errorEmbed);
    }
  },
};