const axios = require('axios');
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const champsData = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/data/en_US/champion.json';
let champions = {};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function fetchChamps() {
  return axios.get(champsData).then((response) => {
    champions = response.data.data;
  });
}

async function getRandomChamp(ignore) {
  if (!Object.keys(champions).length) {
    await fetchChamps();
  }

  const randomIndex = getRandomInt(Object.keys(champions).length - 1);
  const randomKey = Object.keys(champions)[randomIndex]
  return champions[randomKey];
}

async function processRandom(names) {
  let results = [];
  for (name in names) {
    const champion = await getRandomChamp();
    let message = ''
    if (name) {
      message += `${name}: `;
    }
    message += `${champion.name}\r\n`;
    results.push(message)
    return message
  }
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
    const containsArgs = msg.content.split(' ').length > 1
    const names = containsArgs ? msg.content.split(' ')[1].split(',') : ['']
    const results = processRandom(names);
    for (result in results) {
      msg.reply(message);
    }
  }
});

// TODO: move to github secret
client.login('OTI1NDI1Mzk5MTA4ODk0Nzkx.Ycs7kA.fOPMSgNOAnMlrmaVbNBXqDMhmro');