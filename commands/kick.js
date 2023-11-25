const Discord = require("discord.js"); // Importing the Discord.js library

module.exports = {
  name: "kick", // The name of the command
  description: "Kick a member from the server", // Description of what the command does

  execute(message, args) {
    const user = message.mentions.users.first(); // Extracting the mentioned user from the message
    if (!user) return message.reply("You need to mention a user to kick them!"); // Handling case where no user is mentioned

    const member = message.guild.member(user); // Getting the member object associated with the mentioned user
    if (!member) return message.reply("This user isn't in this server"); // Handling case where user is not in the server

    if (!message.member.hasPermission("KICK_MEMBERS"))
      // Checking if the author has permission to kick members
      return message.reply("You don't have permission to kick members!"); // Handling case where author doesn't have permission

    const reason = args.slice(1).join(" ") || "No reason provided"; // Extracting kick reason from arguments or using a default if not provided

    try {
      member.send(`You were kicked from ${message.guild.name} for: ${reason}`); // Sending a direct message to the kicked user
    } catch (err) {
      console.error(`Could not send direct message to ${user.tag}:`, err); // Handling errors when sending a direct message
    }

    // Creating an embed message to notify about the kick
    const kickedEmbed = new Discord.MessageEmbed()
      .setColor("#ff0000") // Setting the embed color to red
      .setTitle(`${user.tag} has been kicked`) // Title of the embed
      .addFields(
        { name: "Reason", value: reason }, // Adding a field for the reason
        { name: "Kicked by", value: message.author.tag } // Adding a field for the author
      )
      .setTimestamp(); // Adding a timestamp

    message.channel.send(kickedEmbed); // Sending the embed message

    // Kicking the member and handling success/failure
    member
      .kick(reason)
      .then(() =>
        message.reply(`Successfully kicked ${user.tag} for: ${reason}`)
      ) // Notifying about the successful kick
      .catch((err) => message.reply("I was unable to kick the member")); // Handling errors when kicking the member
  },
};
