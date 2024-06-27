const { parentPort } = require('worker_threads')
const RoverPhotoScraper = require('../RoverPhotoScraper')
const environment = require('../../environment')

const roverPhotoScraper = new RoverPhotoScraper()

new Promise(async (res) => {
  await roverPhotoScraper.initialize()
  // Infinitely loop and post photos
  while (true) {
    roverPhotoScraper.fetchAndPostPhotosForAllRovers(msg => parentPort.postMessage(msg))

    // Wait for 3 hours before fetching again
    await new Promise(resolve => setTimeout(resolve, environment.ROVER_PHOTO_FREQUENCY_MS));
  }
})