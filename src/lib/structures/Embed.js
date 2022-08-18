const { EmbedBuilder } = require('discord.js');

module.exports = class Embed extends EmbedBuilder {
    constructor(user) {
        super();

        this.user = user;

        this.setAuthor({
            name: this.user.tag,
            iconURL: this.user.displayAvatarURL(),
        });
    }
};
