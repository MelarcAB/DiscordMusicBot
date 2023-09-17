const { Client, GatewayIntentBits } = require("discord.js");
const { Poru } = require("poru");
const fs = require('fs');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

// Inicializando Poru

const nodes = [
    {
        name: "local-node",
        host: "194.163.135.84",
        port: 2333,
        password: "youshallnotpass",
    },
];
const PoruOptions = {
    library: "discord.js",
};
client.poru = new Poru(client, nodes, PoruOptions);

client.poru.on("trackStart", (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    return channel.send(`Now playing \`${track.info.title}\``);
});

client.once("ready", () => {
    console.log("Ready!");
    client.poru.init(client);
});

// Cargar comandos
client.commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);
    try {
        command.execute(message, args, client); // Pasamos el cliente para poder acceder a Poru y otras funciones del bot
    } catch (error) {
        console.error(error);
        message.reply('Hubo un error ejecutando ese comando.');
    }
});

client.login(process.env.TOKEN);
