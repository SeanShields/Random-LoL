import axios from 'axios';
import Discord from 'discord.js';
import banned from './banned.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });
const dataVersionsUrl = 'https://ddragon.leagueoflegends.com/api/versions.json';
let CHAMPIONS = {};
let VERSIONS = [];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

async function getChampionDataUrl() {
  if (!VERSIONS.length) {
    await fetchVersions();
  }
  return `http://ddragon.leagueoflegends.com/cdn/${VERSIONS[0]}/data/en_US/champion.json`
}

async function fetchChamps() {
  const url = await getChampionDataUrl();
  return axios.get(url).then((response) => {
    CHAMPIONS = response.data.data;
  });
}

function fetchVersions() {
  return axios.get(dataVersionsUrl).then((response) => {
    VERSIONS = response.data;
  });
}

async function getRandomChamp(ignore) {
  if (!Object.keys(CHAMPIONS).length) {
    await fetchChamps();
  }

  const randomIndex = getRandomInt(0, Object.keys(CHAMPIONS).length);
  const randomKey = Object.keys(CHAMPIONS)[randomIndex];
  return CHAMPIONS[randomKey];
}

async function processRandom(names, excludeBanned) {
  let results = [];
  for (let i = 0; i < names.length; i++) {
    let champion = await getRandomChamp();
    if (results.length > 0) {
      let exists = true
      while (exists) {
        const isExisting = results.find(r => r.champion.name === champion.name);
        const isBanned = excludeBanned && stringExists(banned, champion.name);
        if (isExisting || isBanned) {
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

function stringExists(arr, str) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].toUpperCase() === str.toUpperCase()) {
      return true;
    }
  }
  return false;
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

  if (msg.content.startsWith('!random')) {
    let message = msg.content.replace('!random ', '');
    const excludeBanned = msg.content.includes('--banned');
    if (excludeBanned) {
      message = message.replace('--banned', '');
    }

    const messages = await processRandom(getNameArgs(message), excludeBanned);
    if (excludeBanned) {
      messages.push('', '(banned champions excluded)')
    }
    
    printMessages(msg, messages);
  } else if (msg.content.startsWith('!banned')) {
    printMessages(msg, banned.sort());
  }
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.BOT_KEY);