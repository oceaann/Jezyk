import { client, commands } from "../../index.js";
import { Constants } from "eris";

const name = 'interactionCreate'

const run = async (interaction) => {
    if (interaction.type === 2) {
        await interaction.defer()

        const command = commands.get(interaction.data.name);
        if (!command) return interaction.createFollowup('nie działam bo sie zepsułem a discord zepsuł jeszcze bardziej');

        const options = new Map()
        addOptions(interaction.data.options, options);

        command.execute(interaction, options);
    }
}

const addOptions = (data = [], map) => {
    for (const option of data) {
        if(data.type < Constants.ApplicationCommandOptionTypes.STRING) {
            addOptions(option.options, map)
        } else { map.set(option.name, option.value) }
    }
}

export { name, run };