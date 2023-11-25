const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'review',
  description: 'Review a submitted file for a user.',
  async execute(message, args) {
    // Check if the user has necessary permissions
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      return message.channel.send('You do not have permission to use this command.');
    }

    // Check for proper command usage
    if (args.length < 2) {
      return message.channel.send('Usage: !review [@user] [accepted/rejected] [reason (optional)]');
    }

    const mentionedUser = message.mentions.users.first(); // Mentioned user
    const reviewStatus = args[1].toLowerCase(); // Review status (accepted or rejected)
    const reason = args.slice(2).join(' '); // Reason for rejection

    if (!mentionedUser) {
      return message.channel.send('Please mention a user.');
    }

    const username = mentionedUser.tag; // Username to search for

    // Read existing submissions from the file
    let submissions = [];
    try {
      const data = fs.readFileSync('submissionDetails.json', 'utf8');
      submissions = JSON.parse(data);
    } catch (err) {
      return message.channel.send('Error reading submission details.');
    }

    // Find the submission with the provided username
    const submissionIndex = submissions.findIndex(sub => sub.username === username);

    if (submissionIndex === -1) {
      return message.channel.send('Submission not found for the specified user.');
    }

    // Update the review status
    if (reviewStatus === 'accepted') {
      submissions[submissionIndex].status = 'accepted';
      try {
        // Send DM to the mentioned user
        const userDM = await mentionedUser.send('Your submission for the showdown tournament has been accepted! 🎉\nReminder that the tournament will start in 2 weeks, so be ready for that day!\n\nGood luck! 😄');
        message.channel.send(`Review status updated to ${reviewStatus} for ${mentionedUser}'s submission.`);
      } catch (err) {
        console.error('Error sending DM:', err);
        message.channel.send('Failed to send DM to the user.');
      }
    } else if (reviewStatus === 'rejected') {
      submissions[submissionIndex].status = 'rejected';
      try {
        // Send DM to the mentioned user with rejection reason
        const userDM = await mentionedUser.send(`Your submission for the showdown tournament has been rejected.\nReason: ${reason || 'No reason provided'}`);
        message.channel.send(`Review status updated to ${reviewStatus} for ${mentionedUser}'s submission.`);
      } catch (err) {
        console.error('Error sending DM:', err);
        message.channel.send('Failed to send DM to the user.');
      }
    } else {
      return message.channel.send('Invalid review status. Please use "accepted" or "rejected".');
    }

    // Write the updated data back to the file
    fs.writeFile('submissionDetails.json', JSON.stringify(submissions, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return message.channel.send('Error updating review status.');
      }
    });
  },
};
