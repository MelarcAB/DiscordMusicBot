const { Client, GatewayIntentBits, Partials , Events} = require("discord.js");
const { Poru } = require("poru");
const fs = require('fs');
require('dotenv').config();

const nodes = [
  {
    name: "local-node",
    host: "194.163.135.84",
    port: 2333,
    password: "youshallnotpass",
    secure: false
  },
];

const PoruOptions = {
    library: "discord.js",
    reconnectTime: 0,
    resumeKey: "MyPlayers",
    resumeTimeout: 60,
    clientID: 'cb41529dc3bd4d8f8a240dbee0fff4e8',
    clientSecret: 'bcca82f42930498aa385a8289fdf276b',
    playlistLimit: 5,
    send(guildId, payload) {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload)
    }
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents
    ],
    partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message],
    allowedMentions: {
        parse: ["roles", "users"],
        repliedUser: false,
    }
});

client.poru = new Poru(client, nodes, PoruOptions);

client.poru.on("trackStart", (player, track) => {
  const channel = client.channels.cache.get(player.textChannel);
  return channel.send(`Now playing \`${track.info.title}\``);
});

client.once(Events.ClientReady, c => {
  console.log(`Bot conectado: ${c.user.tag}`);
});

client.on("messageCreate", (message) => {
    console.log(message.content);

    if (message.content === "<@1023320497469005938>") {
        message.reply("Hey!");
        return;
    }

    if (!message.content.startsWith('!')) return;

    const args = message.content.slice(1).split(" ");
    const command = args.shift().toLowerCase();

    if (commands[command]) {
        commands[command](args, message, client.poru);
    }
});

client.login(process.env.TOKEN);
