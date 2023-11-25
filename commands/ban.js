const Discord = require("discord.js"); // Importing the Discord.js library

// Exporting an object with properties and methods related to the ban command
module.exports = {
  name: "ban", // The name of the command
  description:
    "Ban a member from the server and delete their messages for the past week", // Description of what the command does

  // Function that executes when the command is called
  execute(message, args) {
    const user = message.mentions.users.first(); // Extracting the mentioned user from the message
    if (!user) return message.reply("You need to mention a user to ban them!"); // Handling case where no user is mentioned

    const member = message.guild.member(user); // Getting the member object associated with the mentioned user
    if (!member) return message.reply("This user isn't in this server"); // Handling case where user is not in the server

    if (!message.member.hasPermission("BAN_MEMBERS"))
      // Checking if the author has permission to ban members
      return message.reply("You don't have permission to ban members!"); // Handling case where author doesn't have permission

    const reason = args.slice(1).join(" ") || "No reason provided"; // Extracting ban reason from arguments or using a default if not provided

    try {
      member.send(`You were banned from ${message.guild.name} for: ${reason}`); // Sending a direct message to the banned user
    } catch (err) {
      console.error(`Could not send direct message to ${user.tag}:`, err); // Handling errors when sending a direct message
    }

    const days = 7; // number of days to delete messages from

    member
      .ban({ reason }) // Banning the user with the specified reason
      .then(() => {
        message.reply(`Successfully banned ${user.tag} for: ${reason}`); // Notifying the channel about the successful ban
        message.guild
          .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
          .then((auditLogs) => {
            const entry = auditLogs.entries.first();
            if (entry.target.id === member.id) {
              const executor = entry.executor;
              const deleteReason = `Banned by ${executor.tag} for: ${reason}`; // Constructing a reason for message deletion
              message.channel.send(
                `Deleting messages from ${user.tag} for: ${deleteReason}`
              ); // Notifying channel about message deletion
              message.channel.messages
                .fetch({ limit: 100 })
                .then((messages) => {
                  const messagesToDelete = messages.filter((m) => {
                    return (
                      m.author.id === user.id &&
                      m.createdTimestamp >=
                        Date.now() - days * 24 * 60 * 60 * 1000
                    );
                  }); // Filtering messages to delete based on author and timestamp
                  message.channel
                    .bulkDelete(messagesToDelete, true)
                    .then((deletedMessages) => {
                      message.channel.send(
                        `Deleted ${deletedMessages.size} messages from ${user.tag}`
                      );
                    }) // Notifying about the number of messages deleted
                    .catch((err) => {
                      console.error(
                        `Error deleting messages from ${user.tag}:`,
                        err
                      );
                      message.channel.send(
                        `There was an error deleting messages from ${user.tag}`
                      );
                    }); // Handling errors when deleting messages
                })
                .catch((err) => {
                  console.error(
                    `Error fetching messages from ${user.tag}:`,
                    err
                  );
                  message.channel.send(
                    `There was an error fetching messages from ${user.tag}`
                  );
                }); // Handling errors when fetching messages
            }
          })
          .catch((err) => {
            console.error("Error fetching audit logs:", err);
          }); // Handling errors when fetching audit logs
      })
      .catch((err) => message.reply("I was unable to ban the member")); // Handling errors when banning the member
  },
};
