const Discord = require('discord.js')
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const db = require("croxydb")

module.exports = {
    slash: true,  
    yetki: 'Administrator',
    cooldown: 5,                              

    data: new SlashCommandBuilder()         
    .setName('uptime-sistemi-sıfırla')
    .setDescription('Sunucudaki uptime sistemini sıfırlarsınız.')
    .setDMPermission(false),
  
    async execute(client, interaction) {   
        
      const Sistem = db.fetch(`UptimeSistemi_${interaction.guild.id}`)
      
      if(!Sistem) {
        
        const SistemKapalı = new EmbedBuilder()
         .setColor("Red")
         .setTitle("Hata")
         .setDescription(`<:carpi:1117083838590492772> **Sistem zaten kapalı. Ayarlamak için: </uptime-sistemi-kur:0>**`)
      
        interaction.reply({embeds: [SistemKapalı]})
        
      } else {
         
        const SistemKapandı = new EmbedBuilder()
             .setColor("Green")
             .setTitle("Başarılı")
             .setDescription(`<:tik:1117083842264703016> **Uptime sistemi başarıyla sıfırlandı.**`)
        interaction.reply({embeds: [SistemKapandı]})
        
        db.delete(`UptimeSistemi_${interaction.guild.id}`)
          
       }
   }
}