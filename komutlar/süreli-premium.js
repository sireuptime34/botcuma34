const Discord = require('discord.js')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const ms = require('ms')
const moment = require('moment')
require('moment-duration-format')
const db = require("croxydb")

module.exports = {
    slash: true,                                
    cooldown: 5,                              

    data: new SlashCommandBuilder()         
    .setName('süreli-premium')
    .setDescription('Bot sahibi özel komutu.')
    .setDMPermission(false)
    .addUserOption(option =>
        option
            .setName('kullanıcı')
            .setDescription('Premium verilecek kullanıcıyı belirtin.')
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName('süre')
            .setDescription('Premium verilecek süreyi belirtin.')
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
      const süre = interaction.options.getString('süre');

      const PremiumÜye = db.fetch(`PremiumÜye_${kullanıcı.id}`);
      
      const PremiumVar = new EmbedBuilder()
         .setColor("Red")
         .setTitle("Hata")
         .setDescription(`<:carpi:1117083838590492772> ${kullanıcı} **adlı kullanıcının zaten premium üyeliği bulunuyor.**`)
        
      if(!PremiumÜye) {
      
      let PremiumBitiş = Date.now() + ms(süre.replace('gün', 'day').replace('saat', 'hours').replace('hafta', 'week'))
      db.set(`PremiumÜye_${kullanıcı.id}`, true)
      db.add(`PremiumSayı`, 1)
      db.set(`Premium_${kullanıcı.id}`, {Bitiş: PremiumBitiş, Başlangıç: Date.now()})
        
      const PremiumEklendi = new EmbedBuilder()
         .setColor("Green")
         .setTitle ("Başarılı")
         .setDescription(`<:tik:1117083842264703016> ${kullanıcı} **adlı kullanıcıya premium verildi. Bitiş tarihi:** ${moment(PremiumBitiş).format('DD.MM.YYYY - HH:mm:ss')}`)
        
      interaction.reply({embeds: [PremiumEklendi]})
      
      const PremiumVerildi = new EmbedBuilder()
         .setColor("Green")
         .setTitle("Bir kullanıcıya süreli premium verildi")
         .addFields({name: `<:Kullanici:1106969831481282590> **Kullanıcı adı**`, value: `${kullanıcı}`})
         .addFields({name: `<:Kirmizi:1106994120037253141> **Kullanıcı tagı**`, value: `${kullanıcı.tag}`})
         .addFields({name: `<:Belge:1106969838112477204> **Kullanıcı id**`, value: `${kullanıcı.id}`})
         .addFields({name: `<:Saat:1065251905497993347> **Bitiş tarihi**`, value: `${moment(PremiumBitiş).format('DD.MM.YYYY - HH:mm:ss')}`})
      
      client.channels.cache.get("1115626432576638976").send({embeds: [PremiumVerildi]}) 

      setTimeout(() => {
        
      db.delete(`PremiumÜye_${kullanıcı.id}`)
      db.delete(`Premium_${kullanıcı.id}`)
      db.subtract(`PremiumSayı`, 1)
        
      const PremiumGitti = new EmbedBuilder()
         .setColor("Red")
         .setTitle("Bir kullancının premium süresi doldu")
         .addFields({name: `<:Kullanici:1106969831481282590> **Kullanıcı adı**`, value: `${kullanıcı}`})
         .addFields({name: `<:Kirmizi:1106994120037253141> **Kullanıcı tagı**`, value: `${kullanıcı.tag}`})
         .addFields({name: `<:Belge:1106969838112477204> **Kullanıcı id**`, value: `${kullanıcı.id}`})
         
      client.channels.cache.get("1115626432576638976").send({embeds: [PremiumGitti]})

      }, ms(süre.replace('gün', 'day').replace('saat', 'hours').replace('hafta', 'week')))
       
      } else {
   
      interaction.reply({embeds: [PremiumVar]})
      
        }
    }
}