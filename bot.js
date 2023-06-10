const Discord = require('discord.js')
const { Client, Partials, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, InteractionType, EmbedBuilder, ButtonBuilder } = require('discord.js')
const client = new Client({ intents: 131071, partials: Object.values(Partials).filter(x => typeof x === "string"), shards: 'auto' })
const { botid, token } = require("./ayarlar.json")
const moment = require('moment')
const os = require('os') 
const osutils = require('os-utils') 
require("moment-duration-format")
require("./slash")(client)
const db = require("croxydb")
const fetch = require('node-fetch')
client.login(token)
const express = require('express')
const monitor = require('http-monitor')

//=====// Embedler \\=====\\
const PreYok = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Hata")
    .setDescription(`<:carpi:1117083838590492772> **Normal bir kullanıcı en fazla 2 proje ekleyebilir, </link-limit:0> komutu ile link limitinizi arttırabilir, </pre-al:0> komutu ile premium alarak sınırsız link ekleyebilirsiniz.**`)
    
const FazlaLink = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Hata")
    .setDescription(`<:carpi:1117083838590492772> **Bir kullanıcı tarafından en fazla 999 link eklenebilir.**`)
   
const LinkVar = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Hata")
    .setDescription(`<:carpi:1117083838590492772> **Belirtilen proje sistemde bulunuyor.**`)
    
const BaşıHatalı = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Hata")
    .setDescription(`<:carpi:1117083838590492772> **Proje linkin hatalı, linkin başında \`https://\` olduğundan emin ol.**`)
    
const SonuHatalı = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Hata")
    .setDescription(`<:carpi:1117083838590492772> **Yalnızca glitch projeleri aktif tutulmaktdır, linkin sonunda \`.glitch.me\` olduğundan emin ol.**`)
    
const LinkEklendi = new EmbedBuilder()
    .setColor("Green")
    .setTitle("Başarılı")
    .setDescription(`<:tik:1117083842264703016> **Projen başarıyla sisteme eklendi, linkiniz 2-5 dk içerisinde aktif olacaktır.**`)
        
const ProjeYok = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Hata")
    .setDescription(`<:carpi:1117083838590492772> **Sistemde böyle bir proje bulunmuyor.**`)
    
const LinkSilindi = new EmbedBuilder()
    .setColor("Green")
    .setTitle("Başarılı")
    .setDescription(`<:tik:1117083842264703016> **Projen başarıyla sistemden silindi.**`)
    
const Silindi = new EmbedBuilder()
    .setColor("Green")
    .setTitle("Başarılı")
    .setDescription(`<:tik:1117083842264703016> **Proje başarıyla sistemden silindi.**`)
    
const ProjeEklenmemiş = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Hata")
    .setDescription(`<:carpi:1117083838590492772>  **Sisteme hiç proje eklememişsin.**`)
//=====// Embedler \\=====\\

//=====// LinkEklemeFormu \\=====\\
const LinkEklemeFormu = new ModalBuilder()
    .setCustomId('linkeklemeform2')
    .setTitle('Link ekle')
const LinkEkleFormu = new TextInputBuilder()
    .setCustomId('linkekle')
    .setLabel('Proje adresinizi giriniz.')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(20)
    .setMaxLength(100)
    .setPlaceholder('https://proje-linki.glitch.me')
    .setRequired(true)
const LinkEklemeSistemi = new ActionRowBuilder().addComponents(LinkEkleFormu);
LinkEklemeFormu.addComponents(LinkEklemeSistemi);
//=====// LinkEklemeFormu \\=====\\

//=====// LinkSilmeFormu \\=====\\
const LinkSilmeFormu = new ModalBuilder()
    .setCustomId('linksilmeform2')
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
//=====// LinkSilmeFormu \\=====\\

//=====// SilmeFormu \\=====\\
const SilmeFormu = new ModalBuilder()
    .setCustomId('silmeform')
    .setTitle('Link sil')
const SilFormu = new TextInputBuilder()
    .setCustomId('sil')
    .setLabel('Proje adresinizi giriniz.')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(20)
    .setMaxLength(100)
    .setPlaceholder('https://proje-linki.glitch.me')
    .setRequired(true)
const SilmeSistemi = new ActionRowBuilder().addComponents(SilFormu);
SilmeFormu.addComponents(SilmeSistemi); 

const SilID = new TextInputBuilder()
    .setCustomId('silid')
    .setLabel('Projesi silinecek kullanıcı idsini giriniz.')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(18)
    .setMaxLength(20)
    .setPlaceholder('924369071070404668')
    .setRequired(true)
const SilmeID = new ActionRowBuilder().addComponents(SilID);
SilmeFormu.addComponents(SilmeID);

const Sebep = new TextInputBuilder()
    .setCustomId('sebep')
    .setLabel('Projeyi silme sebebini belirtin.')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('Geçersiz link.')
    .setRequired(true)
const SilmeSebep = new ActionRowBuilder().addComponents(Sebep);
SilmeFormu.addComponents(SilmeSebep);
        
//=====// SilmeKomutu \\=====\\
client.on('interactionCreate', async interaction => {
  if (interaction.commandName === "sil") {
    
    const YetkiYok = new EmbedBuilder()
      .setDescription(`<:carpi:1117083838590492772> Bu komutu kullanabilmek için **Bot sahibi** olmalısın.`)
      .setColor('Red')
      .setTitle("Hata")
        
    if(interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668"){
    return interaction.reply({embeds: [YetkiYok]});
}
    
    await interaction.showModal(SilmeFormu);
   }
 })
client.on('interactionCreate', async interaction => {
    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'silmeform') {
      
      let linkInput = interaction.fields.getTextInputValue("sil")
      let linkID = interaction.fields.getTextInputValue("silid")
      let Sebep = interaction.fields.getTextInputValue("sebep")
      const links = db.get(`UptimeLink_${linkID}`)

      if (!links.includes(linkInput)) return interaction.reply({embeds: [ProjeYok]}).catch(e => { })
        db.unpush(`UptimeLink_${linkID}`, linkInput)
        db.unpush(`UptimeLink`, linkInput)
        interaction.reply({embeds: [Silindi]}).catch(e => { })
      
        let PremiumVarmı = db.fetch(`PremiumÜye_${linkID}`)
        
        let PreVarmı;
        if(!PremiumVarmı) {
        PreVarmı = "<:carpi:1117083838590492772>"
        } else {
        PreVarmı = "<:tik:1117083842264703016>"
        }
      
      
        const ProjeSilindi = new EmbedBuilder()
         .setColor("Red")
         .setTitle("Bot sahibi tarafından sistemden bir link silindi")
         .addFields({name: `<:Kullanici:1106969831481282590> **Kullanıcı adı**`, value: `<@${linkID}>`})
         .addFields({name: `<:Belge:1106969838112477204> **Kullanıcı id**`, value: `${linkID}`})
         .addFields({name: `<:Belge:1106969838112477204> **Sistemdeki link sayısı**`, value: `${db.fetch(`UptimeLink`).length}`})
         .addFields({name: `<:Link:1106969829795172514> **Kullanıcının link sayısı**`, value: `${db.fetch(`UptimeLink_${linkID}`).length}`})
         .addFields({name: `<:Elmas:1106969844345208832> **Kullanıcının premiumu bulunuyormu**`, value: `${PreVarmı}`})
         .addFields({name: `<:Ucak:1109558883032252497> **Linkin silinme sebebi**`, value: `${Sebep}`})
        client.channels.cache.get("1115626422053122150").send({embeds: [ProjeSilindi]})
        
    }
})
//=====// SilmeKomutu \\=====\\

//=====// EklendimAtıldım \\=====\\
client.on('guildCreate', guild => {
  
  const Eklendim = new EmbedBuilder()
     .setColor("Green")
     .setTitle("Bir sunucuya eklendim")
     .addFields({name: `<:Kirmizi:1106994120037253141> **Sunucu adı**`, value: `${guild}`})
     .addFields({name: `<:Belge:1106969838112477204> **Sunucu id**`, value: `${guild.id}`})
     .addFields({name: `<:Ucak:1109558883032252497> **Toplam sunucu**`, value: `${client.guilds.cache.size}`})
     .addFields({name: `<:Kullanici:1106969831481282590> **Toplam kullanıcı**`, value: `${client.users.cache.size}`})
  client.channels.cache.get('1115626435881746464').send({embeds: [Eklendim]})})

  client.on('guildDelete', guild => {
    
    const Atıldım = new EmbedBuilder()
     .setColor("Red")
     .setTitle("Bir sunucudan atıldım")
     .addFields({name: `<:Kirmizi:1106994120037253141> **Sunucu adı**`, value: `${guild}`})
     .addFields({name: `<:Belge:1106969838112477204> **Sunucu id**`, value: `${guild.id}`})
     .addFields({name: `<:Ucak:1109558883032252497> **Toplam sunucu**`, value: `${client.guilds.cache.size}`})
     .addFields({name: `<:Kullanici:1106969831481282590> **Toplam kullanıcı**`, value: `${client.users.cache.size}`})
  client.channels.cache.get('1115626435881746464').send({embeds: [Atıldım]})})
//=====// EklendimAtıldım \\=====\\

//=====// LinkEklemeSistemi \\=====\\
client.on('interactionCreate', async interaction => {
    if (interaction.customId === "eklebuton") {
      
      const Kullanamazsın = new EmbedBuilder()
           .setColor("Red")
           .setTitle("Komutlarımı kullanamazsın")
           .setDescription(`<:Carpi:1106977908158890014> **Karalistemde bulunduğun için komutlarımı kullanmazsın, karalisteye alınma sebebini öğrenmek için veya karalisteden çıkartılmak için destek sunucuma gelebilirsin.**`)
        
        const Destek = new ActionRowBuilder().addComponents(new ButtonBuilder()        
           .setURL(`https://discord.gg/rtTwrAKUaT`)
           .setLabel("Destek sunucusu")
           .setStyle("Link"))
         
    if (db.fetch(`Karaliste_${interaction.user.id}`)) return interaction.reply({embeds: [Kullanamazsın], components: [Destek], ephemeral: true})
       
    if(db.fetch(`Bakım`)) {
          
          const Bakımda = new EmbedBuilder()
           .setColor("Red")
           .setTitle("Bot bakımda")
           .setDescription(`<:Saat:1106969849487429632> **Sizlere en iyi hizmeti vermek için kısa süreliğine bakımdayız. Daha ayrıntılı bilgi için destek sunucusuna gelebilirsiniz. Bakım sebebi: \`${db.fetch(`BakımSebep`)}\`**`)
        
          const Destek = new ActionRowBuilder().addComponents(new ButtonBuilder()        
           .setURL(`https://discord.gg/rtTwrAKUaT`)
           .setLabel("Destek sunucusu")
           .setStyle("Link"))
          
          if(interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668"){
  
          interaction.reply({embeds: [Bakımda], components: [Destek], ephemeral: true})
       
          }
        }
      
    await interaction.showModal(LinkEklemeFormu);
  }
})
client.on('interactionCreate', async interaction => {
    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'linkeklemeform2') {
    
      const LinkLimit = db.fetch(`LinkLimit_${interaction.user.id}`) || 0
      let Limit = LinkLimit+2 
      
      if (!db.fetch(`UptimeLink_${interaction.user.id}`)) {
           db.set(`UptimeLink_${interaction.user.id}`, [])
        }
        const link = interaction.fields.getTextInputValue("linkekle")
        let link2 = db.fetch(`UptimeLink_${interaction.user.id}`, [])

        const PremiumÜye = db.fetch(`PremiumÜye_${interaction.user.id}`)

        if (!link) return

        if (PremiumÜye) {
            if (db.fetch(`UptimeLink_${interaction.user.id}`).length >= 999) {
                return interaction.reply({embeds: [FazlaLink], ephemeral: true}).catch(e => { })
            }

        } else {
        
        if (db.fetch(`UptimeLink_${interaction.user.id}`).length >= Limit) {
                return interaction.reply({embeds: [PreYok], ephemeral: true}).catch(e => { })}
          }

        if (link2.includes(link)) {
            return interaction.reply({embeds: [LinkVar], ephemeral: true}).catch(e => { })
        }

        if (!link.startsWith("https://")) {
            return interaction.reply({embeds: [BaşıHatalı], ephemeral: true}).catch(e => { })
        }

        if (!link.endsWith(".glitch.me")) {
            return interaction.reply({embeds: [SonuHatalı], ephemeral: true}).catch(e => { })
        }
      
        db.push(`UptimeLink_${interaction.user.id}`, link)
        db.push(`UptimeLink`, link)
  
        interaction.reply({embeds: [LinkEklendi], ephemeral: true}).catch(e => { })
      
        let PremiumVarmı = db.fetch(`PremiumÜye_${interaction.user.id}`)
        
        let PreVarmı;
        if(!PremiumVarmı) {
        PreVarmı = "<:carpi:1117083838590492772>"
        } else {
        PreVarmı = "<:tik:1117083842264703016>"
        }
        
      const ProjeEklendi = new EmbedBuilder()
           .setColor("Green")
           .setTitle("Sisteme bir link eklendi")
           .addFields({name: `<:Kullanici:1106969831481282590> **Kullanıcı adı**`, value: `<@${interaction.user.id}>`})
           .addFields({name: `<:Kirmizi:1106994120037253141> **Kullanıcı tagı**`, value: `${interaction.user.tag}`})
           .addFields({name: `<:Belge:1106969838112477204> **Kullanıcı id**`, value: `${interaction.user.id}`})
           .addFields({name: `<:Belge:1106969838112477204> **Sistemdeki link sayısı**`, value: `${db.fetch(`UptimeLink`).length}`})
           .addFields({name: `<:Link:1106969829795172514> **Kullanıcının link sayısı**`, value: `${db.fetch(`UptimeLink_${interaction.user.id}`).length}`})
           .addFields({name: `<:Elmas:1106969844345208832> **Kullanıcının premiumu bulunuyormu**`, value: `${PreVarmı}`})
        client.channels.cache.get("1115626422053122150").send({embeds: [ProjeEklendi]})
        
     } 
 })
//=====// LinkEklemeSistemi \\=====\\

//=====// LinkSilmeSistemi \\=====\\
client.on('interactionCreate', async interaction => {
    if (interaction.customId === "silbuton") {
      
      const Kullanamazsın = new EmbedBuilder()
           .setColor("Red")
           .setTitle("Komutlarımı kullanamazsın")
           .setDescription(`<:Carpi:1106977908158890014> **Karalistemde bulunduğun için komutlarımı kullanmazsın, karalisteye alınma sebebini öğrenmek için veya karalisteden çıkartılmak için destek sunucuma gelebilirsin.**`)
        
        const Destek = new ActionRowBuilder().addComponents(new ButtonBuilder()        
           .setURL(`https://discord.gg/rtTwrAKUaT`)
           .setLabel("Destek sunucusu")
           .setStyle("Link"))
         
    if (db.fetch(`Karaliste_${interaction.user.id}`)) return interaction.reply({embeds: [Kullanamazsın], components: [Destek], ephemeral: true})
      
    if(db.fetch(`Bakım`)) {
          
          const Bakımda = new EmbedBuilder()
           .setColor("Red")
           .setTitle("Bot bakımda")
           .setDescription(`<:Saat:1106969849487429632> **Sizlere en iyi hizmeti vermek için kısa süreliğine bakımdayız. Daha ayrıntılı bilgi için destek sunucusuna gelebilirsiniz. Bakım sebebi: \`${db.fetch(`BakımSebep`)}\`**`)
        
          const Destek = new ActionRowBuilder().addComponents(new ButtonBuilder()        
           .setURL(`https://discord.gg/rtTwrAKUaT`)
           .setLabel("Destek sunucusu")
           .setStyle("Link"))
          
          if(interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668"){
  
          interaction.reply({embeds: [Bakımda], components: [Destek]})
       
          }
        }
      
    await interaction.showModal(LinkSilmeFormu);
   }
})
client.on('interactionCreate', async interaction => {
    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'linksilmeform2') {
    
      const PremiumÜye = db.fetch(`PremiumÜye_${interaction.guild.id}`)
      
      const links = db.get(`UptimeLink_${interaction.user.id}`)
      let linkInput = interaction.fields.getTextInputValue("linksil")

      if (!links.includes(linkInput)) return interaction.reply({embeds: [ProjeYok], ephemeral: true}).catch(e => { })
     
        db.unpush(`UptimeLink_${interaction.user.id}`, linkInput)
        db.unpush(`UptimeLink`, linkInput)
        
        interaction.reply({embeds: [LinkSilindi], ephemeral: true}).catch(e => { })
      
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
        
    }
})
//=====// LinkSilmeSistemi \\=====\\
      
//=====// LinkListeSistemi \\=====\\
client.on('interactionCreate', async interaction => {
    if (interaction.customId === "listebuton") {
    
    const Kullanamazsın = new EmbedBuilder()
           .setColor("Red")
           .setTitle("Komutlarımı kullanamazsın")
           .setDescription(`<:Carpi:1106977908158890014> **Karalistemde bulunduğun için komutlarımı kullanmazsın, karalisteye alınma sebebini öğrenmek için veya karalisteden çıkartılmak için destek sunucuma gelebilirsin.**`)
        
        const Destek = new ActionRowBuilder().addComponents(new ButtonBuilder()        
           .setURL(`https://discord.gg/rtTwrAKUaT`)
           .setLabel("Destek sunucusu")
           .setStyle("Link"))
         
    if (db.fetch(`Karaliste_${interaction.user.id}`)) return interaction.reply({embeds: [Kullanamazsın], components: [Destek], ephemeral: true})
      
    if(db.fetch(`Bakım`)) {
          
          const Bakımda = new EmbedBuilder()
           .setColor("Red")
           .setTitle("Bot bakımda")
           .setDescription(`<:Saat:1106969849487429632> **Sizlere en iyi hizmeti vermek için kısa süreliğine bakımdayız. Daha ayrıntılı bilgi için destek sunucusuna gelebilirsiniz. Bakım sebebi: \`${db.fetch(`BakımSebep`)}\`**`)
        
          const Destek = new ActionRowBuilder().addComponents(new ButtonBuilder()        
           .setURL(`https://discord.gg/rtTwrAKUaT`)
           .setLabel("Destek sunucusu")
           .setStyle("Link"))
          
          if(interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668"){
  
          interaction.reply({embeds: [Bakımda], components: [Destek]})
       
          }
        }
      
    const LinkYok = db.get(`UptimeLink_${interaction.user.id}`)
 			if (!LinkYok) return interaction.reply({embeds: [ProjeEklenmemiş], ephemeral: true})
        
        const links = db.get(`UptimeLink_${interaction.user.id}`).map(map => `<:Link:1106969829795172514> **Link:** ${map}`).join("\n")

        const LinkListe = new EmbedBuilder()
            .setTitle(`Sistemdeki projelerin`)
            .setDescription(`${links || "Sisteme eklenmiş bir proje yok."}`)
            .setFooter({ text: "Uptime linkler" })
            .setColor("Blurple")

        interaction.reply({
            embeds: [LinkListe],
            ephemeral: true
        }).catch(e => { })

    }
})
//=====// LinkListeSistemi \\=====\\

//=====// UptimeEtme \\=====\\
setInterval(() => {
  var links = db.get("UptimeLink");
  if (!links) return;
  links.forEach(link => {
    try {
      fetch(link);
    } catch (e) {
      console.log("Hata: " + e);
    }
  });
  console.log("Uptime başarılı")
}, 120000);
//=====// UptimeEtme \\=====\\

