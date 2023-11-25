const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'close',
  description: 'Close a submission review ticket channel',
  async execute(message, args) {
    try {
      // Check if the command was used in a submission review ticket channel
      if (!message.channel.topic || !message.channel.topic.startsWith('Submission review for')) {
        const errorEmbed = new MessageEmbed()
          .setColor('RED')
          .setTitle('Error')
          .setDescription('This command can only be used in a submission review ticket channel.')
          .setFooter('If you need assistance, please contact the server staff.');
        return await message.channel.send(errorEmbed);
      }

      // Delete the submission review ticket channel
      await message.channel.delete();

    } catch (error) {
      console.error(`An error occurred while closing a submission review: ${error}`);
      const errorEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription(`An error occurred while closing the submission review. Please try again later or contact the server staff for assistance.\n\nError message: ${error.message}`)
        .setFooter('We apologize for any inconvenience.');
      await message.channel.send(errorEmbed);
    }
  },
};
