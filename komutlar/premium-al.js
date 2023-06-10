const Discord = require('discord.js')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const db = require("croxydb")

module.exports = {
    slash: true,                                
    cooldown: 5,                              

    data: new SlashCommandBuilder()         
    .setName('premium-al')
    .setDescription('Bot sahibi özel komutu.')
    .setDMPermission(false)
    .addUserOption(option =>
        option
            .setName('kullanıcı')
            .setDescription('Premiumu alınacak kullanıcıyı belirtin.')
            .setRequired(true)),
  
    async execute(client, interaction) {   
      
      const YetkiYok = new EmbedBuilder()
      .setDescription(`<:carpi:1117083838590492772> Bu komutu kullanabilmek için **Bot sahibi** olmalısın.`)
      .setColor('Red')
      .setTitle("Hata")
        
      if(interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668"){
      return interaction.reply({embeds: [YetkiYok]});
}
      
      const kullanıcı = interaction.options.getUser('kullanıcı');
      const PremiumÜye = db.fetch(`PremiumÜye_${kullanıcı.id}`);
      
      const PremiumAlındı = new EmbedBuilder()
         .setColor("Green")
         .setTitle("Başarılı")
         .setDescription(`<:tik:1117083842264703016> ${kullanıcı} **adlı kullanıcının premiumu alındı.**`)
        
      const PremiumYok = new EmbedBuilder()
         .setColor("Red")
         .setTitle("Hata")
         .setDescription(`<:carpi:1117083838590492772> ${kullanıcı} **adlı kullanıcının zaten premium üyeliği bulunmuyor.**`)
        
      const PremiumGitti = new EmbedBuilder()
         .setColor("Red")
         .setTitle("Bir kullancının premiumu alındı")
         .addFields({name: `<:Kullanici:1106969831481282590> **Kullanıcı adı**`, value: `${kullanıcı}`})
         .addFields({name: `<:Kirmizi:1106994120037253141> **Kullanıcı tagı**`, value: `${kullanıcı.tag}`})
         .addFields({name: `<:Belge:1106969838112477204> **Kullanıcı id**`, value: `${kullanıcı.id}`})
         
      if(!PremiumÜye) {
      
      interaction.reply({embeds: [PremiumYok]}) 
      
      } else {
   
      db.delete(`PremiumÜye_${kullanıcı.id}`)
      interaction.reply({embeds: [PremiumAlındı]})
      client.channels.cache.get("1115626432576638976").send({embeds: [PremiumGitti]})
      db.subtract(`PremiumSayı`, 1)
        
       }
    }
}