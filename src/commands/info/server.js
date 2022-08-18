const { ApplicationCommandOptionType, ClientUser, AttachmentBuilder, EmbedBuilder, Guild } = require('discord.js');
const userProfileCanvas = require('../../utils/canvas/userProfile');
const config = require('../../config/config.json');

module.exports = {
    name: 'server',
    description: 'Wyświetla informacje o serwerze',
    options: [],
    execute: async ({ client, interaction }) => {
        const embed = new client.embed(interaction.member.user).setColor(config.color.red).addFields(
            {
                name: 'Nazwa:',
                value: interaction.guild.name,
                inline: true,
            },
            {
                name: 'Identyfikator:',
                value: interaction.guild.id,
                inline: true,
            },
            {
                name: 'Opis:',
                value: interaction.guild.description,
                inline: false,
            },
            {
                name: 'Aktywnosć:',
                value: 'test',
            }
        );
        console.log(
            interaction.guild.members.cache.filter((presence) => {
                presence.status == 'online';
            }).length
        );
        console.log(
            interaction.guild.members.cache.map((user) => {
                if (user.presence) console.log(user.presence.status);
            })
        );
        interaction.reply({ embeds: [embed] });
    },
};
