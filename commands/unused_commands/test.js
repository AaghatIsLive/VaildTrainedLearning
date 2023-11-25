const Discord = require('discord.js');
console.log(require.resolve('natural'));
const natural = require('natural');

// Create a tokenizer to split the search query into individual words
const tokenizer = new natural.WordTokenizer();

module.exports = {
    name: 'search',
    description: 'Searches the server for messages containing a specified keyword',
    execute(message, args) {
        // Get the search query from the message content
        const query = message.content.slice(args[0].length + 1);

        // Tokenize the search query into individual words
        const tokens = tokenizer.tokenize(query);

        // Remove stop words (common words that don't provide much meaning)
        const stopWords = new Set(natural.stopwords);
        const keywords = tokens.filter(token => !stopWords.has(token.toLowerCase()));

        // Search for messages containing the keywords in the server
        const matches = message.guild.channels.cache
            .filter(channel => channel.type === 'text')
            .map(channel => message.channel.messages.fetch({ limit: 100 }))
            .flat()
            .filter(msg => {
                // Check if the message contains any of the keywords
                const content = message.content.toLowerCase();
                return keywords.some(keyword => content.includes(keyword.toLowerCase()));
            })
            .sort((a, b) => b.createdTimestamp - a.createdTimestamp);

        // Send the search result as an embed
        if (matches.size > 0) {
            const result = matches.first();

            const embed = new Discord.MessageEmbed()
                .setTitle(`Search results for "${query}"`)
                .setDescription(`Found ${matches.size} messages containing the keyword(s)`)
                .addField('Message Content', result.content)
                .addField('Channel', `<#${result.channel.id}>`)
                .addField('Author', `<@${result.author.id}>`)
                .addField('Date', result.createdAt.toLocaleString());

            // Get 5 messages after the result
            const afterMatches = matches.filter(msg => msg.createdTimestamp > result.createdTimestamp)
                .array().slice(0, 5);

            if (afterMatches.length > 0) {
                const messages = afterMatches.map(msg => {
                    return `\`${msg.createdAt.toLocaleString()}\` **${msg.author.tag}:** ${msg.content}`;
                }).join('\n');
                embed.addField(`5 messages after "${query}"`, messages);
            }

            message.channel.send(embed);
        } else {
            message.channel.send(`No messages found containing "${query}"`);
        }
    },
};
