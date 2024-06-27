const fetch = require('node-fetch');
const Promise = require('bluebird')
const fs = require('fs')
const moment = require('moment')
const environment = require('../environment')

const NASA_ROVER_API_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers`;
const PHOTO_STATE_FILENAME = './.photo_read_state.json'

class RoverPhotoScraper {
  rovers = [ 'curiosity', 'perseverance', 'opportunity', 'spirit' ]

  rovers = {
    perseverance: {
      color: 0xFF5733,
      icon: 'https://mars.nasa.gov/layout/mars2020/images/PIA23764-RoverNamePlateonMars-web.jpg'
    },
    curiosity: {
      color: 0xA52A2A,
      icon: 'https://mars.nasa.gov/system/feature_items/images/6037_msl_banner.jpg'
    },
    opportunity: {
      color: 0xFFD700,
      icon: 'https://cdn.mos.cms.futurecdn.net/nmZohGRNKTUHu5834T3KYF.jpg'
    },
    spirit: {
      color: 0xB7410E,
      icon: 'https://smd-cms.nasa.gov/wp-content/uploads/2023/07/rover2-1.jpg'
    }
  }

  lastPostedPhotoIds = {
    curiosity: 0,
    perseverance: 0,
    opportunity: 0,
    spirit: 0
  };

  async initialize() {
    if (fs.existsSync(environment.PHOTO_STATE_FILENAME)) {
      const fileContent = await fs.promises.readFile(environment.PHOTO_STATE_FILENAME, 'utf8')
      this.lastPostedPhotoIds = JSON.parse(fileContent)
    } else {
      await fs.promises.writeFile(PHOTO_STATE_FILENAME, JSON.stringify(this.lastPostedPhotoIds))
    }
  }

  async fetchPhotosForRover(rover) {
    const response = await fetch(`${environment.NASA_ROVER_API_URL}/${rover}/latest_photos?api_key=${environment.NASA_API_KEY}`);
    const feed = await response.json();

    if (!feed.latest_photos || !feed.latest_photos.length) {
      console.error(`${rover} Issue getting feed!`);
      return null
    }

    return feed.latest_photos
  }

  async postPhotosForRover(rover, photos, onSend) {
    if (!photos) return this.lastPostedPhotoIds[rover]

    const newPhotos = photos.filter(photo => photo.id > this.lastPostedPhotoIds[rover])

    console.log(`${rover} | New photos since last batch:`, newPhotos.length)

    // Only 10 embeds allowed per message
    this.chunkPhotos(newPhotos).forEach(chunk => {
      const message = chunk.map(newPhoto => ({
        author: {
          name: newPhoto.rover.name,
          icon_url: this.rovers[rover].icon
        },
        fields:[
          { name: 'SOL', value: newPhoto.sol, inline: true },
          { name: 'Camera', value: newPhoto.camera.full_name, inline: true },
          { name: 'Abbrev.', value: newPhoto.camera.name, inline: true }
        ],
        color: this.rovers[rover].color,
        image: { url: newPhoto.img_src },
      }))

      onSend({ embeds: message })
    })

    if (newPhotos.length) {
      this.lastPostedPhotoIds[rover] = newPhotos[newPhotos.length - 1].id
    }

    console.log(`${rover} | Finished posting photo batch. Latest posted ID is ${this.lastPostedPhotoIds[rover]}`)
  }

  async fetchAndPostPhotosForRover(rover, onSend) {
    const photos = await this.fetchPhotosForRover(rover);

    await this.postPhotosForRover(rover, photos, onSend)
  }

  async fetchAndPostPhotosForAllRovers(onSend) {
    console.log("\n----------------- STARTING ROVER VISUALIZATION BATCH -----------------")
    console.log(`Batch timestamp: ${moment().format('MM-DD-YYYY hh:mm:ss')} \n`)

    await Promise.map(Object.keys(this.rovers), async rover => {
      return await this.fetchAndPostPhotosForRover(rover, onSend)
    }, { concurrency: 1 }).then(async () => {
      console.log("\n----------------- END OF ROVER VISUALIZATION BATCH ----------------- \n")
      await fs.promises.writeFile(environment.PHOTO_STATE_FILENAME, JSON.stringify(this.lastPostedPhotoIds))
    })
  }

  chunkPhotos(photos) {
    const chunkSize = 10
    const result = []

    for (let i = 0; i < photos.length; i += chunkSize) {
      result.push(photos.slice(i, i + chunkSize))
    }

    return result
  }
}

module.exports = RoverPhotoScraper
