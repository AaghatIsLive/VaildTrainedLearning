const Discord = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "shiny",
  description: "Shows the shiny form of the given Pokémon.",
  async execute(message, args) {
    // Store the message object in a variable for convenience
    const msg = message;

    // Get the Pokémon name from the command arguments
    const pokemonName = args[0].toLowerCase();

    try {
      // Fetch Pokémon data from the PokeAPI
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const pokemonData = response.data;

      // Get the sprite URL for the shiny form
      const shinySpriteUrl = pokemonData.sprites.front_shiny;

      // Create a new Discord Embed with the Pokémon name as title and the shiny sprite as image
      const embed = new Discord.MessageEmbed()
        .setTitle(args[0])
        .setImage(shinySpriteUrl)
        .setTimestamp();

      // Send the embed message to the channel
      msg.channel.send(embed);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
      msg.channel.send("Error fetching Pokémon data. Please check the Pokémon name and try again.");
    }
  },
};
