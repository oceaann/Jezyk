import chalk from "chalk";
import { config, client, commands } from "../../index.js"

const name = 'ready'
const run = async () => {
    console.log(
        chalk.hex(config.color.red) (
            chalk.hex(config.color.yellow)(client.user.username + '#' + client.user.discriminator) +
            ' jest gotowy do działania! Obsługuje już ' +
            chalk.hex(config.color.yellow)(client.users.size) + ' użytkowników na ' +
            chalk.hex(config.color.yellow)(client.guilds.size) + ' serwerach'
        )
    );

    // client.guilds.cache.map(async ({ commands }) => {
    //     commands.set(commands);
    // })
    const rawCommands = commands
        .map(({ name, description, options }) => ({ name, description, options, type: 1 }));

    await client.bulkEditGuildCommands(config.guild, rawCommands);

};

export { name, run }