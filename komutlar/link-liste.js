const Discord = require('discord.js')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const db = require("croxydb")

module.exports = {
    slash: true,                                
    cooldown: 5,                              

    data: new SlashCommandBuilder()         
    .setName('link-liste')
    .setDescription('Sistemdeki linklerinizi listeler.')
    .setDMPermission(false),
      
    async execute(client, interaction) {   
      
      const ProjeEklenmemiş = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Hata")
          .setDescription(`<:carpi:1117083838590492772>  **Sisteme hiç proje eklememişsin.**`)
    
      const LinkYok = db.get(`UptimeLink_${interaction.user.id}`)
 			if (!LinkYok) return interaction.reply({embeds: [ProjeEklenmemiş]})
        
        const links = db.get(`UptimeLink_${interaction.user.id}`).map(map => `<:Link:1106969829795172514> **Link:** ${map}`).join("\n")

        const LinkListe = new EmbedBuilder()
            .setTitle(`SireUptime • Projelerin`)
            .setDescription(`${links || "Sisteme eklenmiş bir proje yok."}`)
            .setColor("Blurple")

        interaction.reply({
            embeds: [LinkListe],
            ephemeral: true
        }).catch(e => { })
      
    }
}