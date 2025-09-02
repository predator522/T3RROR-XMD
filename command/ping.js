module.exports = {
    name: "ping",
    description: "Check bot's response speed",
    async execute(client, msg) {
        const start = Date.now();
        await client.sendMessage(msg.key.remoteJid, { text: "Pinging..." });
        const end = Date.now();
        await client.sendMessage(msg.key.remoteJid, { text: `🏓 Pong! Speed: ${end - start}ms` });
    }
};