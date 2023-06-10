const Discord = require('discord.js')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const db = require("croxydb")
const { ownerid } = require("../ayarlar.json")

module.exports = {
    slash: true,                                
    cooldown: 5,                              

    data: new SlashCommandBuilder()         
    .setName('eval')
    .setDescription('Bot sahibi özel komutu.')
    .setDMPermission(false)
    .addStringOption(option =>
        option
            .setName('kod')
            .setDescription('Denenecek kodu belirtin.')
            .setRequired(true)),
              
    async execute(client, interaction) {   
      
      const YetkiYok = new EmbedBuilder()
      .setDescription(`<:carpi:1117083838590492772> Bu komutu kullanabilmek için **Bot sahibi** olmalısın.`)
      .setColor('Red')
      .setTitle("Hata")
      
      if(interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "924369071070404668" && interaction.user.id !== "990186530767249419" && interaction.user.id !== "924369071070404668"){
    return interaction.reply({embeds: [YetkiYok]});
}
    
      const code = interaction.options.getString('kod');
        
      try {
      var evaled = clean(await eval(code));
      if (evaled.match(new RegExp(`${client.token}`, "g")));
         
         const Token = new EmbedBuilder()
          .setDescription(`<:carpi:1117083838590492772> **Bu şekilde tokenimi alamazsın.**`)
          .setColor('Red')
          .setTitle("Hata")
         
         if (evaled.includes(client.token)) return interaction.reply({embeds: [Token]});
                
         const Eval = new EmbedBuilder()
         .addFields({name: `<:Giris:1048294668707835984> **Kod girişi**`, value: `\`${code}\``})
         .addFields({name: `<:Cikis:1048294654141010010> **Kod çıkışı**`, value: `\`${evaled}\``}) 
         .setColor('Green')
         .setTitle("Başarılı")
         interaction.reply({embeds: [Eval]})
        
         } catch (err) {
           
         const Hata = new EmbedBuilder()
         .addFields({name: `<:Giris:1048294668707835984> **Kod girişi**`, value: `\`${code}\``})
         .addFields({name: `<:Hata:1048294942054809630> **Hata**`, value: `\`${err}\``}) 
         .setColor('Red')
         .setTitle("Hata")
         interaction.reply({embeds: [Hata]});
         }
           
         function clean(text) {
         if (typeof text !== "string")
         text = require("util").inspect(text, { depth: 0 });
         text = text
         .replace(/`/g, "`" + String.fromCharCode(8203))
         .replace(/@/g, "@" + String.fromCharCode(8203));
         return text;
      }
   }
}