const { Client, GatewayIntentBits } = require('discord.js');
const { Worker } = require('worker_threads')
const environment = require('./environment')

console.log('ENV', environment)

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let roverPhotoWorker
let richPresenceWorker

client.once('ready', () => {
  console.log(`\nLogged in as ${client.user.tag}`);

  new Promise(async (res) => {
    const channel = await client.channels.fetch(environment.DISCORD_CHANNEL_ID);

    res(channel)
  }).then(async (channel) => {
    roverPhotoWorker = new Worker('./src/workers/roverPhotoWorker')
    richPresenceWorker = new Worker('./src/workers/richPresenceWorker')

    richPresenceWorker.on('message', newPresence => client.user.setPresence(newPresence))
    roverPhotoWorker.on('message', async newPhotoMessage => await channel.send(newPhotoMessage))
  })
});

// Start the bot
client.login(environment.DISCORD_BOT_TOKEN);