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
  const randomKey = Object.keys(champions)[randomIndex];
  return champions[randomKey];
}

async function processRandom(names) {
  let results = [];
  for (let i = 0; i < names.length; i++) {
    let champion = await getRandomChamp();
    if (results.length > 0) {
      exists = true
      while (exists) {
        var existing = results.find(r => r.champion.name === champion.name);
        if (existing) {
          champion = await getRandomChamp();
        } else {
          exists = false;
        }
      }
    }
    results.push({ name: names[i], champion: champion });
  }

  let messages = [];
  for (let i = 0; i < results.length; i++) {
    let message = ''
    if (results[i].name) {
      message += `${results[i].name}: `;
    }
    message += `${results[i].champion.name}`;
    messages.push(message);
  }

  return messages;
}

function getNameArgs(input) {
  const matches = input.match(/(--names) .*/g);
  if (!matches || matches.length != 1) {
    return ['']
  }

  return trimStrings(input.replace('--names ', '').split(','));
}

function trimStrings(strings) {
  for (let i = 0; i < strings.length; i++) {
    strings[i] = strings[i].trim();
  }
  return strings;
}

function printMessages(msg, messages) {
  let message = '';
  for (let i = 0; i < messages.length; i++) {
    message += messages[i] + '\r\n'
  }
  msg.reply(message);
}

client.on('messageCreate', async msg => {
  // dont respond to bots
  if (msg.author.bot) {
    return;
  }

  if (msg.content.startsWith("!random")) {
    const message = msg.content.replace('!random ', '');
    const messages = await processRandom(getNameArgs(message));
    printMessages(msg, messages);
  }
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// TODO: move to github secret
client.login('OTI1NDI1Mzk5MTA4ODk0Nzkx.Ycs7kA.fOPMSgNOAnMlrmaVbNBXqDMhmro');