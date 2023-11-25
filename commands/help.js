const Discord = require("discord.js"); // Importing the Discord.js library

module.exports = {
  name: "help", // The name of the command
  description: "Lists all commands and their details", // Description of what the command does

  // Function that executes when the command is called
  execute(message, args) {
    let commands = message.client.commands.array(); // Get an array of all commands

    if (!args.length) {
      // If no arguments provided, list all available commands
      const embed = new Discord.MessageEmbed()
        .setTitle("Help Menu")
        .setColor(0x00ae86) // Set the embed color
        .setDescription(
          `Here's a list of all the commands available for this bot:`
        )
        .setFooter(`Mr Kip v7.0 by Aaghat`); // Adding a footer

      // List all commands without details
      commands.forEach((command) => {
        if (command.name !== "seek") {
          // Exclude a specific command (if needed)
          embed.addField(command.name, command.description); // Add command name and description to the embed
        }
      });

      return message.channel.send(embed); // Send the embed message
    } else {
      // Get the requested command
      const name = args[0].toLowerCase(); // Convert argument to lowercase
      const command = commands.find(
        (c) => c.name === name || (c.aliases && c.aliases.includes(name))
      ); // Find the command

      if (!command) {
        return message.reply("That's not a valid command!"); // Handle case where command is not found
      }

      // Show details for the requested command
      const embed = new Discord.MessageEmbed()
        .setTitle(`Details for command '${command.name}'`)
        .setColor(0x00ae86) // Set the embed color
        .addField("Description", command.description) // Add command description to the embed
        .addField("Usage", `\`!${command.name} ${command.usage}\``); // Add command usage to the embed

      if (command.aliases) {
        embed.addField("Aliases", `\`${command.aliases.join("`, `")}\``); // Add command aliases to the embed (if available)
      }

      message.channel.send(embed); // Send the embed message
    }
  },
};
