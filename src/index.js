require('dotenv/config');

const { Client: BaseClient, GatewayIntentBits, Collection } = require('discord.js');
const { promisify } = require('util');
const glob = require('glob');
const config = require('./config/config.json');
const Embed = require('./lib/structures/Embed');

const globPromise = promisify(glob);

class Client extends BaseClient {
    constructor() {
        super({
            intents: Object.values(GatewayIntentBits),
            presence: {
                activities: [
                    {
                        type: config.status.type,
                        url: config.status.url,
                        name: config.status.name,
                    },
                ],
            },
            partials: ['User', 'Channel', 'GuildMember', 'Message', 'Reaction', 'GuildScheduledEvent', 'ThreadMember'],
        });

        this.commands = new Collection();
        this.embed = Embed;

        this.start();
    }

    async start() {
        await this.handler();
        await this.login(process.env.TOKEN);
    }

    async handler() {
        const commands = await globPromise(`./src/commands/*/*.js`);
        commands.forEach(async (path) => {
            const command = require(`${process.cwd()}/${path}`);
            this.commands.set(command.name, command);
        });

        const events = await globPromise('./src/events/*/*.js');
        events.forEach(async (path) => {
            const event = require(`${process.cwd()}/${path}`);
            this.on(event.name, async (...args) => event.run(this, ...args));
        });
    }
}

module.exports = new Client();
