const Discord = require('discord.js')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const db = require("croxydb")

module.exports = {
    slash: true,                                
    cooldown: 5,                              

    data: new SlashCommandBuilder()         
    .setName('karaliste-çıkart')
    .setDescription('Bot sahibi özel komutu.')
    .setDMPermission(false)
    .addUserOption(option =>
        option
            .setName('kullanıcı')
            .setDescription('Karalisteden çıkartılacak kullanıcıyı belirtin.')
            .setRequired(true)),
              
    async execute(client, interaction) {  
      
      const YetkiYok = new EmbedBuilder()
         .setDescription(`<:carpi:1117083838590492772> Bu komutu kullanabilmek için **Bot sahibi** olmalısın.`)
         .setColor('Red')
         .setTitle("Hata")
        
      if(interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "990186530767249419" && interaction.user.id !== "924369071070404668"){
      return interaction.reply({embeds: [YetkiYok]});
}
      const kullanıcı = interaction.options.getUser('kullanıcı');
      const Karaliste = db.fetch(`Karaliste_${kullanıcı.id}`)
      
      const KaralisteÇıkartılmaz = new EmbedBuilder()
        .setDescription(`<:carpi:1117083838590492772> **Bot sahipleri bu komutdan etkilenmez.**`)
        .setColor('Red')
        .setTitle("Hata")
      
      const KaralisteGitti = new EmbedBuilder()
      .setDescription(`<:tik:1117083842264703016> ${kullanıcı} **adlı kullanıcı karalisteden çıkartıldı, artık botu kullanabilir.**`)
      .setColor('Green')
      .setTitle("Başarılı")
      
      const KaralistedenÇıkartıldı = new EmbedBuilder()
         .setColor("Green")
         .setTitle("Bir kullanıcı karalisteden çıkartıldı")
         .addFields({name: `<:Karaliste:1047167116727550023> **Kullanıcı adı**`, value: `${kullanıcı}`})
         .addFields({name: `<:Kirmizi:1106994120037253141> **Kullanıcı tagı**`, value: `${kullanıcı.tag}`})
         .addFields({name: `<:Belge:1106969838112477204> **Kullanıcı id**`, value: `${kullanıcı.id}`})
         .addFields({name: `<:Kullanici:1106969831481282590> **Yetkili adı**`, value: `${interaction.user}`})
         .addFields({name: `<:Yetkili:1047167457703497728> **Yetkili tagı**`, value: `${interaction.user.tag}`})
         .addFields({name: `<:Belge:1106969838112477204> **Yetkili id**`, value: `${interaction.user.id}`})
       
    //  if(interaction.member.roles.cache.has === "1064963065726111754") return interaction.reply({embeds: [KaralisteÇıkartılmaz]})
     
      if(!Karaliste) {
        
        const KaralistedeYok = new EmbedBuilder()
           .setDescription(`<:carpi:1117083838590492772> ${kullanıcı} **adlı kullanıcı zaten karalistede bulunmuyor.**`)
           .setColor('Red')
           .setTitle("Hata")
        
        interaction.reply({embeds: [KaralistedeYok]})
      
      } else {
       
        db.delete(`Karaliste_${kullanıcı.id}`)
        db.delete(`KaralisteSebep_${kullanıcı.id}`)
        interaction.reply({embeds: [KaralisteGitti]})
        client.channels.cache.get("1115626429263118467").send({embeds: [KaralistedenÇıkartıldı]})
        
        }
    }
}