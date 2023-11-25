// Require necessary modules
const Discord = require('discord.js');
const client = new Discord.Client();
const express = require('express');


// Log in to Discord using the provided token
client.login(process.env.token);

const fs = require('fs');
client.commands = new Discord.Collection();

// Read command files from the 'commands' directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Load each command file and store them in a collection
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Event handler when the bot is ready
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('Emerald Crest v2.0', { type: 'PLAYING' });
});

let avatarIndex = 1; // Initialize the avatar index

// Function to change the bot's avatar
function changeAvatar() {
  const avatarPath = `mr-kip/sprite_${avatarIndex}.png`;

  fs.access(avatarPath, fs.constants.F_OK, (err) => {
    if (!err) {
      const avatarData = fs.readFileSync(avatarPath);
      client.user.setAvatar(avatarData)
        .then(() => console.log(`Changed avatar to sprite_${avatarIndex}.png`))
        .catch(console.error);
    } else {
      console.error(`Avatar sprite_${avatarIndex}.png does not exist.`);
    }
  });

  // Increment avatarIndex (loop around if it exceeds 16)
  avatarIndex = avatarIndex < 16 ? avatarIndex + 1 : 1;
}

// Schedule the avatar change
setInterval(changeAvatar, 120 * 60 * 1000); // 120 minutes * 60 seconds * 1000 milliseconds


// Define a Map to store event dates and whether reminders have been sent
eventRemindersSent = new Map();

try {
  const data = fs.readFileSync('eventReminders.json');

  if (data.length > 0) {
    eventRemindersSent = new Map(JSON.parse(data));
  }
} catch (err) {
  console.error('Error loading event reminders:', err);
}

// Function to save event reminders to the JSON file
function saveEventReminders() {
  fs.writeFileSync('eventReminders.json', JSON.stringify([...eventRemindersSent]));
}


const { MessageEmbed } = require('discord.js');

// Function to send a reminder the day before an event starts
async function sendEventReminder(event) {
  const [day, month, year, pokemon] = event;
  const eventDate = new Date(year, month - 1, day); // month is 0-indexed in JavaScript
  const currentDate = new Date();

  // Set both dates to the start of the day to avoid precision issues
  eventDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  if (eventDate.getDate() - 1 === currentDate.getDate() &&
    eventDate.getMonth() === currentDate.getMonth() &&
    eventDate.getYear() === currentDate.getYear()) {
    const reminderEmbed = new MessageEmbed()
      .setTitle(`Reminder: Tomorrow is the spotlight event for ${pokemon}!`)
      .setColor('#FF5733'); // Set the color of the embed

    const moderatorsChannel = client.channels.cache.find(
      (channel) => channel.name === 'moderators-only'
    );

    if (moderatorsChannel) {
      try {
        await moderatorsChannel.send(reminderEmbed);
        eventRemindersSent.set(event.toString(), true);
        saveEventReminders();
      } catch (error) {
        console.error('Error sending reminder:', error);
      }
    }
  }
}

// Function to send a reminder once an event starts
async function sendEventStartReminder(event) {
  const [day, month, year, pokemon] = event;
  const eventDate = new Date(year, month - 1, day); // month is 0-indexed in JavaScript
  const currentDate = new Date();
  // console.log(`currentdate` + currentDate + 'eventdate' + eventDate);
  if (eventDate.getDate() === currentDate.getDate() &&
    eventDate.getMonth() === currentDate.getMonth() &&
    eventDate.getYear() === currentDate.getYear()) {
    const startEmbed = new MessageEmbed()
      .setTitle(`The spotlight event for ${pokemon} has started!`)
      .setColor('#33FF57'); // Set the color of the embed

    const moderatorsChannel = client.channels.cache.find(
      (channel) => channel.name === 'announcements-📣'
    );


    if (moderatorsChannel) {
      try {
        await moderatorsChannel.send(startEmbed);
        eventRemindersSent.set(event.toString(), true);
      } catch (error) {
        console.error('Error sending start reminder:', error);
      }
    }
  }
}

// Function to check for upcoming reminders
function checkReminders() {
  const reminders = JSON.parse(fs.readFileSync("reminders.json", "utf-8") || "[]");
  const now = new Date();

  for (const reminder of reminders) {
    const reminderTime = new Date(reminder.reminderTime);

    if (now >= reminderTime) {
      const channel = client.channels.cache.get(reminder.channelId);

      if (channel) {
        const embed = new Discord.MessageEmbed()
          .setTitle("Reminder")
          .setDescription(reminder.messageContent)
          .setColor("#FF5733")
          .setTimestamp(reminderTime);

        channel.send(embed);
      }

      // Remove the reminder from the list
      const updatedReminders = reminders.filter(r => r !== reminder);
      fs.writeFileSync("reminders.json", JSON.stringify(updatedReminders, null, 4));
    }
  }
}

// Event handler for when a message is received
client.on('message', message => {
  // Check for reminders when the bot starts
  checkReminders();

  // Check for reminders every minute
  setInterval(checkReminders, 60000);

  // Ignore messages that don't start with '!'
  if (!message.content.startsWith('!')) return;

  // Ignore messages from bots
  if (message.author.bot) return;

  // Split the message into arguments
  const args = message.content.slice(1).split(/ +/);
  const command = args.shift().toLowerCase();

  // If the command is not recognized, do nothing
  if (!client.commands.has(command)) return;

  // Check if the message is in the correct channel and the user has the required permissions
  if (message.channel.name !== 'mr-kip' && !message.member.hasPermission('ADMINISTRATOR') && !message.member.hasPermission('MANAGE_MESSAGES') && command !== 'faq') {
    return message.reply('You can only use commands in the https://discord.com/channels/965900074532081674/1069599346670174228 channel.');
  }

  try {
    // Execute the command
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }

  // Check for event reminders every time a command is used
  upcomingEvents.forEach(event => {
    // Check if a reminder has already been sent for this event
    if (!eventRemindersSent.has(event.toString())) {
      sendEventReminder(event);
      sendEventStartReminder(event);
    }
  });
});

// Parse the list of upcoming spotlight events
const upcomingEvents = [
  [27, 10, 2023, 'MELTAN'],
  [29, 10, 2023, 'DREEPY'],
  [31, 10, 2023, 'GASTLY'],
  [31, 10, 2023, 'HOOPA'],
  [1, 11, 2023, 'GROOKEY'],
  [2, 11, 2023, 'BUNEARY'],
  [5, 11, 2023, 'PIPLUP'],
  [11, 11, 2023, 'ABSOL'],
  [16, 11, 2023, 'FIDOUGH'],
  [23, 11, 2023, 'POOCHYENA'],
  [27, 11, 2023, 'BASCULIN_WHITE_STRIPED'],
  [30, 11, 2023, 'QUAXLY'],
  [2, 12, 2023, 'CETODDLE'],
  [7, 12, 2023, 'FRIGIBAX'],
  [12, 12, 2023, 'VULPIX_ALOLAN'],
  [20, 12, 2023, 'CRYOGONAL'],
  [25, 12, 2023, 'IRON_BUNDLE'],
  [29, 12, 2023, 'VANILLITE'],
  [1, 1, 2024, 'MARSHADOW']
];

const app = express();
const port = 3000;

// Track the bot's start time
const botStartTime = new Date();

app.get('/', (req, res) => {
  const currentTime = new Date();
  const uptimeMilliseconds = currentTime - botStartTime;
  const hours = Math.floor(uptimeMilliseconds / 3600000);
  const minutes = Math.floor((uptimeMilliseconds % 3600000) / 60000);
  const seconds = Math.floor((uptimeMilliseconds % 60000) / 1000);

  const page = `
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bot Uptime</title>
    <!-- Include Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #282c34;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 100vh;
            color: #abb2bf;
        }
        .container {
            background-color: #3e4451;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            padding: 30px;
            text-align: center;
            animation: fadeIn 2s;
        }
        h1 {
            font-size: 2.5em;
            margin-bottom: 15px;
            color: #ffffff;
            font-weight: bold;
        }
        .loader-bar {
            width: 100%;
            height: 20px;
            background-color: #444;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 15px;
        }
        .progress {
            width: 0;
            height: 100%;
            background-color: #33d672;
            animation: progressAnimation 6000s linear infinite;
        }
        #uptime {
            font-size: 1.7em;
            color: #33d672;
            display: none;
        }
        .info {
            font-size: 1em;
            color: #abb2bf;
            margin-top: 5px;
        }
        code {
            background-color: #2c313a;
            padding: 3px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            color: #abb2bf;
        }
        #connecting-message {
            font-size: 1.2em;
            margin-top: 20px;
        }
        @keyframes fadeIn {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
        @keyframes progressAnimation {
            0% {
                width: 0;
            }
            100% {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <h1>Mr Kip 7.0</h1>
    <div class="container">
        <div class="loader-bar">
            <div class="progress"></div>
        </div>
        <p id="uptime">Calculating uptime...</p>
        <p class="info">Real-time status for Mr Kip</p>
        <p class="info"><u>by Aaghat</u></p>
    </div>
    <p id="connecting-message">Connecting... Please wait.</p>

    <script>
        function updateUptime() {
            const botStartTime = new Date('${botStartTime}');
            const progress = document.querySelector('.progress');
            const uptimeDisplay = document.getElementById('uptime');
            const connectingMessage = document.getElementById('connecting-message');
            const messages = [
                'Downloading Crest v2.0... Please wait.',
                'Searching for data...',
                'Establishing connection...',
                'Loading...'
            ];

            setTimeout(() => {
                const currentTime = new Date();
                const uptimeMilliseconds = currentTime - botStartTime;
                const hours = Math.floor(uptimeMilliseconds / 3600000);
                const minutes = Math.floor((uptimeMilliseconds % 3600000) / 60000);
                const seconds = Math.floor((uptimeMilliseconds % 60000) / 1000);

                if (uptimeMilliseconds >= 0) {
                    progress.style.animation = 'none';
                    progress.style.width = '100%';
                    uptimeDisplay.style.display = 'block';
                    uptimeDisplay.innerText = hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds';
                }
            }, 6000000);

            let i = 0;
            setInterval(() => {
                connectingMessage.innerText = messages[i];
                i = (i + 1) % messages.length;
            }, 8000);
        }

        updateUptime();
    </script>
</body>
</html>

  `;

  res.send(page);
});

app.listen(port, () => {
  console.log(`Mr Kip, listening at http://localhost:${port}`);
});
