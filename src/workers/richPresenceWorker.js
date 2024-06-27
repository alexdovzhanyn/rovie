const { parentPort } = require('worker_threads')
const { ActivityType } = require('discord.js')
const environment = require('../../environment')

const possibleStatuses = [
  'Playing with mach diamonds',
  'Exploring quantum realms',
  'Debugging the universe',
  'Warping through time complexity',
  'Deciphering alien algorithms',
  'Processing data from the outer rim',
  'Admiring the rings of Saturn',
  'Satellite surfing in orbit'
]

new Promise(async () => {
  // Infinitely loop and update presence
  while (true) {
    parentPort.postMessage({
      activities: [{
        name: possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)],
        type: ActivityType.Custom,
      }],
      status: 'online'
    })

    // Wait 10 seconds before updating
    await new Promise(resolve => setTimeout(resolve, environment.RICH_PRESENCE_FREQUENCY_MS));
  }
})