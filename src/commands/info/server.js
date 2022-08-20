import { config, client } from "../../index.js";
import {userToEmbedAuthor} from "../../lib/structures/Embed.js";

export const command = {
    name: "server",
    description: "Wyświetla informacje o serwerze",
    options: [],
    execute: async (interaction, options) => {
        const { member: { guild } } = interaction
        const fields = [
            { name: 'Nazwa:', value: guild.name, inline: true },
            { name: 'Identyfikator:', value: guild.id, inline: true },
            { name: 'Opis:', value: guild.description, inline: false },
            { name: 'Aktywnosć:', value: 'test' }
        ];

        const embed = {
            color: config.color.red,
            author: userToEmbedAuthor(interaction.member),
            fields
        }

        await interaction.createMessage({ embeds: [embed] });
    },
};
