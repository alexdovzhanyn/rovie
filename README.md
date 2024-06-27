
# Rovie

Rovie is a Discord bot developed to enhance user engagement in the Space Station Discord server by leveraging NASA's API for space-related information.

## Features

- **NASA API Integration**: Connects to NASA's API to fetch and display real-time imagery from mars rovers Curiosity, Perseverance, Opportunity, and Spirit.

## Installation

To set up Rovie on your local machine, follow these steps:

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/alexdovzhanyn/rovie.git
   ```
2. **Navigate to the Project Directory**:
   ```sh
   cd rovie
   ```
3. **Install the Dependencies**:
   ```sh
   npm install
   ```

## Configuration

Before running the bot, you need to set up the environment configuration file:

1. **CSet Up the Env Configuration**:
   In the root directory of the project, rename the file named `_env.json` to `env.json`. Update the file with:
   ```json
   {
     "DISCORD_BOT_TOKEN": "your_discord_bot_token",
     "DISCORD_CHANNEL_ID": "your_discord_channel_id",
     "NASA_API_KEY": "your_nasa_api_key"
   }
   ```
   - By default, the rover photo fetching will run once every 3 hours. If you'd like to fetch more often than that,
   change `ROVER_PHOTO_FREQUENCY_MS` to something else (in milliseconds).

## Usage

To start the bot, execute the following command in your terminal:
```sh
npm start
```

## Contributing

Contributions to Rovie are welcome! If you have any ideas for new features or improvements, feel free to open an issue or submit a pull request.

### Steps to Contribute

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push your branch to GitHub.
4. Open a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any questions or feedback, please reach out to [alexdovzhanyn](https://github.com/alexdovzhanyn).
