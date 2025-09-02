module.exports = {
    name: "joke",
    description: "Send a random joke",
    async execute(client, msg) {
        const jokes = [
            "😂 Why don’t skeletons fight each other? They don’t have the guts!",
            "🤣 What do you call fake spaghetti? An impasta!",
            "😆 I told my wife she should embrace her mistakes… She gave me a hug.",
            "😂 Why did the computer go to the doctor? Because it caught a virus!"
        ];
        const random = jokes[Math.floor(Math.random() * jokes.length)];
        await client.sendMessage(msg.key.remoteJid, { text: random });
    }
};