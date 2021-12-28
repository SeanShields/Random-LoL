// Import discord.js and create the client
const Discord = require('discord.js')
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

// Register an event so that when the bot is ready, it will log a messsage to the terminal
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
})

// Register an event to handle incoming messages
client.on('messageCreate', async msg => {
  // This block will prevent the bot from responding to itself and other bots
  if(msg.author.bot) {
    return
  }

  // Check if the message starts with '!hello' and respond with 'world!' if it does.
  if(msg.content.startsWith("!hello")) {
    msg.reply("world!")
  }
})

// client.login logs the bot in and sets it up for use. You'll enter your token here.
client.login('OTI1NDI1Mzk5MTA4ODk0Nzkx.Ycs7kA.fOPMSgNOAnMlrmaVbNBXqDMhmro');