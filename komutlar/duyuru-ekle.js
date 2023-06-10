const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const db = require("croxydb")

module.exports = {
  slash: true,                                
  cooldown: 5,                              

    data: new SlashCommandBuilder()         
      .setName('duyuru-ekle')
      .setDescription('Sisteme bir duyuru ekler.')
      .setDMPermission(false)
      .addStringOption(option =>
        option
          .setName('duyuru')
          .setDescription('Eklenecek duyuruyu belirtin.')
          .setRequired(true)),
      
    async execute(client, interaction) {  
      
      const YetkiYok = new EmbedBuilder()
        .setDescription(`**<:carpi:1117083838590492772> Bu komutu kullanabilmek için \`Bot sahibi\` olmalısın.**`)
        .setColor('Red')
        .setTitle("Olamaz yetkin yok")
      
      if(interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "990186530767249419" && interaction.user.id !== "924369071070404668"){
      return interaction.reply({embeds: [YetkiYok]})
      }
      
      const duyuru = interaction.options.getString('duyuru')
        
      const Embed = new EmbedBuilder()
        .setTitle(`Duyuru eklendi`)
        .setDescription(`**<:tik:1117083842264703016> \`${duyuru}\` adlı duyuru sisteme eklendi.**`)
        .setColor("Green")
      interaction.reply({embeds: [Embed]})
       
      db.push(`Duyurular`, `${duyuru}`)
     
  }
}