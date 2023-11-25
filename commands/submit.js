const Discord = require('discord.js');
const fs = require('fs');

let eventChannel = null; // Variable to store the event channel

module.exports = {
  name: 'submit',
  description: 'Submit a .sav file for review.',
  async execute(message) {
    const attachment = message.attachments.first();
    if (!attachment || !attachment.name.endsWith('.sav')) {
      return message.channel.send('Please attach a .sav file.');
    }

    // Check if the eventChannel is already defined
    if (!eventChannel) {
      try {
        // Fetch the channel if it exists
        const guild = message.guild;
        const fetchedChannel = await guild.channels.cache.find(
          channel => channel.name === 'file-submissions' && channel.type === 'text'
        );

        if (fetchedChannel) {
          eventChannel = fetchedChannel;
        } else {
          // Create the event channel if it doesn't exist
          const newChannel = await guild.channels.create('file-submissions', {
            type: 'text',
            permissionOverwrites: [
              {
                id: guild.id,
                deny: ['VIEW_CHANNEL'], // Deny everyone from viewing the channel
              },
              {
                id: message.guild.me, // Allow the bot to see the channel
                allow: ['VIEW_CHANNEL'],
              },
              {
                id: message.guild.roles.cache.find(role => role.permissions.has('MANAGE_CHANNELS')), // Check for role with manage channels permission
                allow: ['VIEW_CHANNEL'], // Allow role with manage channels permission to view the channel
              },
            ],
          });
          eventChannel = newChannel;
        }
      } catch (err) {
        console.error('Error handling channel:', err);
        return message.channel.send('An error occurred while handling the channel.');
      }
    }

    // Call function to handle submission details
    updateSubmissionDetails(message.author.tag, attachment.name);

    sendFileAndDetails(message);
  },
};

// Function to update the JSON file with submission details
function updateSubmissionDetails(username, fileName) {
  const submission = {
    username: username,
    fileName: fileName,
    status: 'review_pending'
  };

  // Read existing data from the file or create an empty array
  let submissions = [];
  try {
    const data = fs.readFileSync('submissionDetails.json', 'utf8');
    submissions = JSON.parse(data);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error reading file:', err);
    }
  }

  // Add the new submission to the submissions array
  submissions.push(submission);

  // Write the updated data back to the file
  fs.writeFile('submissionDetails.json', JSON.stringify(submissions, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
    }
  });
}

function sendFileAndDetails(message) {
  const user = message.author;
  const userInfo = `Submitted by: ${user} (${user.tag})`;

  const submissionInfoEmbed = new Discord.MessageEmbed()
    .setColor('#5bc0de')
    .setTitle(':page_facing_up: New Applicant')
    .setDescription('A new file has been submitted for review.')
    .addField(':busts_in_silhouette: User', userInfo)
    .addField(':file_folder: Details', `Name: ${message.attachments.first().name}`)
    .setThumbnail(user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
    .setTimestamp();

  const fileAttachment = new Discord.MessageAttachment(message.attachments.first().url);
  eventChannel.send(submissionInfoEmbed);
  eventChannel.send({ embeds: [submissionInfoEmbed], files: [fileAttachment] })
    .then(() => {
      message.channel.send('File submitted for review ✅. Please wait for further instructions.\n\nWhat do I do now? \nWait for a moderator to validate your savefile\n\nGood luck!');
    })
    .catch(err => {
      console.error('Error sending message:', err);
      message.channel.send('An error occurred while submitting the file.');
    });
}
