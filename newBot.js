const { Client, GatewayIntentBits } = require("discord.js");
const { Poru } = require("poru");
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

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

client.on("messageCreate", async (message) => {
    const msg = message.content.toLowerCase();
    const msg_raw = message.content;
    if (!msg.startsWith("!")) return;
    console.log(msg);
    //obtener la primera palabra del mensaje y validar si empieza con !
    const command = msg.split(" ")[0].substring(1);
    let trackURL = "https://www.youtube.com/watch?v=dtD_xGvkWLk";

    switch (command) {
        case "play":

            //validar que hay un segundo parametro
            if (msg.split(" ").length < 2) {
                message.reply("¡Debes proporcionar un link!");
                return;
                break;
            }

            //validar que el usuario este en un canal de voz
            if (!message.member.voice.channel) {
                message.reply("¡Debes estar en un canal de voz para usar este comando!");
                return;
                break;
            }

            //obtener el link de la cancion
            trackURL = msg_raw.split(" ")[1];
            console.log(trackURL);
            //validar que el link sea de youtube
            if (!trackURL.includes("youtube")) {
                message.reply("¡Debes proporcionar un link de youtube!");
                return;
                break;
            }

            //validar que el link sea valido
            const res = await client.poru.resolve(trackURL);
            if (res.loadType === "LOAD_FAILED" || res.loadType === "NO_MATCHES") {
                return message.reply("Hubo un error al cargar la canción.");
            }

            //crear la conexion
            const player = client.poru.createConnection({
                guildId: message.guild.id,
                voiceChannel: message.member.voice.channelId,
                textChannel: message.channel.id,
                deaf: true,
            });

            //agregar la cancion a la cola
            const track = res.tracks[0];
            track.info.requester = message.author;
            player.queue.add(track);

            //reproducir la cancion
            if (!player.isPlaying && player.isConnected) player.play();
            break;



        default:
            //no responder, ya que no es un comando
            //message.reply("Comando no encontrado");
            break;
    }
    /*
        if (message.content.toLowerCase() === "!hola") {
            if (!message.member.voice.channel) {
                return message.reply("¡Debes estar en un canal de voz para usar este comando!");
            }
    
            const res = await client.poru.resolve(trackURL);
    
            if (res.loadType === "LOAD_FAILED" || res.loadType === "NO_MATCHES") {
                return message.reply("Hubo un error al cargar la canción.");
            }
    
            const player = client.poru.createConnection({
                guildId: message.guild.id,
                voiceChannel: message.member.voice.channelId,
                textChannel: message.channel.id,
                deaf: true,
            });
    
            const track = res.tracks[0];
            track.info.requester = message.author;
            player.queue.add(track);
    
            if (!player.isPlaying && player.isConnected) player.play();
        }*/
});

client.login(process.env.TOKEN); 