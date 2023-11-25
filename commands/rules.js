// Importing the Discord.js library
const Discord = require("discord.js");

// Array of server rules organized by categories
const rules = [
  {
    title: "General",
    rules: [
      "No spamming or flooding the chat.",
      "No sharing illegal or copyrighted content.",
      "No discrimination or hate speech.",
      "Respect all members and staff.",
    ],
  },
  {
    title: "Chatting",
    rules: [
      "Keep conversation appropriate and within the channel's topic.",
      "Use proper grammar and spelling.",
      "Do not use all caps or excessive punctuation.",
      "Do not advertise other servers or communities.",
    ],
  },
  {
    title: "Punishments",
    rules: [
      "Breaking rules may result in a warning, mute, or ban.",
      "Punishments will be determined by staff on a case-by-case basis.",
      "Any attempts to circumvent a punishment will result in an extended ban.",
    ],
  },
];

// Exporting the command module
module.exports = {
  name: "rules", // Command name
  description: "Displays server rules", // Description of the command
  usage: "[rule_number (optional)]", // Information about command usage

  // Function that executes when the command is called
  execute(message, args) {
    let selectedRule; // Variable to store the selected rule

    // Check if a rule number is provided as an argument
    if (args.length && !isNaN(args[0])) {
      let ruleNum = parseInt(args[0]) - 1;
      let currentIndex = 0;

      // Loop through the rule categories
      for (const category of rules) {
        if (
          ruleNum >= currentIndex &&
          ruleNum < currentIndex + category.rules.length
        ) {
          // If the rule number falls within the current category, set the selected rule
          selectedRule = {
            title: category.title,
            value: category.rules[ruleNum - currentIndex],
          };
          break;
        }
        currentIndex += category.rules.length;
      }
    }

    // Create an embed message to display the rules
    const rulesEmbed = new Discord.MessageEmbed()
      .setColor("#ff0000")
      .setTitle("Server Rules") // Title of the embed
      .setAuthor(message.guild.name, message.guild.iconURL()) // Server name and icon
      .setDescription(
        selectedRule
          ? `Rule ${selectedRule.title}: ${selectedRule.value}`
          : "Please read and follow these rules to ensure a pleasant experience for everyone on the server."
      ) // Description of the embed
      .addFields(
        selectedRule
          ? []
          : rules.map((category) => ({
              name: category.title,
              value: category.rules.join("\n"),
            }))
      ) // Add fields for each rule category
      .setFooter("Last updated on:") // Footer text
      .setTimestamp(); // Timestamp for when the embed was created

    // Send the embed message to the channel
    message.channel.send(rulesEmbed);
  },
};
