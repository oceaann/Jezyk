const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');
const domcolor = require('domcolor');

module.exports = async (user, member) => {
    async function returnBuffer(url) {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
        });
        return Buffer.from(response.data, 'utf-8');
    }
    let banner;

    const flags = {
        Staff: './src/utils/canvas/images/discordStaff.png',
        Partner: './src/utils/canvas/images/discordPartner.png',
        Hypesquad: './src/utils/canvas/images/hypesquadEvents.png',
        BugHunterLevel1: './src/utils/canvas/images/bugHunter.png',
        HypeSquadOnlineHouse1: './src/utils/canvas/images/braveryHouse.png',
        HypeSquadOnlineHouse2: './src/utils/canvas/images/brillanceHouse.png',
        HypeSquadOnlineHouse3: './src/utils/canvas/images/balanceHouse.png',
        PremiumEarlySupporter: './src/utils/canvas/images/earlySupporter.png',
        BugHunterLevel2: './src/utils/canvas/images/bugHunter2.png',
        VerifiedDeveloper: './src/utils/canvas/images/verifiedDeveloper.png',
        CertifiedModerator: './src/utils/canvas/images/discordModerator.png',
        NitroUser: './src/utils/canvas/images/nitroUser.png',
        ServerBooster: './src/utils/canvas/images/serverBoost.png',
    };

    const discriminators = [
        '1111',
        '2222',
        '3333',
        '4444',
        '5555',
        '6666',
        '7777',
        '8888',
        '9999',
        '0001',
        '1337',
        '1234',
        '4321',
        '2137',
        '6969',
        '4200',
    ];

    const canvas = createCanvas(960, 650);
    const ctx = canvas.getContext('2d');

    avatar = await loadImage(user.displayAvatarURL({ size: 4096, extension: 'png' }));
    if (user.banner) {
        banner = await loadImage(user.bannerURL({ extension: 'png' }));
        ctx.drawImage(banner, 0, 0, canvas.width, (canvas.height * 60) / 100);
    } else if (user.accentColor) {
        ctx.fillStyle = `#${user.accentColor.toString(16)}`;
        ctx.fillRect(0, 0, canvas.width, (canvas.height * 60) / 100);
    } else {
        let color = await domcolor(await returnBuffer(user.displayAvatarURL({ size: 4096, extension: 'png' })));
        ctx.fillStyle = `#${color.hex}`;
        ctx.fillRect(0, 0, canvas.width, (canvas.height * 60) / 100);
    }

    ctx.fillStyle = '#18191c';
    ctx.fillRect(0, (canvas.height * 60) / 100, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(248, 355, 150, 0, 20, false);
    ctx.fill();

    ctx.font = 'bold 40px ABC Ginto Normal';
    ctx.fillStyle = 'white';
    ctx.fillText(user.username, (canvas.width * 25) / 100 / 2, (canvas.height * 85) / 100);

    ctx.fillStyle = '#b9bbbe';
    ctx.fillText(
        `#${user.discriminator}`,
        (canvas.width * 25) / 100 / 2 + ctx.measureText(user.username).width,
        (canvas.height * 85) / 100
    );

    let badges = user.flags.toArray();

    let nitro;
    if (user.avatar.match(/^a_/)) nitro = true;
    if (user.banner) nitro = true;
    discriminators.forEach((discriminator) => {
        if (discriminator == user.discriminator) nitro = true;
    });
    if (nitro) badges.unshift('NitroUser');
    if (member.premiumSinceTimestamp) badges.unshift('ServerBooster');

    for (let i = 0; i < badges.length; i++) {
        if (flags[badges[i]]) {
            let badge = await loadImage(flags[badges[i]]);
            ctx.drawImage(badge, canvas.width - 20 - 64 * (i + 1), (canvas.height * 62.5) / 100, 64, 64);
        }
    }
    if (user.bot) {
        if (badges.includes('VerifiedBot')) {
            bot = await loadImage('./src/utils/canvas/images/verifiedBot.png');
        } else {
            bot = await loadImage('./src/utils/canvas/images/bot.png');
        }
        ctx.drawImage(
            bot,
            (canvas.width * 27.5) / 100 / 2 + ctx.measureText(`${user.username}#${user.discriminator}`).width,
            (canvas.height * 77.5) / 100,
            bot.width / 8,
            64
        );
    }

    ctx.beginPath();
    ctx.arc(248, 355, 128, 0, 20, false);
    ctx.clip();

    ctx.drawImage(avatar, (canvas.width * 25) / 100 / 2, (canvas.height * 35) / 100, 256, 256);

    // ctx.beginPath();
    // ctx.arc((canvas.width * 75) / 100 / 2, (canvas.height * 68) / 100, 50, 0, 20, false);

    // let status =
    //     member?.presence?.status && member.presence !== null
    //         ? await loadImage(`./src/utils/canvas/images/${member.presence.status}.png`)
    //         : await loadImage('./src/utils/canvas/images/offline.png');

    // ctx.drawImage(status, (canvas.width * 66.7) / 100 / 2, (canvas.height * 62) / 100, 80, 80);

    return canvas.toBuffer();
};
