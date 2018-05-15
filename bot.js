const Discord = require("discord.js")
const client = new Discord.Client()
const fs = require("fs")
const prefix = "->"


client.on('ready', () => {
    console.log('-------------------------')
    console.log(`✨ Name: ${client.user.username}`)
    console.log('-------------------------')
    console.log(`✨ Id: ${client.user.id}`)
    console.log('-------------------------')
    console.log(`✨ Prefix: ${prefix}`)
    console.log('-------------------------')
    console.log(`✨ Servers: ${client.guilds.size}`)
    console.log('-------------------------')
    console.log(`✨ Members: ${client.users.size}`)
    console.log('-------------------------')
    console.log(`✨ Channels: ${client.channels.size}`)
    console.log('-------------------------')
  })
  
client.on('message', msg => {
    if(msg.content === 'bic') {
        msg.reply('Hi')
    }
})

let lg = JSON.parse(fs.readFileSync('./log.json', 'utf8'))

client.on('message', message => {
    
    let newlog = message.content.split(" ").slice(1).join(" ")
    if(!lg[message.guild.id]) lg[message.guild.id] = {
        ch: "log"
    }
    let lgy = lg[message.guild.id].ch;
    if(message.content.startsWith(prefix + 'setlog')) {
        if(!newlog) return message.reply(`${prefix}setlog [Channel name]`)
     if(!message.guild.channels.find(`name`,newlog)) return message.reply(`I Cant Find This Channel.`)
        lg[message.guild.id].ch = newlog
        message.channel.send('**Log Channel has been changed to `' + newlog + '`.**')
    }
    fs.writeFile("./log.json", JSON.stringify(lg), (err) => {
        if (err) console.error(err)
      });

if(message.content === prefix + 'setlog info') {
    message.channel.send(`**Log!**
    **Channel**:${lgy}`)
}

client.on("roleDelete",  rd => {
    const channel = rd.guild.channels.find("name", lgy)
    if(channel) {
      var embed = new Discord.RichEmbed()
      .setTitle(` - Role Delete`)
      .setDescription(`A role has been deleted \n Name : ${rd.name}`)
      .setColor(`#34495E`)
         .setTimestamp();
    channel.sendEmbed(embed)
    }
    });        

    client.on("roleCreate",  rc => {
        const channel = rc.guild.channels.find("name", lgy)
        if(channel) {
          var embed = new Discord.RichEmbed()
          .setTitle(` - Role Create`)
          .setDescription(`A role Has been created \n Name : ${rc.name}`)
          .setColor(`#34495E`)
             .setTimestamp();
        channel.sendEmbed(embed)
        }
        });
        client.on('messageUpdate', (message, newMessage) => {
            if (message.content === newMessage.content) return;
            if (!message || !message.id || !message.content || !message.guild || message.author.bot) return;
            const channel = message.guild.channels.find('name', lgy);
            if (!channel) return;
          
            let embed = new Discord.RichEmbed()
               .setAuthor(`${message.author.tag}`, message.author.avatarURL)
               .setColor('#34495E')
               .setDescription(`✏ **Message sent by <@${message.author.id}> edited in** <#${message.channel.id}>\n\nOld:\n \${message.cleanContent}\n\nNew:\n ${newMessage.cleanContent}`)
               .setTimestamp();
             channel.send({embed:embed});
          });

          client.on('messageDelete', message => {
            if (!message || !message.id || !message.content || !message.guild || message.author.bot) return;
            const channel = message.guild.channels.find('name', lgy);
            if (!channel) return;
          
            let embed = new Discord.RichEmbed()
               .setAuthor(`${message.author.tag}`, message.author.avatarURL)
               .setColor('#34495E')
               .setDescription(`🗑️ **Message sent by <@${message.author.id}> deleted in** <#${message.channel.id}>\n\n \${message.cleanContent}`)
               .setTimestamp();
             channel.send({embed:embed});
          
          });

          client.on('guildMemberRemove', member => {
            if (!member || !member.id || !member.guild) return;
            const guild = member.guild;
          
            const channel = member.guild.channels.find('name', lgy);
            if (!channel) return;
            let memberavatar = member.user.avatarURL
            const fromNow = moment(member.joinedTimestamp).fromNow();
            
            let embed = new Discord.RichEmbed()
               .setAuthor(`${member.user.tag}`, member.user.avatarURL)
             .setThumbnail(memberavatar)
               .setColor('#34495E')
               .setDescription(`:outbox_tray: <@${member.user.id}> left the server\n\n Had joined: \n ${fromNow}`)
               .setTimestamp();
             channel.send({embed:embed});
          });
          // لوق دخول اللاعبين
          client.on('guildMemberAdd', member => {
            if (!member || !member.id || !member.guild) return;
            const guild = member.guild;
          
            const channel = member.guild.channels.find('name', lgy);
            if (!channel) return;
            let memberavatar = member.user.avatarURL
            const fromNow = moment(member.user.createdTimestamp).fromNow();
            const isNew = (new Date() - member.user.createdTimestamp) < 900000 ? '🆕' : '';
            
            let embed = new Discord.RichEmbed()
               .setAuthor(`${member.user.tag}`, member.user.avatarURL)
             .setThumbnail(memberavatar)
               .setColor('#34495E')
               .setDescription(`:inbox_tray: <@${member.user.id}> Joined the server\n\n Created: \n ${fromNow} ${isNew}`)
               .setTimestamp();
             channel.send({embed:embed});
          });

})






client.login(process.env.BOT_TOKEN);
