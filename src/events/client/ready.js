const chalk = require('chalk');
const config = require('../../config/config.json');

module.exports = {
    name: 'ready',
    run: async (client) => {
        console.log(
            chalk.hex(config.color.red)(
                chalk.hex(config.color.yellow)(client.user.username + '#' + client.user.discriminator) +
                    ' jest gotowy do działania! Obsługuje już ' +
                    chalk.hex(config.color.yellow)(client.users.cache.size) +
                    ' użytkowników na ' +
                    chalk.hex(config.color.yellow)(client.guilds.cache.size) +
                    ' serwerach'
            )
        );

        const commands = client.commands.toJSON();

        // client.guilds.cache.map(async ({ commands }) => {
        //     commands.set(commands);
        // })
        client.guilds.cache.get(config.guild).commands.set(commands);
    },
};
