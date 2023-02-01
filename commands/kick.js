const Discord = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kick a member from the server',
    execute(message, args) {
      const user = message.mentions.users.first();
      if (!user) return message.reply('You need to mention a user to kick them!');
  
      const member = message.guild.member(user);
      if (!member) return message.reply("This user isn't in this server");
  
      if (!message.member.hasPermission('KICK_MEMBERS'))
        return message.reply('You don\'t have permission to kick members!');
  
      const reason = args.slice(1).join(' ') || 'No reason provided';
      
      try {
        member.send(`You were kicked from ${message.guild.name} for: ${reason}`);
      } catch (err) {
        console.error(`Could not send direct message to ${user.tag}:`, err);
      }
      const kickedEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle(`${user.tag} has been kicked`)
      .addFields(
        { name: 'Reason', value: reason },
        { name: 'Kicked by', value: message.author.tag },
      )
      .setTimestamp();
    
    message.channel.send(kickedEmbed);
    
      member
        .kick(reason)
        .then(() => message.reply(`Successfully kicked ${user.tag} for: ${reason}`))
        .catch(err => message.reply('I was unable to kick the member'));
    },
  };