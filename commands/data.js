const Discord = require("discord.js"); // Importing the Discord.js library
const fs = require("fs"); // Importing the file system module

// Exporting an object with properties and methods related to the collect command
module.exports = {
  name: "collect", // The name of the command
  description: "Logs all users and their roles into a new file (Admin only).", // Description of what the command does

  // Function that executes when the command is called
  execute(message) {
    // Check if the message author is an admin
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      message.channel.send("You do not have permission to use this command.");
      return;
    }

    // Create a list of users and their roles
    const usersAndRoles = [];
    message.guild.members.cache.forEach((member) => {
      const roles = member.roles.cache.map((role) => role.name).join(", "); // Getting roles of a member
      usersAndRoles.push(`${member.user.tag}: ${roles}`); // Pushing user and role information to the list
    });

    // Create a new file with the current timestamp
    const fileName = `userRolesLog_${new Date().toISOString()}.txt`; // Creating a file name with a timestamp

    // Write the user and role information to the file
    fs.writeFileSync(fileName, usersAndRoles.join("\n")); // Writing user and role information to the file

    // Send the file as an attachment
    message.channel.send({
      files: [
        {
          attachment: fileName,
          name: fileName,
        },
      ],
    });
  },
};
