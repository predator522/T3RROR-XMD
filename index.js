const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const pino = require("pino");
const NodeCache = require("node-cache");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")
const pino = require("pino")
const settings = require("./settings")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session")
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        browser: [settings.botName, "Chrome", settings.version]
    })

    // request pairing code if no creds yet
    if (!sock.authState.creds.registered) {
        const code = await sock.requestPairingCode(settings.ownerNumber)
        console.log("🔑 Your Pairing Code:", code)
    }

    sock.ev.on("creds.update", saveCreds)

    // Example handler: reply "pong" when user sends ".ping"
    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return

        const from = msg.key.remoteJid
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text

        if (body === ".ping") {
            await sock.sendMessage(from, { text: "pong ✅" }, { quoted: msg })
        }
    })
}

startBot()
