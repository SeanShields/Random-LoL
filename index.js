const axios = require('axios');
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const champsData = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/data/en_US/champion.json';
let champions = [];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function fetchChamps() {
  return axios.get(champsData);
}

function getRandomChamp(ignore) {
  return fetchChamps().then((response) => {
    let champs = response.data.data;
    const randomIndex = getRandomInt(Object.keys(champs).length - 1);
    console.log(randomIndex)
    const randomChamp = Object.keys(champs)[randomIndex]
    console.log(randomChamp)
    return champs[randomChamp];
  });
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
    getRandomChamp().then((champ) => {
      msg.reply(champ.name);
    });
  }
});

// TODO: move to github secret
client.login('OTI1NDI1Mzk5MTA4ODk0Nzkx.Ycs7kA.fOPMSgNOAnMlrmaVbNBXqDMhmro');