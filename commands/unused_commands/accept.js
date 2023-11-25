const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'accept',
  description: 'Accept a user submission',
  async execute(message, args) {
    try {
      // Get the user's submission review ticket channel
      const channel = message.channel;

const file = channel.messages.cache.filter(msg => msg.attachments.size > 0 && msg.attachments.first().name.endsWith('.txt'))
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
        .last()
        .attachments.first();

      if (!file) {
        const errorEmbed = new MessageEmbed()
          .setColor('RED')
          .setTitle('Error')
          .setDescription('No text file attachment found in the channel. Please make sure the submission has a text file attached.')
          .setFooter('If you need assistance, please contact the server staff.');
        return await message.channel.send(errorEmbed);
      }

      // Create a new channel for accepted submissions
      const submissionChannelId = '1097842764739264682'; // Replace with the ID of the user-submissions channel
      const submissionChannel = message.guild.channels.cache.get(submissionChannelId);
      const acceptedEmbed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle('Submission accepted')
        .setDescription(`${channel.topic} has been accepted by ${message.author.username}.`)
        .addField('Submitted file', file.url);
      await submissionChannel.send(acceptedEmbed);
    
    // Delete the user's submission review ticket channel
      await channel.delete();

    } catch (error) {
      const errorEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription(`An error occurred while accepting the submission. Please try again later or contact the server staff for assistance.\n\nError message: ${error.message}`)
        .setFooter('We apologize for any inconvenience.');
      await message.channel.send(errorEmbed);
    }
  },
};
