import { userProfileCanvas } from "../../utils/canvas/userProfile.js";
import { config, client } from "../../index.js";
import { Constants } from "eris"
import {userToEmbedAuthor} from "../../lib/structures/Embed.js";

export const command = {
    name: 'user',
    description: 'Wyświetla informacje o użytkowniku',
    options: [
        {
            name: 'user',
            description: 'Użytkownik o jakim chcesz dostać informacje',
            type: Constants.ApplicationCommandOptionTypes.USER,
            required: false,
        },
    ],
    execute: async (interaction, options) => {
        const memberID = options.get("user") || interaction.member.id;
        if(!memberID) return

        const member = await client.getRESTGuildMember(interaction.guildID, memberID)
        const devices = Object.keys(member.clientStatus || {}).map((d) => config.emoji.device[d]);

        const attachment = { file: await userProfileCanvas(member), name: 'profil.png' };

        const roles = member.roles.sort(
            (a, b) => member.guild.roles.get(b).position - member.guild.roles.get(a).position
        );

        const role = member.guild.roles.get(roles[0])

        const fields = [
            { name: 'Identyfikator:', value: member.id, inline: true },
            { name: 'Wzmianka:', value: `<@${member.id}>`, inline: true,},
            { name: 'Zdjęcie:',
                value: `[Profilowe](${member.user.avatarURL})${
                    member.avatarURL ? '' : `, [Serwerowe](${member.avatarURL})`
                }`,
                inline: false,
            },
            {
                name: 'Dołączył do serwera:',
                value: `<t:${Math.round(member.joinedAt / 1000)}:d>`,
                inline: true,
            },
            {
                name: 'Dołączył do discorda:',
                value: `<t:${Math.round(member.user.createdAt / 1000)}:d>`,
                inline: true,
            },
            {
                name: 'Aktywność:',
                value: devices.length !== 0 ? devices.join(' ') : 'Użytkownik nie jest aktywny',
                inline: false,
            },
        ]

        if (member.voiceState?.channelID) {
            let value = `${member.voiceState.mute}`;
            if (member.voiceState.mute) value += ` ${config.emoji.voice.serverMute}`;
            else if (member.voiceState.selfMute) value += ` ${config.emoji.voice.selfMute}`;

            if (member.voiceState.deaf) value += ` ${config.emoji.voice.serverDeaf}`;
            else if (member.voiceState.selfDeaf) ` ${config.emoji.voice.selfDeaf}`;

            if (member.voiceState.selfStream) value += ` ${config.emoji.voice.streaming}`;

            fields.push({
                name: 'Połączony:',
                value,
                inline: true
            });
        }

        const embed = {
            color: role.color,
            image: { url: "attachment://profil.png" },
            author: userToEmbedAuthor(interaction.member),
            fields
        }

        await interaction.createFollowup({ embed }, attachment);
    },
};
