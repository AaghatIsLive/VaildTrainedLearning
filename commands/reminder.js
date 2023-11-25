const Discord = require("discord.js");
const fs = require("fs");

function scheduleReminder(date, channel, embed, uniqueID) {
    const now = new Date();
    const timeUntilReminder = date - now;

    return setTimeout(() => {
        channel.send(embed);
        removeReminder(uniqueID); // Remove reminder after sending
    }, timeUntilReminder);
}

function saveReminder(userId, messageContent, reminderTime, channelId, uniqueID) {
    const reminders = JSON.parse(fs.readFileSync("reminders.json", "utf-8") || "[]");
    reminders.push({ uniqueID, userId, messageContent, reminderTime, channelId });
    fs.writeFileSync("reminders.json", JSON.stringify(reminders, null, 4));
}

function removeReminder(uniqueID) {
    const reminders = JSON.parse(fs.readFileSync("reminders.json", "utf-8") || "[]");
    const updatedReminders = reminders.filter(reminder => reminder.uniqueID !== uniqueID);
    fs.writeFileSync("reminders.json", JSON.stringify(updatedReminders, null, 4));
}

module.exports = {
    name: "reminder",
    description: "Sets a reminder.",
    execute(message) {
      if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.hasPermission('MANAGE_MESSAGES'))
      {
       return message.reply("You don't have permission to use this command.")
      }
      const user = message.author;
        let reminderContent, reminderTime, reminderChannel, uniqueID;

        const filter = response => response.author.id === user.id;

        const askForReminderContent = () => {
            message.channel.send("What do you want to be reminded of?");
        };

        const askForReminderTime = () => {
            message.channel.send("In how many minutes or hours do you want to be reminded? (e.g., `30 minutes`, `30 m`, or `2 hours`, `2 H`)");
        };

        const askForChannel = () => {
            message.channel.send("Which channel should I send the reminder to? (Mention the channel)");
        };

        const processReminderContent = response => {
            reminderContent = response.content;
            askForReminderTime();
        };

        const processReminderTime = response => {
            const reminderTimeString = response.content.toLowerCase();
            const timeRegex = /^(\d+)\s*(m|min|minute|h|hr|hour)$/i;

            const matches = reminderTimeString.match(timeRegex);

            if (!matches) {
                message.channel.send("Invalid format. Please use 'X minutes' or 'X hours'.");
                askForReminderTime();
                return;
            }

            const duration = parseInt(matches[1]);
            const unit = matches[2].toLowerCase();

            if (unit === "m" || unit === "min" || unit === "minute") {
                reminderTime = new Date(Date.now() + (duration * 60 * 1000));
            } else if (unit === "h" || unit === "hr" || unit === "hour") {
                reminderTime = new Date(Date.now() + (duration * 60 * 60 * 1000));
            }

            askForChannel();
        };

        const processChannel = response => {
            reminderChannel = response.mentions.channels.first();

            if (!reminderChannel) {
                message.channel.send("Invalid channel. Please mention a channel.");
                askForChannel();
                return;
            }

            const timeDifference = reminderTime - new Date();
            const minutes = Math.floor(timeDifference / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            const embed = new Discord.MessageEmbed()
                .setTitle("Reminder")
                .setDescription(reminderContent)
                .setColor("#FF5733")
                .setTimestamp(reminderTime);

            const job = scheduleReminder(reminderTime, reminderChannel, embed, uniqueID);
            message.channel.send(`Reminder set for ${minutes} minutes and ${seconds} seconds in ${reminderChannel}`);

            // Save reminder to JSON file with unique ID
            saveReminder(user.id, reminderContent, reminderTime, reminderChannel.id, uniqueID);
        };

        const messageHandler = response => {
            if (!reminderContent) {
                processReminderContent(response);
            } else if (!reminderTime) {
                processReminderTime(response);
            } else if (!reminderChannel) {
                // Generate a unique ID for this reminder
                uniqueID = Date.now().toString(36) + Math.random().toString(36).substr(2);
                processChannel(response);
            }
        };

        askForReminderContent();

        const collector = new Discord.MessageCollector(message.channel, filter, { time: 60000 });

        collector.on('collect', messageHandler);
    }
};
