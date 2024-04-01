const Discord = require('discord.js');
const dotenv = require('dotenv');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { askGemini } = require('./src/models/gemini');
const commands = require('./src/commands/commands');

// Load environment variables from .env file
dotenv.config();

// Create a new Discord client

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
}); 

// Listen for messages
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ activities: [{ name: "I'm a Wizard" }], status: 'online' });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    for (const command of commands) {
        if (interaction.commandName === command.data.name) {
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply('Sorry, there was an error executing this command!');
            }
            break;
        }
    }
});

client.on('messageCreate', async message => { // Change from interactionCreate
    console.log('Message Received:', message.content);
    // Ignore non-prefix commands or bot's own messages
    if (!message.content.startsWith('!ask') || message.author.bot) return;
    console.log('Prefix Command Detected!');

    // Process the command
    const args = message.content.slice('!ask'.length).trim().split(' ');
    const question = args.join(' ');
    console.log('Question:', question);

    // Check if the Bot was mentioned (Optional)
    if (message.mentions.has(client.user) && question) {
        console.log('Mention Command Detected!');

        try {
            const response = await askGemini(question);
            await message.reply(response);
        } catch (error) {
            console.error('Error with Gemini:', error);
            await message.reply('Sorry, I was unable to generate a response.');
        }
    } else if (question) { // Just prefix
        try {
            const response = await askGemini(question);
            await message.reply(response);
        } catch (error) {
            console.error('Error with Gemini:', error);
            await message.reply('Sorry, I was unable to generate a response.');
        }
    } else {
        // Handle case if no question is provided
        await message.reply("Please provide a question to ask BingBot The Wizard!");
    }
});

// Listen for messages
client.login(process.env.DISCORD_BOT_TOKEN);

