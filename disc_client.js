const { Client, GatewayIntentBits,Events } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
require('dotenv').config();

const ytdl = require('ytdl-core');
const commands = require("./commands.js");

const client = new Client({ intents: [ 
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,] });
  
const player = createAudioPlayer();

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});


client.on("messageCreate", (message) => {
    console.log(message.content);
    if (message.content === "<@1023320497469005938>") {
      message.reply("Hey!")
    } 
    });
    


client.login(process.env.TOKEN);
