const Discord = require('discord.js')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const db = require("croxydb")

module.exports = {
    slash: true,                                
    cooldown: 5,                              

    data: new SlashCommandBuilder()         
    .setName('karaliste-ekle')
    .setDescription('Bot sahibi özel komutu.')
    .setDMPermission(false)
    .addUserOption(option =>
        option
            .setName('kullanıcı')
            .setDescription('Karalisteye eklenecek kullanıcıyı belirtin.')
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName('sebep')
            .setDescription('Karalisteye ekleme sebebini belirtin.')
            .setRequired(true)),
  
    async execute(client, interaction) {   
     
      const YetkiYok = new EmbedBuilder()
      .setDescription(`<:carpi:1117083838590492772> Bu komutu kullanabilmek için **Bot sahibi** olmalısın.`)
      .setColor('Red')
      .setTitle("Hata")
        
      const KaralisteAlınamaz = new EmbedBuilder()
        .setDescription(`<:carpi:1117083838590492772> **Bot sahipleri bu komutdan etkilenmez.**`)
        .setColor('Red')
        .setTitle("Hata")
      
      if(interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "990186530767249419" && interaction.user.id !== "924369071070404668"){
      return interaction.reply({embeds: [YetkiYok]});
}
      const kullanıcı = interaction.options.getUser('kullanıcı');
      const sebep = interaction.options.getString('sebep');
      const Karaliste = db.fetch(`Karaliste_${kullanıcı.id}`)
      
      const KaralisteEklendi = new EmbedBuilder()
      .setDescription(`<:tik:1117083842264703016> ${kullanıcı} **adlı kullanıcı karalisteye eklendi, artık botu kullanamayacak.**`)
      .setColor('Green')
      .setTitle("Başarılı")
      
      const KaralisteyeAlındı = new EmbedBuilder()
         .setColor("Red")
         .setTitle("Bir kullanıcı karalisteye eklendi")
         .addFields({name: `<:Karaliste:1047167116727550023> **Kullanıcı adı**`, value: `${kullanıcı}`})
         .addFields({name: `<:Kirmizi:1106994120037253141> **Kullanıcı tagı**`, value: `${kullanıcı.tag}`})
         .addFields({name: `<:Belge:1106969838112477204> **Kullanıcı id**`, value: `${kullanıcı.id}`})
         .addFields({name: `<:Kullanici:1106969831481282590> **Yetkili adı**`, value: `${interaction.user}`})
         .addFields({name: `<:Yetkili:1047167457703497728> **Yetkili tagı**`, value: `${interaction.user.tag}`})
         .addFields({name: `<:Belge:1106969838112477204> **Yetkili id**`, value: `${interaction.user.id}`})
         .addFields({name: `<:Sebep:1047168561392660602> **Karaliste eklenme sebebi**`, value: `${sebep}`})
      
    //  if(interaction.member.roles.cache.has === "1064963065726111754") return interaction.reply({embeds: [KaralisteAlınamaz]})
     
      if(!Karaliste) {
        
      db.set(`Karaliste_${kullanıcı.id}`, true)
      db.set(`KaralisteSebep_${kullanıcı.id}`, sebep)
    //  db.delete(`UptimeLink_${kullanıcı.id}`)
      interaction.reply({embeds: [KaralisteEklendi]})
      client.channels.cache.get("1115626429263118467").send({embeds: [KaralisteyeAlındı]})
     
      } else {
  
      const KaralistedeVar = new EmbedBuilder()
      .setDescription(`<:carpi:1117083838590492772> ${kullanıcı} **adlı kullanıcı zaten karalistede bulunuyor.**`)
      .setColor('Red')
      .setTitle("Hata")
      
      interaction.reply({embeds: [KaralistedeVar]})
  
       }
    }
}


