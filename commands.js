// commands.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('ask')
            .setDescription('Ask a question to BingBot The Wizard!')
            .addStringOption(option =>
                option.setName('question')
                    .setDescription('The question to ask BingBot The Wizard')
                    .setRequired(true)
            ),
        async execute(interaction) {
            // ... (We'll move your command logic here shortly)
            if (interaction.commandName === 'ask') {
                const question = interaction.options.getString('question');

                // Optional: Retrieve image attachments if needed:
                const imageAttachments = interaction.options.getAttachments();
                const imagePaths = imageAttachments.map(a => a.url); // This is a simple example

                try {
                    const response = await askGemini(question, imagePaths);
                    await interaction.reply(response);
                } catch {
                    await interaction.reply('Sorry, I was unable to generate a response.');
                }
            }
        },
    },
];
