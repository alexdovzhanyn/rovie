const fs = require('fs')

const ENV_FILE = './env.json'

let env = {}

if (fs.existsSync(ENV_FILE)) {
  const fileContent = fs.readFileSync(ENV_FILE)

  env = JSON.parse(fileContent)
}

module.exports = env