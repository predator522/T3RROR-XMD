const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const pino = require("pino");
const NodeCache = require("node-cache");
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");

// Load settings
global.botname = "T3RROR XMD";
global.ownername = "ShΔdow";
global.prefix = ".";

// Load commands dynamically
const commands = new Map();
const commandPath = path.join(__dirname, "commands");
fs.readdirSync(commandPath).forEach(file => {
    const cmd = require(path.join(commandPath, file));
    commands.set(cmd.name, cmd);
});

// Start bot
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");
    const { version } = await fetchLatestBaileysVersion();
    const msgRetryCounterCache = new NodeCache();

    const client = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        printQRInTerminal: true,
        auth: state,
        msgRetryCounterCache
    });

    client.ev.on("messages.upsert", async ({ messages }) => {
        try {
            const msg = messages[0];
            if (!msg.message) return;
            if (msg.key.remoteJid === "status@broadcast") return;

            const textMsg = msg.message.conversation || msg.message.extendedTextMessage?.text;
            if (!textMsg) return;

            if (!textMsg.startsWith(global.prefix)) return;

            const args = textMsg.slice(global.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            if (commands.has(commandName)) {
                await commands.get(commandName).execute(client, msg, args);
            }
        } catch (err) {
            console.error("❌ Command error:", err);
        }
    });

    client.ev.on("creds.update", saveCreds);

    console.log(chalk.green(`${global.botname} is running...`));
}

startBot().catch(err => console.error("Fatal error:", err));
