const Discord = require('discord.js')
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const db = require("croxydb")

module.exports = {
    slash: true, 
    yetki: 'Administrator',
    cooldown: 5,                              

    data: new SlashCommandBuilder()         
    .setName('uptime-sistemi-kur')
    .setDescription('Sunucuya ait uptime sistemi kurarsınız.')
    .setDMPermission(false)
    .addChannelOption(option =>
        option
            .setName('kanal')
            .setDescription('Uptime sisteminin kurulacağı kanalı belirtin.')
            .setRequired(true)),
  
    async execute(client, interaction) {   
        
      const kanal = interaction.options.getChannel('kanal');
      const Sistem = db.fetch(`UptimeSistemi_${interaction.guild.id}`)
      
      if(!Sistem) {
          
        const SistemAçıldı = new EmbedBuilder()
             .setColor("Green")
             .setTitle("Başarılı")
             .setDescription(`<:tik:1117083842264703016> **Uptime sistemi <#${kanal.id}> adlı kanalda kuruldu.**`)
        interaction.reply({embeds: [SistemAçıldı]})
        
        const SistemMesajı = new EmbedBuilder()
             .setColor("Blurple")
             .setTitle("SireUptime • Uptime sistemi")
             .setDescription(`
> **Uptime sistemine hoşgeldiniz.**
            
> **Aşağıdaki \`Ekle\` - \`Sil\` - \`Liste\` butonları ile sistemi kullanabilirsiniz.**
             
> **Diğer komutlarıma erişmek için </yardım:0> komutunu kullanabilirsiniz.**
`)
     
        const EkleButonu = new ActionRowBuilder()
           .addComponents(new ButtonBuilder()
           .setEmoji("<:Davet:1047160005998166056>")
           .setLabel("Ekle")
           .setStyle(ButtonStyle.Secondary)
           .setCustomId("eklebuton"))
        
        const SilButonu = new ActionRowBuilder()
           .addComponents(new ButtonBuilder()
           .setEmoji("<:Cop:1066000658190311424>")
           .setLabel("Sil")
           .setStyle(ButtonStyle.Secondary)
           .setCustomId("silbuton"))
              
        const ListeButonu = new ActionRowBuilder()
           .addComponents(new ButtonBuilder()
           .setEmoji("<:Link:1106969829795172514>")
           .setLabel("Liste")
           .setStyle(ButtonStyle.Secondary)
           .setCustomId("listebuton"))
        
        client.channels.cache.get(kanal.id).send({embeds: [SistemMesajı], components: [EkleButonu, SilButonu, ListeButonu]})
        
        db.set(`UptimeSistemi_${interaction.guild.id}`, kanal.id)
          
        } else {
           
        const SistemAçık = new EmbedBuilder()
         .setColor("Red")
         .setTitle("Hata")
         .setDescription(`<:carpi:1117083838590492772> **Sistem zaten açık. Sıfırlamak için: </uptime-sistemi-sıfırla:0>**`)
      
        interaction.reply({embeds: [SistemAçık]})
        
         
     }
   }
}