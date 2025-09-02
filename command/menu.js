module.exports = {
    name: "menu",
    description: "Show all commands",
    async execute(client, msg) {
        const menuText = `
👑 *${global.botname} MENU* 👑

⚡ System:
.menu - Show menu
.ping - Check speed
.about - Bot info

😂 Fun:
.joke - Random joke
        `;
        await client.sendMessage(msg.key.remoteJid, { text: menuText });
    }
};
