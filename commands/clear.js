// Exporting an object with properties and methods related to the clear command
module.exports = {
  name: "clear", // The name of the command
  description: "Delete all messages in the channel", // Description of what the command does

  // Async function that executes when the command is called
  async execute(message, args) {
    try {
      // Check if the user has the necessary permissions to manage messages
      if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        return message.reply("You do not have permission to use this command.");
      }

      // Fetch and delete messages
      const channel = message.channel;
      let messages = await channel.messages.fetch({ limit: 100 }); // Fetching messages in the channel

      while (messages.size > 0) {
        await channel.bulkDelete(messages); // Deleting messages in bulk
        messages = await channel.messages.fetch({ limit: 100 }); // Fetching next batch of messages
      }

      // Send a confirmation message
      message.channel.send("All messages in this channel have been deleted.");
    } catch (error) {
      console.error("Error deleting messages:", error); // Logging the error to the console
      message.channel.send("An error occurred while deleting messages."); // Sending an error message to the channel
    }
  },
};
