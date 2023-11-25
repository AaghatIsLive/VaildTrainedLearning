const fs = require('fs');
const Discord = require('discord.js');
const { parse } = require('pkparse');

module.exports = {
  name: 'trade',
  description: 'Initiate a trade with another player.',
  usage: '@player',

  async execute(message, args) {
    const user = message.mentions.users.first();

    if (!user) {
      return message.reply('please mention a user to trade with.');
    }

    const threadName = `Trade between ${message.author.username} and ${user.username}`;
    const tradeThread = await message.channel.threads.create({
      name: threadName,
      autoArchiveDuration: 60, // The thread will be archived after 1 hour of inactivity
    });

    // Create the embed for the trade message
    const tradeEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Trade Request`)
      .setDescription(`You have received a trade request from ${message.author.username}.`)
      .setThumbnail(message.author.displayAvatarURL({ format: 'png' }))
      .addField('Status', 'Waiting for your response...')
      .addField('Instructions', 'Please react to this message with ✅ or ❌ to accept or decline the trade request.');

    const tradeMessage = await tradeThread.send({
      content: `<@${user.id}>`,
      embeds: [tradeEmbed],
    });

    await tradeMessage.react('✅');
    await tradeMessage.react('❌');

    const filter = (reaction, user) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === user.id;
    const reactionCollector = tradeMessage.createReactionCollector(filter, { max: 1 });

    reactionCollector.on('end', async (collected) => {
      if (collected.size === 0 || collected.first().emoji.name === '❌') {
        // Update the embed to show that the trade has been declined
        tradeEmbed.setColor('#ff0000');
        tradeEmbed.fields[0].value = `Trade declined by ${user.username}.`;
        tradeMessage.edit({ embeds: [tradeEmbed] });

        await tradeThread.send(`${user.username} declined the trade.`);
      } else {
        // Update the embed to show that the trade has been accepted
        tradeEmbed.setColor('#00ff00');
        tradeEmbed.fields[0].value = `Trade accepted by ${user.username}.`;
        tradeMessage.edit({ embeds: [tradeEmbed] });

        // Ask each player to upload their save file in the thread
        const saveFileMessage = await tradeThread.send(`<@${message.author.id}>, please upload your save file.`);
        const saveFileCollector1 = tradeThread.createMessageCollector((msg) => msg.author.id === message.author.id && msg.attachments.size > 0, { max: 1 });

        const savemsg = await tradeThread.send(`<@${user.id}>, please upload your save file.`);
        const saveFileCollector2 = tradeThread.createMessageCollector((msg) => msg.author.id === user.id && msg.attachments.size > 0, { max: 1 });

        // Once both players have uploaded their save files, parse them and update the thread with the trade results
        Promise.all([saveFileCollector1, saveFileCollector2]).then(async (collected) => {
          const player1Attachment = collected[0].first().attachments.first();
          const player2Attachment = collected[1].first().attachments.first();
                const player1SaveData = await parse(player1Attachment.url);
      const player2SaveData = await parse(player2Attachment.url);

      // Do the actual trade logic here
      // ...

      // Once the trade is complete, update the thread with the results
      const tradeResultEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Trade Results`)
        .setDescription(`Trade between ${message.author.username} and ${user.username} is complete!`)
        .addField(`${message.author.username}'s New Items`, '...')
        .addField(`${user.username}'s New Items`, '...')
        .setTimestamp();

      await tradeThread.send({
        content: `<@${message.author.id}> <@${user.id}>`,
        embeds: [tradeResultEmbed],
      });
    });
  }
});
},
};