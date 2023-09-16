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
  if (message.content.toLowerCase() === "!hola") {
    if (!message.member.voice.channel) {
      return message.reply("¡Debes estar en un canal de voz para usar este comando!");
    }

    const trackURL = "https://www.youtube.com/watch?v=dtD_xGvkWLk";
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
  }
});

client.login(process.env.TOKEN); 