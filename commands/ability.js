const Discord = require("discord.js");
const axios = require('axios');

module.exports = {
    name: 'ability',
    description: 'Retrieves information about a specific Pokémons ability',
    Usage: '<pokemon_name>/<number>',
    execute: async function(message, args) {
        const pokemon = args[0];
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
            const data = response.data;
            const name = data.name;
            const abilities = data.abilities.map(ability => ability.ability.name).join(', ');
            message.channel.send(`${name} has the abilities: ${abilities}`);
        } catch (error) {
            console.error(error);
            message.reply('Sorry, there was an error trying to get that Pokémon.');
        }
    }
};
