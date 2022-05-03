const Discord = require('discord.js');
const config = require("./config.json");

const bot = require("./bot.js");
const { Client, Intents } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus, AudioResource, StreamType } = require('@discordjs/voice');
const player = createAudioPlayer();
const path = require("path")
const commands = require("./commands.js");


//Crear var del tipo DiscordClient
//creo variable myIntents porque no reproducia el audio
const client = new Discord.Client({
    intents: [Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
})






client.on('messageCreate', async msg => {
    let all_commands = commands.getCommands();
    let message = (msg.content)
    let command = message.slice(1, message.indexOf(" ") > 0 ? message.indexOf(" ") : message.length);
    try {
        console.log("Mensaje recibido")
        let voice_channel_id = msg.member.voice.channel.id

        //Join voice channel del usuario que envió el comando 
        if (voice_channel_id) {
            const connection = joinVoiceChannel({
                channelId: voice_channel_id,
                guildId: msg.guild.id,
                adapterCreator: msg.guild.voiceAdapterCreator
            })

            let resource = createAudioResource(path.join(__dirname, 'audio', 'sakedebinks.mp3'));
            connection.subscribe(player)

            player.play(resource)
        }
    } catch (e) {
        console.log("Error: El usuario no está a ningún canal de audio")
    }


});


player.on(AudioPlayerStatus.Playing, () => {
    console.log("Status: Playing")
});

function initBot() {
    client.login(config.TOKEN) ? console.log('Iniciado') : console.log('Error iniciando el bot');
}




function procesarComand(command, args = []) {

}





module.exports = {
    initBot: initBot
}