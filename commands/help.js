const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Lists all commands and their details',
    execute(message, args) {
        let commands = message.client.commands.array();

        if (!args.length) {
            const embed = new Discord.MessageEmbed()
            .setTitle('Help Menu')
            .setColor(0x00AE86)
            .setDescription(`Here's a list of all the commands available for this bot:`)
            .setFooter(`Mr Kip v1.0.0 by Aaghat`);

            // List all commands without details
            commands.forEach(command => {
                embed.addField(command.name, command.description);
            });

            return message.channel.send(embed);
        } else {
            // Get the requested command
            const name = args[0].toLowerCase();
            const command = commands.find(c => c.name === name || c.aliases && c.aliases.includes(name));

            if (!command) {
                return message.reply("That's not a valid command!");
            }

            // Show details for the requested command
            const embed = new Discord.MessageEmbed()
                .setTitle(`Details for command '${command.name}'`)
                .setColor(0x00AE86)
                .addField("Description", command.description)
                .addField("Usage", `\`!${command.name} ${command.usage}\``);

            if (command.aliases) {
                embed.addField("Aliases", `\`${command.aliases.join("\`, \`")}\``);
            }

            message.channel.send(embed);
        }
    },
};
