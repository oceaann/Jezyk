module.exports = {
    name: 'interactionCreate',
    run: async (client, interaction) => {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return interaction.reply('nie działam bo sie zepsułem a discord zepsuł jeszcze bardziej');

            command.execute({ client, interaction });
        }
    },
};
