const Discord = require('discord.js')
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
})

client.on('messageCreate', async msg => {
  // dont respond to bots
  if(msg.author.bot) {
    return
  }

  // Check if the message starts with '!hello' and respond with 'world!' if it does.
  if(msg.content.startsWith("!random")) {
    console.log(msg)
    msg.reply("world!")
  }
})

// TODO: move to github secret
client.login('OTI1NDI1Mzk5MTA4ODk0Nzkx.Ycs7kA.fOPMSgNOAnMlrmaVbNBXqDMhmro');