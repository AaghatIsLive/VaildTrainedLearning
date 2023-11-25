const Discord = require("discord.js");

module.exports = {
  name: "patch", // The name of the command
  description: "Provides instructions for patching Pokemon Emerald Crest.", // Description of what the command does
  usage: "[language code(Optional)], eg: !patch pt or !patch m or !patch mpt", // Information about command usage

  // Function that executes when the command is called
  execute(message, args) {
    let embed = new Discord.MessageEmbed() // Create a new embed message
      .setTitle("How to Patch"); // Set the title of the embed

    // Check the language code provided as argument
    if (args[0] === "pt") {
      // If language code is 'pt', provide instructions in Portuguese
      embed = new Discord.MessageEmbed()
        .setTitle("Como Parchear") // Set the title of the embed in Portuguese
        .setColor("#FF0000"); // Set the color of the embed to red
    } else if (args[0] === "m") {
      // If language code is 'm', provide instructions for Android/IOS in English
      embed = new Discord.MessageEmbed()
        .setTitle("How to Patch") // Set the title of the embed in English
        .setColor("#FF0000"); // Set the color of the embed to red
    } else if (args[0] === "mpt") {
      // If language code is 'mpt', provide instructions for Android/IOS in Portuguese
      embed = new Discord.MessageEmbed()
        .setTitle("Como Parchear") // Set the title of the embed in Portuguese
        .setColor("#FF0000"); // Set the color of the embed to red
    }

    // Add specific instructions based on the language code provided
    if (args[0] === "pt") {
      // Portuguese instructions for PC
      embed.addField(
        "PC",
        "• Baixe o arquivo de patch Pokemon Emerald Crest do canal #release ..."
      );
    } else if (args[0] === "m" || args[0] === "mpt") {
      // English or Portuguese instructions for Android/IOS
      embed.addField(
        "Android/IOS",
        `• Download Pokemon Emerald Crest patch file from #release...`
      );
    } else {
      // Default instructions for PC in English
      embed.addField(
        "PC",
        "• Download the Pokemon Emerald Crest patch file from #release ..."
      );
    }

    message.channel.send(embed); // Send the embed message
  },
};
