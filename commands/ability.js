// Importing necessary modules
const Discord = require("discord.js"); // Importing the Discord.js library
const axios = require("axios"); // Importing the Axios library for making HTTP requests

// Exporting an object with properties and methods related to the ability command
module.exports = {
  name: "ability", // The name of the command
  description: "Retrieves information about a specific Pokémon's ability", // Description of what the command does
  Usage: "<pokemon_name>/<number>", // How the command should be used

  // Function that executes when the command is called
  execute: async function (message, args) {
    const pokemon = args[0]; // Extracting the first argument (pokemon name/number) from the message

    try {
      // Making a GET request to the PokeAPI to get information about the specified Pokémon
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon}`
      );
      const data = response.data; // Extracting the response data

      const name = data.name; // Extracting the name of the Pokémon
      // Extracting the abilities of the Pokémon and joining them into a comma-separated string
      const abilities = data.abilities
        .map((ability) => ability.ability.name)
        .join(", ");

      // Sending a message with the Pokémon's name and abilities to the Discord channel
      message.channel.send(`${name} has the abilities: ${abilities}`);
    } catch (error) {
      console.error(error); // Logging the error to the console
      // Sending an error message to the Discord channel if there was an error
      message.reply(
        "```Sorry, there was an error trying to get that Pokémon.```"
      );
    }
  },
};
