const Discord = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  name: 'version',
  description: 'Gets the latest version of the game',
  execute(message, args) {
    // Send an HTTP GET request to the specified website
    axios.get('https://romhackstudios.github.io').then((response) => {
      // Extract the HTML content from the response
      const html = response.data;
      const $ = cheerio.load(html);

      // Find and extract the latest and early access versions
      const latestVersion = $('.btn-purple').first().text();
      const earlyAccessVersion = $('.btn-blue').text();

      // Extract image URLs (two options for variety)
      const imageUrl1 = $('meta[property="og:image"]').attr('content');
      const imageUrl2 = 'https://romhackstudios.github.io/pages/v1.0.8.7.EA.png';

      // Choose a random image URL
      const imageUrl = Math.random() < 0.5 ? imageUrl1 : imageUrl2;

      // Check if both versions were successfully retrieved
      if (latestVersion && earlyAccessVersion) {
        // Create a Discord Embed to display the version information
        const embed = new Discord.MessageEmbed()
          .setTitle('Emerald Crest')
          .setDescription('Download the latest version of the game.')
          .addField('Version', `[**${latestVersion}**](https://romhackstudios.github.io/)`, true)
          .addField('Early Access', `[**${earlyAccessVersion}**](https://romhackstudios.github.io/pages/early-access.html)`, true)
          .setImage(imageUrl)
          .setFooter(`Requested by ${message.author.username}`)
          .setTimestamp();

        // Send the embed message to the channel
        message.channel.send(embed);
      } else {
        // Notify if the versions couldn't be retrieved
        message.channel.send('Failed to retrieve the latest versions.');
      }
    }).catch((error) => {
      // Handle any errors that occur during the HTTP request
      console.error(error);
      message.channel.send('An error occurred while fetching the latest versions.');
    });
  },
};
