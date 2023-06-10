const Discord = require('discord.js')
const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, InteractionType, EmbedBuilder } = require('discord.js')
const db = require("croxydb")

module.exports = {
    slash: true,                                
    cooldown: 5,                              

    data: new SlashCommandBuilder()         
    .setName('link-sil')
    .setDescription('Sistemden link silersiniz.')
    .setDMPermission(false),
  
    async execute(client, interaction) { 
      
const ProjeYok = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Hata")
    .setDescription(`<:carpi:1117083838590492772> **Sistemde böyle bir proje bulunmuyor.**`)
    
const LinkSilindi = new EmbedBuilder()
    .setColor("Green")
    .setTitle("Başarılı")
    .setDescription(`<:tik:1117083842264703016> **Projen başarıyla sistemden silindi.**`)
    
const LinkSilmeFormu = new ModalBuilder()
    .setCustomId('linksilmeform')
    .setTitle('Link sil')
const LinkSilFormu = new TextInputBuilder()
    .setCustomId('linksil')
    .setLabel('Proje adresinizi giriniz.')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(20)
    .setMaxLength(100)
    .setPlaceholder('https://proje-linki.glitch.me')
    .setRequired(true)
const LinkSilmeSistemi = new ActionRowBuilder().addComponents(LinkSilFormu);
LinkSilmeFormu.addComponents(LinkSilmeSistemi);
      
      const PremiumÜye = db.fetch(`PremiumÜye_${interaction.guild.id}`)
      
      await interaction.showModal(LinkSilmeFormu);
  
      await interaction.awaitModalSubmit({ filter: (interaction) => interaction.customId === `linksilmeform`, time: 60 * 60 * 1000 }).then(async (interaction) => {
 
      const links = db.get(`UptimeLink_${interaction.user.id}`)
      let linkInput = interaction.fields.getTextInputValue("linksil")

      if (!links.includes(linkInput)) return interaction.reply({embeds: [ProjeYok]}).catch(e => { })
      
     // if(!PremiumÜye) {
        
        db.unpush(`UptimeLink_${interaction.user.id}`, linkInput)
        db.unpush(`UptimeLink`, linkInput)
     
     /* } else {
        
        db.unpush(`UptimeLink_${interaction.user.id}`, linkInput)
        db.unpush(`PremiumUptimeLink`, linkInput)
        
      }*/
        interaction.reply({embeds: [LinkSilindi]}).catch(e => { })
      
        let PremiumVarmı = db.fetch(`PremiumÜye_${interaction.user.id}`)
        
        let PreVarmı;
        if(!PremiumVarmı) {
        PreVarmı = "<:carpi:1117083838590492772>"
        } else {
        PreVarmı = "<:tik:1117083842264703016>"
        }
  
        const ProjeSilindi = new EmbedBuilder()
         .setColor("Red")
         .setTitle("Sistemden bir link silindi")
         .addFields({name: `<:Kullanici:1106969831481282590> **Kullanıcı adı**`, value: `<@${interaction.user.id}>`})
         .addFields({name: `<:Kirmizi:1106994120037253141> **Kullanıcı tagı**`, value: `${interaction.user.tag}`})
         .addFields({name: `<:Belge:1106969838112477204> **Kullanıcı id**`, value: `${interaction.user.id}`})
         .addFields({name: `<:Belge:1106969838112477204> **Sistemdeki link sayısı**`, value: `${db.fetch(`UptimeLink`).length}`})
         .addFields({name: `<:Link:1106969829795172514> **Kullanıcının link sayısı**`, value: `${db.fetch(`UptimeLink_${interaction.user.id}`).length}`})
         .addFields({name: `<:Elmas:1106969844345208832> **Kullanıcının premiumu bulunuyormu**`, value: `${PreVarmı}`})
        client.channels.cache.get("1115626422053122150").send({embeds: [ProjeSilindi]})
        
      })  
   }
}