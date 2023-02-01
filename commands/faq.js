const Discord = require('discord.js');

const faqs = [
    { number: 1, question: "How do I patch?", answer: "https://topsecretlabs.blogspot.com/p/how-to-patch.html" },
    { number: 2, question: "Pokemon keep 'getting away' when I use the Dexnav?", answer: "Hold 'a' while walking." },
    { number: 3, question: "How do I evolve trade Evolutions?", answer: "A man in Devoncorp will trade your pokemon and trade it back." },
    { number: 4, question: "How do I use Mega Pokemon?", answer: "Get the Mega Ring from your PC at home. Give a Mega Stone to a pokemon. In battle press 'Fight' then press start, then pick your move." },
    { number: 5, question: "How do I use Z moves?", answer: "Get the Z Ring from your father. Give a Z Crystal to a pokemon. In battle press 'Fight' then press start, then pick your move." },
    { number: 6, question: "Where is X Pokemon?", answer: "The original download for the game includes a Wild Encounters document." },
    { number: 7, question: "How do I get Ph.D Pikachu?", answer: "Open your PC at home, select Version 1.0.X. The pokemon will then be placed either into your party or in the PC storage." },
    { number: 8, question: "How do I use Mystery Gift?", answer: "Take the escalator in a Pokemon Center and talk to the man on the left. Save beforehand to prevent issues. Make sure you type the code correctly, double check I's, 0's and L's for upper/lowercase." },
    { number: 9, question: "Where do I get the EXP share/all?", answer: "Complete the task Mr. Stone asked of you (deliver letter to Steven), then return and talk to him." },
    { number: 10, question: "How do I Wonder Trade?", answer: "Beat Brawly then go to your PC at home. This will trade your pokemon away for another of the same level." },
    { number: 11, question: "What are Hidden Pokemon?", answer: "Hidden pokemon are on the bottom of the Dexnav and will only appear once you have activated the fuction by talking to a scientist in Devoncorp. After that you can encounter extra pokemon after having already seen them before. They also have a chance to appear through a special detection feature after making 100 steps and not encountering any pokemon." },
    { number: 12, question: "How do I shiny hunt?", answer: "It is best to preform a 'chain'. This means encountering a Dexnav pokemon and either capture or defeat it. Each pokemon will increase your shiny percentage chance as long as the chain is not broken." }
  ];
  

module.exports = {
  name: 'faq',
  description: 'Displays frequently asked questions (FAQs). You can also use the command to view an individual FAQ by providing its number (e.g. !faq 1).',
  usage: '[FAQ number (optional)]',
    execute(message, args) {
    if (args.length === 0) {
      const embed = new Discord.MessageEmbed()
        .setTitle("FAQs");

      faqs.forEach(faq => {
        embed.addField(`${faq.number}. ${faq.question}`, faq.answer);
      });

      message.channel.send(embed);
    } else {
      const faqNumber = parseInt(args[0]);
      const faq = faqs.find(f => f.number === faqNumber);

      if (!faq) {
        message.channel.send("Not found. Type !faq for a list of all FAQs or you could check in #faq.");
      } else {
        const embed = new Discord.MessageEmbed()
          .setColor('#fff00')
          .setTitle(`FAQ ${faq.number}`)
          .addField(faq.question, faq.answer)
          .setFooter("Mr Kip v1.0.0 by Aaghat");

        message.channel.send(embed);
      }
    }
  },
};
