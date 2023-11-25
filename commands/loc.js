const axios = require('axios'); // Importing the Axios library for making HTTP requests
const Discord = require('discord.js'); // Importing the Discord.js library
const jsonData = require('../wild.json'); // Importing the JSON data containing Pokémon encounters

// Command to get the location of a Pokémon
module.exports = {
  name: 'loc', // The name of the command
  description: 'Get the location of a Pokémon', // Description of what the command does

  // Async function that executes when the command is called
  async execute(message, args) {
    // Check if a Pokémon name is provided
    if (!args.length) {
      return message.reply('Please provide a Pokémon name.'); // Handle case where no Pokémon name is provided
    }

    const pokemonName = args[0].toLowerCase(); // Convert the provided Pokémon name to lowercase

    // Find all encounters for the given Pokémon
    const encounters = jsonData.wild_encounter_groups[0].encounters.filter(encounter => {
      const environments = [];

      // Check if the Pokémon is found in different encounter types (land, water, etc.)
      if (encounter.land_mons?.mons.some(pokemon => pokemon.species.toLowerCase().replace('species_', '') === pokemonName)) {
        environments.push('Land');
      }
      if (encounter.water_mons?.mons.some(pokemon => pokemon.species.toLowerCase().replace('species_', '') === pokemonName)) {
        environments.push('Water');
      }
      if (encounter.rock_smash_mons?.mons.some(pokemon => pokemon.species.toLowerCase().replace('species_', '') === pokemonName)) {
        environments.push('Rock Smash');
      }
      if (encounter.fishing_mons?.mons.some(pokemon => pokemon.species.toLowerCase().replace('species_', '') === pokemonName)) {
        environments.push('Fishing');
      }
      if (encounter.hidden_mons?.mons.some(pokemon => pokemon.species.toLowerCase().replace('species_', '') === pokemonName)) {
        environments.push('Hidden');
      }

      encounter.environments = environments; // Add environments to the encounter object
      return environments.length > 0; // Return encounters with at least one environment
    });

    // If Pokémon encounters are found, send the locations and other details
    if (encounters.length > 0) {
      const pokemonData = encounters.map(encounter => {
        const location = encounter.base_label.replace('g', ''); // Get the location label
        const baseLabel = encounter.base_label;
        const pokemon = encounter.land_mons?.mons.find(pokemon =>
          pokemon.species.toLowerCase().replace('species_', '') === pokemonName
        ) || encounter.water_mons?.mons.find(pokemon =>
          pokemon.species.toLowerCase().replace('species_', '') === pokemonName
        ) || encounter.rock_smash_mons?.mons.find(pokemon =>
          pokemon.species.toLowerCase().replace('species_', '') === pokemonName
        ) || encounter.fishing_mons?.mons.find(pokemon =>
          pokemon.species.toLowerCase().replace('species_', '') === pokemonName
        ) || encounter.hidden_mons?.mons.find(pokemon =>
          pokemon.species.toLowerCase().replace('species_', '') === pokemonName
        ); // Get the specific Pokémon details

        const minLevel = pokemon.min_level; // Get the minimum level
        const maxLevel = pokemon.max_level; // Get the maximum level
        const environments = encounter.environments; // Get the environments where the Pokémon can be found

        return {
          location,
          baseLabel,
          minLevel,
          maxLevel,
          environments,
        };
      });

      // Fetch the Pokémon details from the PokéAPI
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`); // Make a request to the PokéAPI
        const pokemonImageURL = response.data.sprites.front_default; // Get the URL for the Pokémon image

        const embed = new Discord.MessageEmbed() // Create a Discord embed message
          .setTitle(`${pokemonName.toUpperCase()}`) // Set the title of the embed
          .setDescription(`**${pokemonName}** can be found in the following locations:`); // Set the description

        pokemonData.forEach(pokemon => {
          embed.addField(
            `Location: ${pokemon.location}`, // Add location information to the embed
            `Level Range: ${pokemon.minLevel || 'Unknown'} - ${pokemon.maxLevel || 'Unknown'}\nEnvironment: ${pokemon.environments.join(', ')}` // Add level range and environments to the embed
          );
        });
        embed.setDescription('[Download Encounter Doc](<https://cdn.discordapp.com/attachments/1040638131646500864/1168065193390120970/WildEncounters.txt?ex=6550687b&is=653df37b&hm=f06ffa534cf4989d07ae86def0fc6b0c726a2a3e4f372c9981bf9102b16577c4&>)') // Add a link to download encounter document

        embed.setThumbnail(pokemonImageURL) // Set the thumbnail image of the Pokémon
        embed.setFooter('Mr. Kip v7.0 by Aaghat'); // Add a footer to the embed

        return message.channel.send(embed); // Send the embed message
      } catch (error) {
        console.error('Error fetching Pokémon details:', error); // Log an error if there's an issue fetching Pokémon details
        return message.reply(`Failed to fetch details for Pokémon "${pokemonName}".`); // Notify about the failure
      }
    }

    // If Pokémon is not found, send an error message
    return message.reply("```Pokemon not found in game data```"); // Notify that the Pokémon is not found
  },
};
