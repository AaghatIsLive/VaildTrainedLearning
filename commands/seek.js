const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "seek",
  description:
    "Sends a private message informing the user about secret mystery gifts in the server.",
  async execute(message) {
    try {
      // Delete the original message that triggered this command
      await message.delete();

      // Check if the role 'Explorers' exists in the server
      const role = message.guild.roles.cache.find(
        (r) => r.name === "Explorers"
      );
      if (role) {
        // If the role exists, add it to the user
        await message.member.roles.add(role);
      }

      // Create an embed message for the user
      const embed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle("You're an explorer!")
        .setDescription(
          `**Congratulations ${message.author}!** You have been granted the role of **"Explorer"**. A secret awaits you in Aaghat's server - there are three mystery gift codes hidden in the server! Keep it a secret and good luck finding them.`
        );

      // Send the embed message to the user via private message
      await message.author.send(embed);

      // Log the username of the user in a new txt file
      const logMessage = `Username: ${
        message.author.username
      } - Time: ${new Date().toLocaleString()}\n`;
      fs.appendFile("log.txt", logMessage, (err) => {
        if (err) {
          console.error(err);
        }
      });
    } catch (error) {
      console.error(error);

      // Log the error message in the log file
      const errorMessage = `Error: ${
        error.message
      } - Time: ${new Date().toLocaleString()}\n`;
      fs.appendFile("log.txt", errorMessage, (err) => {
        if (err) {
          console.error(err);
        }
      });

      // Notify the channel about the error
      message.channel.send(
        "There was an error sending you a private message. Please check your privacy settings and try again later."
      );
    }
  },
};
