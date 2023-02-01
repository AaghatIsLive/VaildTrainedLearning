const Discord = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Ban a member from the server',
    execute(message, args) {
      const user = message.mentions.users.first();
      if (!user) return message.reply('You need to mention a user to ban them!');
  
      const member = message.guild.member(user);
      if (!member) return message.reply("This user isn't in this server");
  
      if (!message.member.hasPermission('BAN_MEMBERS'))
        return message.reply('You don\'t have permission to ban members!');
  
      const reason = args.slice(1).join(' ') || 'No reason provided';
      try {
        member.send(`You were banned from ${message.guild.name} for: ${reason}`);
      } catch (err) {
        console.error(`Could not send direct message to ${user.tag}:`, err);
      }
  
      member
        .ban({ reason })
        .then(() => message.reply(`Successfully banned ${user.tag} for: ${reason}`))
        .catch(err => message.reply('I was unable to ban the member'));
    },
  };