module.exports = {
    name: "about",
    description: "Information about the bot and owner",
    async execute(client, msg) {
        const aboutText = `
🤖 *${global.botname}*
👑 Owner: ${global.ownername}
⚡ Prefix: ${global.prefix}
📅 Date: ${new Date().toLocaleDateString()}
        `;
        await client.sendMessage(msg.key.remoteJid, { text: aboutText });
    }
};