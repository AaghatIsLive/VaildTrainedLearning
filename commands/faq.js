const Discord = require("discord.js");

const faqs = [
  {
    number: 1,
    question: "How do I patch?",
    answer: "https://romhackstudios.github.io/pages/howtopatch.html",
  },
  {
    number: 2,
    question: "Pokemon keep 'getting away' when I use the Dexnav?",
    answer: "Hold 'a' while walking.",
  },
  {
    number: 3,
    question: "How do I evolve trade Evolutions?",
    answer: "A man in Devoncorp will trade your pokemon and trade it back.",
  },
  {
    number: 4,
    question: "How do I use Mega Pokemon?",
    answer:
      "Get the Mega Ring from your PC at home. Give a Mega Stone to a pokemon. In battle press 'Fight' then press start, then pick your move.",
  },
  {
    number: 5,
    question: "How do I use Z moves?",
    answer:
      "Get the Z Ring from your father. Give a Z Crystal to a pokemon. In battle press 'Fight' then press start, then pick your move.",
  },
  {
    number: 6,
    question: "Where is X Pokemon?",
    answer:
      "The original download for the game includes a Wild Encounters document.",
  },
  {
    number: 7,
    question: "How do I get Ph.D. Pikachu?",
    answer:
      "Open your PC at home, select Version 1.0.X. The pokemon will then be placed either into your party or in the PC storage.",
  },
  {
    number: 8,
    question: "How do I use Mystery Gift?",
    answer:
      "Take the escalator in a Pokemon Center and talk to the man on the left. Save beforehand to prevent issues. Make sure you type the code correctly, double check I's, 0's, and L's for upper/lowercase. This man is only available from Petalburg City onwards.",
  },
  {
    number: 9,
    question: "Where do I get the EXP share/all?",
    answer:
      "Complete the task Mr. Stone asked of you (deliver the letter to Steven), then return and talk to him.",
  },
  {
    number: 10,
    question: "How do I Wonder Trade?",
    answer:
      "Beat Brawly then go to your PC at home. This will trade your pokemon away for another of the same level.",
  },
  {
    number: 11,
    question: "What are Hidden Pokemon?",
    answer:
      "Hidden pokemon are on the bottom of the Dexnav and will only appear once you have activated the function by talking to a scientist in Devoncorp. After that, you can encounter extra pokemon after having already seen them before. They also have a chance to appear through a special detection feature after making 100 steps and not encountering any pokemon.",
  },
  {
    number: 12,
    question: "How do I shiny hunt?",
    answer:
      "It is best to perform a 'chain'. This means encountering a Dexnav pokemon and either capturing or defeating it. Each pokemon will increase your shiny percentage chance as long as the chain is not broken.",
  },
  {
    number: 13,
    question: "How do I switch bikes?",
    answer:
      "While riding your bike press the L button on your screen or the button you have binded to it.",
  },
  {
    number: 14,
    question: "How do I save?",
    answer: "Open your menu and press left or right on the D-Pad.",
  },
  {
    number: 15,
    question: "Where's the rare candy code?",
    answer:
      "The rare candy code can be found on the gamecube at your house in Littleroot.",
  },
];

module.exports = {
  name: "faq", // The name of the command
  description:
    "Displays frequently asked questions (FAQs). You can also use the command to view an individual FAQ by providing its number or keyword (e.g. !faq 1 or !faq keyword).", // Description of what the command does
  usage: "[FAQ number or keyword (optional)]", // How the command should be used

  // Function that executes when the command is called
  execute(message, args) {
    if (args.length === 0) {
      // If no argument provided, display a list of all FAQs
      const embed = new Discord.MessageEmbed().setTitle("FAQs");

      // Loop through FAQs and add them as fields in the embed
      faqs.forEach((faq) => {
        embed.addField(`${faq.number}. ${faq.question}`, faq.answer);
      });

      message.channel.send(embed); // Send the embed message
    } else {
      const arg = args[0];
      const faqNumber = parseInt(arg);

      // Find the FAQ based on provided number or keyword
      const faq = faqs.find(
        (f) =>
          f.number === faqNumber ||
          f.question.toLowerCase().includes(arg.toLowerCase())
      );

      if (!faq) {
        // If FAQ not found, provide instructions on how to view FAQs
        message.channel.send(
          "Not found. Type !faq for a list of all FAQs or you could check in #faq."
        );
      } else {
        // If FAQ found, create and send an embed with the FAQ details
        const embed = new Discord.MessageEmbed()
          .setColor("#fff00")
          .setTitle(`FAQ ${faq.number}`)
          .addField(faq.question, faq.answer)
          .setFooter("Mr Kip v7.0 by Aaghat");

        message.channel.send(embed); // Send the embed message

        if (faq.number === 14) {
          // Provide additional content for specific FAQ numbers
          message.channel.send(
            "[How to save by @shenaniganz86 Aka: Emperor of Hell Dorado](https://cdn.discordapp.com/attachments/998495706044178522/1166344735514951680/Recorder_24102023_075418.mp4?ex=654a262e&is=6537b12e&hm=745822ab5f52165e11129f00&)"
          );
        } else if (faq.number === 13) {
          message.channel.send(
            "[How to switch bikes? by @shenaniganz86 Aka: Emperor of Hell Dorado](https://cdn.discordapp.com/attachments/998495706044178522/1166418631064834098/Recorder_24102023_124659.mp4?ex=654a6b00&is=6537f600&hm=14ed693f9de483e26bbb824659ecfeae5bf9a9daf1618001693c552a17ec21bc&)"
          );
        } else if (faq.number === 15) {
          message.channel.send(
            "[Rare Candy Code! by @shenaniganz86 Aka: Emperor of Hell Dorado](https://cdn.discordapp.com/attachments/998495706044178522/1166415404919427272/Recorder_24102023_123551.mp4?ex=654a67ff&is=6537f2ff&hm=fd52b2d790930d2e85f55e9c055f3f76bebc986536900c88915ee3d7bcaac4ec&)"
          );
        }
      }
    }
  },
};
