const { ApplicationCommandOptionType, ClientUser, AttachmentBuilder } = require('discord.js');
const userProfileCanvas = require('../../utils/canvas/userProfile');
const config = require('../../config/config.json');
const { guilds } = require('../..');

module.exports = {
    name: 'user',
    description: 'Wyświetla informacje o użytkowniku',
    options: [
        {
            name: 'user',
            description: 'Użytkownik o jakim chcesz dostać informacje',
            type: ApplicationCommandOptionType.User,
            required: false,
        },
    ],
    execute: async ({ client, interaction }) => {
        const member = interaction.options.getMember('user') ? interaction.options.getMember('user') : interaction.member;
        let devices = [];

        if (member?.presence?.clientStatus && member.presence !== null)
            await Object.keys(member.presence.clientStatus).map((device) => {
                devices.push(config.emoji.device[device]);
            });

        const user = await client.users.fetch(member.user.id, { force: true });
        const memberUser = await interaction.guild.members.fetch(member.user.id, { force: true });
        const attachment = new AttachmentBuilder(await userProfileCanvas(user, memberUser), {
            name: 'Profil.png',
        });

        const embed = new client.embed(user)
            .setColor(member.roles.highest.color)
            .setImage(`attachment://${attachment.name}`)
            .addFields([
                {
                    name: 'Identyfikator:',
                    value: user.id,
                    inline: true,
                },
                {
                    name: 'Wzmianka:',
                    value: member.toString(),
                    inline: true,
                },
                {
                    name: 'Zdjęcie:',
                    value: `[Profilowe](${member.user.displayAvatarURL()})${
                        user.displayAvatarURL() === member.displayAvatarURL()
                            ? ''
                            : `, [Serwerowe](${member.displayAvatarURL()})`
                    }`,
                    inline: false,
                },
                {
                    name: 'Dołączył do serwera:',
                    value: `<t:${Math.round(member.joinedTimestamp / 1000)}:d>`,
                    inline: true,
                },
                {
                    name: 'Dołączył do discorda:',
                    value: `<t:${Math.round(member.user.createdTimestamp / 1000)}:d>`,
                    inline: true,
                },
                {
                    name: 'Aktywność:',
                    value: devices.length !== 0 ? devices.join(' ') : 'Użytkownik nie jest aktywny',
                    inline: false,
                },
            ]);

        if (member.voice.channel) {
            let value = `${member.voice.channel}`;
            if (member.voice.serverMute) value += ` ${config.emoji.voice.serverMute}`;
            else if (member.voice.selfMute) value += ` ${config.emoji.voice.selfMute}`;

            if (member.voice.serverDeaf) value += ` ${config.emoji.voice.serverDeaf}`;
            else if (member.voice.selfDeaf) ` ${config.emoji.voice.selfDeaf}`;

            if (member.voice.streaming) value += ` ${config.emoji.voice.streaming}`;

            embed.addFields([
                {
                    name: 'Połączony:',
                    value,
                    inline: true,
                },
            ]);
        }

        interaction.reply({
            embeds: [embed],
            files: [attachment],
        });
    },
};
