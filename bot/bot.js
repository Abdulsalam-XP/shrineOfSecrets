import pkg from 'discord.js';
import dotenv from 'dotenv'; // Import dotenv package to load variables from .env file
const { Client, GatewayIntentBits } = pkg;
import axios from 'axios';

// Load environment variables from .env file
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Required for reading message content
  ],
});

const token = process.env.shrineOfSecrets_token;  // Use token from .env file
const channelId = '1296008228139958315';  // Replace with the channel ID you want the bot to send messages to

// Login to Discord
client.login(token);

// Function to fetch data from your API and send it to a Discord channel
async function sendPerkUpdate() {
    try {
      const response = await axios.get('https://shrine-of-secrets-rosy.vercel.app/api/shrineOfSecrets.js');
      const data = response.data;
  
      // Format the perks into fields for the embed
      const embedFields = data.perks.map(perk => ({
        name: `Perk: ${perk.perkName}`,
        value: `Character: ${perk.characterName}`,
        inline: false, // Keep perks in separate rows
      }));
  
      const channel = await client.channels.fetch(channelId);
  
      // Create the embed message
      const embedMessage = {
        color: 0x00ff00, // Green color
        title: "This Week's Perks",
        description: "Here are the weekly perks available in the Shrine of Secrets:",
        fields: embedFields,
        footer: {
          text: "Expiration: " + data.expirationDate,
        },
      };
  
      // Send the embed
      channel.send({ embeds: [embedMessage] });
    } catch (error) {
      console.error('Error fetching perk data:', error);
    }
}

// Run sendPerkUpdate every 1 hour (3600000 milliseconds)
client.once('ready', () => {
  console.log('Bot is ready!');
  setInterval(sendPerkUpdate, 3600);  // 1 hour in milliseconds
});
