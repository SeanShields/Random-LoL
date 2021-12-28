const axios = require('axios');
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const champsData = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/data/en_US/champion.json';
const champions = [];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function fetchChamps() {
  axios.get(champsData).then((response) => {
    champions = response;
  })
}

async function getRandomChamp(ignore) {
  if (!champions.length) {
    await fetchChamps();
  }

  const randomIndex = getRandomInt(champions.length - 1);
  return champions[randomIndex]
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async msg => {
  // dont respond to bots
  if (msg.author.bot) {
    return;
  }

  if (msg.content.startsWith("!random")) {
    const champion = getRandomChamp();
    msg.reply(champion.name);
  }
});

// TODO: move to github secret
client.login('OTI1NDI1Mzk5MTA4ODk0Nzkx.Ycs7kA.fOPMSgNOAnMlrmaVbNBXqDMhmro');