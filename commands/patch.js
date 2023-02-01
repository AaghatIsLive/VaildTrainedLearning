const Discord = require("discord.js");

module.exports = {
  name: "patch",
  description: "Provides instructions for patching Pokemon Emerald Crest.",
  usage: "[language code(Optional)], eg: !patch pt or !patch m or !patch mpt",
  execute(message, args) {
    let embed = new Discord.MessageEmbed()
      .setTitle("How to Patch")
      .addField("PC", "• Download the Pokemon Emerald Crest patch file from #release \n\n• Extract the downloaded file using a program such as WinRAR https://www.win-rar.com/download.html\n\n• Download the original Pokemon Emerald ROM, if you do not already have it.\n\n• Go to https://www.marcrobledo.com/RomPatcher.js/\n\n• In the 'Rom' section, select the original Pokemon Emerald ROM.\n\n• In the 'Patch' section, select the extracted Emerald Crest patch file.\n\n> NOTE: The patch file should end with .bps or .ups after extraction. If it doesn't, you may have missed a step. Also, after patching the game should end with .gba, if it ends with .txt, then just remove .txt by renaming the file.\n\n• Click on 'Apply Patch' and the process is complete. Enjoy the game! :grinning:")
      .setColor("#FF0000");
      
    if (args[0] === "pt") {
      embed = new Discord.MessageEmbed()
        .setTitle("Como Parchear")
        .addField("PC", "• Baixe o arquivo de patch Pokemon Emerald Crest do canal #release \n\n• Extraia o arquivo baixado usando um programa como o WinRAR https://www.win-rar.com/download.html\n\n• Baixe a ROM original do Pokemon Emerald, se você ainda não a tiver.\n\n• Vá para https://www.marcrobledo.com/RomPatcher.js/\n\n• Na seção 'Rom', selecione a ROM original do Pokemon Emerald.\n\n• Na seção 'Patch', selecione o arquivo de patch Emerald Crest extraído.\n\n> NOTA: O arquivo de patch deve terminar com .bps ou .ups após a extração. Se não terminar, você pode ter perdido um passo. Além disso, após o parcheamento, o jogo deve terminar com .gba, se terminar com .txt, basta remover o .txt renomeando o arquivo.\n\n• Clique em 'Apply Patch' e o processo estará completo. Aproveite o jogo! :grinning:")
        .setColor("#FF0000");
    }

    if (args[0] === "m") {
        embed = new Discord.MessageEmbed()
          .setTitle("How to Patch")
          .addField("Android/IOS", `• Download Pokemon Emerald Crest patch file from #release\n\n• Extract the file you downloaded for Android use zArchiver to extract it (you can download it from the Play store) and for IOS you can use WinZip (you can download it from the App store)\n\n• Download the Original Emerald rom (if you don\'t have it already)\n\n• Goto https://www.marcrobledo.com/RomPatcher.js/\n\n• Choose the original emerald rom in the "Rom" section and choose the extracted Emerald Crest file in the "Patch" section.\n\n• Click on "Apply Patch" and you\'re done :white_check_mark: enjoy the game :slight_smile:`)
          .setColor("#FF0000");
      }
    
      if (args[0] === "mpt") {
        embed = new Discord.MessageEmbed()
          .setTitle("Como Parchear")
          .addField("Android/IOS", `• Baixe o arquivo de patch Pokemon Emerald Crest de #release\n\n• Extraia o arquivo baixado para Android usando o zArchiver (você pode baixá-lo na Play store) e para IOS você pode usar o WinZip (você pode baixá-lo na App store)\n\n• Baixe a ROM original do Emerald (se você ainda não tiver)\n\n• Vá para https://www.marcrobledo.com/RomPatcher.js/\n\n• Escolha a ROM original de Emerald na seção "Rom" e escolha o arquivo de patch Emerald Crest extraído na seção "Patch".\n\n• Clique em "Aplicar Patch" e você está pronto :white_check_mark: aproveite o jogo :slight_smile:`)          
          .setColor("#FF0000");
      }
    message.channel.send(embed);
  },
};
