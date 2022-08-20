import { createCanvas, loadImage } from 'canvas';
import axios from 'axios';
import domcolor from 'domcolor';
import { Constants } from "eris";
const { UserFlags: {
    DISCORD_STAFF, PARTNER, HYPESQUAD, BUG_HUNTER_LEVEL_1, BUG_HUNTER_LEVEL_2,
    HYPESQUAD_ONLINE_HOUSE_1, HYPESQUAD_ONLINE_HOUSE_2, HYPESQUAD_ONLINE_HOUSE_3,
    PREMIUM_EARLY_SUPPORTER, VERIFIED_DEVELOPER, CERTIFIED_MODERATOR
} } = Constants

const flags = {
    [DISCORD_STAFF]: './src/utils/canvas/images/discordStaff.png',
    [PARTNER]: './src/utils/canvas/images/discordPartner.png',
    [HYPESQUAD]: './src/utils/canvas/images/hypesquadEvents.png',
    [BUG_HUNTER_LEVEL_1]: './src/utils/canvas/images/bugHunter.png',
    [HYPESQUAD_ONLINE_HOUSE_1]: './src/utils/canvas/images/braveryHouse.png',
    [HYPESQUAD_ONLINE_HOUSE_2]: './src/utils/canvas/images/brillanceHouse.png',
    [HYPESQUAD_ONLINE_HOUSE_3]: './src/utils/canvas/images/balanceHouse.png',
    [PREMIUM_EARLY_SUPPORTER]: './src/utils/canvas/images/earlySupporter.png',
    [BUG_HUNTER_LEVEL_2]: './src/utils/canvas/images/bugHunter2.png',
    [VERIFIED_DEVELOPER]: './src/utils/canvas/images/verifiedDeveloper.png',
    [CERTIFIED_MODERATOR]: './src/utils/canvas/images/discordModerator.png',
    NitroUser: './src/utils/canvas/images/nitroUser.png',
    ServerBooster: './src/utils/canvas/images/serverBoost.png',
};

const returnBuffer = async (url) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'utf-8');
}

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

export const userProfileCanvas = async (member) => {
    const { user } = member;

    const canvas = createCanvas(960, 650);
    const ctx = canvas.getContext('2d');

    const avatar = await loadImage(user.avatarURL);

    if (user.banner) {
        const banner = await loadImage(user.bannerURL({ extension: 'png' }));
        ctx.drawImage(banner, 0, 0, canvas.width, (canvas.height * 60) / 100);
    } else if (user.accentColor) {
        ctx.fillStyle = `#${user.accentColor.toString(16)}`;
        ctx.fillRect(0, 0, canvas.width, (canvas.height * 60) / 100);
    } else {
        let color = await domcolor(await returnBuffer(user.avatarURL));
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

    const badges = [];

    const nitro = user.avatar.match(/^a_/) || user.banner || discriminators.includes(user.discriminator);
    if (nitro) badges.push('NitroUser');

    if (member.premiumSince) badges.push('ServerBooster');

    let i = 0;
    for (const [flag, path] of Object.entries(flags)) {
        if (!badges.includes(flag) && (user.publicFlags & flag) === 0) continue
        const image = await loadImage(path);
        ctx.drawImage(image, canvas.width - 20 - 64 * (i + 1), (canvas.height * 62.5) / 100, 64, 64);
        i++
    }

    if (user.bot) {
        const bot = await loadImage(`./src/utils/canvas/images/${
            user.publicFlags & Constants.UserFlags.VERIFIED_BOT ? "verifiedBot" : "bot"
        }.png`)

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
