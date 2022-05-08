const Discord = require('discord.js');
const config = require("./config.json");
const ytdl = require('ytdl-core');
const bot = require("./bot.js");
const { Client, Intents } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus, AudioResource, StreamType } = require('@discordjs/voice');
const player = createAudioPlayer();
const path = require("path")
const commands = require("./commands.js");
const fs = require('fs');
const { exit } = require('process');

const url_lists = []
var storedFunctions = {}

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
    let arguments = message.split(" ")
    try {


        procesarComand(command, msg)
    } catch (e) {
        console.log('Error')
    }
});


player.on(AudioPlayerStatus.Playing, () => {});


//Cuando el reproductor para un audio
player.on(AudioPlayerStatus.Idle, () => {
    try {
        if (url_lists.length > 0) {
            if (ytdl(url_lists[0])) return
            player.play(createAudioResource(ytdl(url_lists[0])))
            url_lists.shift()
        }
    } catch (e) {
        console.log(e)
    }

});

function initBot() {
    client.login(config.TOKEN) ? console.log('Iniciado') : console.log('Error iniciando el bot');
}


function procesarComand(command, msg = []) {
    let message = (msg.content)
    let arguments = message.split(" ")

    let comandos = (commands.getCommands())
    try {
        if (comandos[command] == undefined) {
            console.log("Comando no encontrado")
            return false
        } else {

            let function_to_call = comandos[command].function

            //Call function using functionCommand
            storedFunctions[function_to_call](arguments, msg)
        }
    } catch (e) {}

}

process.on('uncaughtException', function(err) {
    console.log('Excepcio: ' + err);
    exit
});



storedFunctions.playPlayer = async function(args, msg) {

    if (args.length == 1) {
        if (player.state.status == 'idle') {
            if (url_lists.length == 0) {
                console.log("La cola está vacía")
                return
            }

            let voice_channel_id = msg.member.voice.channel.id

            //Join voice channel del usuario que envió el comando 
            if (voice_channel_id) {
                const connection = joinVoiceChannel({
                    channelId: voice_channel_id,
                    guildId: msg.guild.id,
                    adapterCreator: msg.guild.voiceAdapterCreator
                })
                connection.subscribe(player)
                let resource = createAudioResource(path.join(__dirname, 'audio', 'sakedebinks.mp3'));
                if (!ytdl(url_lists[0])) return
                player.play(createAudioResource(ytdl(url_lists[0])))
                url_lists.shift();
            }


        } else if (player.state.status == 'paused') {
            player.unpause();
            console.log("Reanudado reproductor pausado")
        }

        return;
    } else {
        ytdl(args[1])

        url_lists.push(args[1]);
        if (player.state.status == 'idle') {

            let voice_channel_id = msg.member.voice.channel.id

            try {
                //Join voice channel del usuario que envió el comando 
                if (voice_channel_id) {
                    const connection = joinVoiceChannel({
                        channelId: voice_channel_id,
                        guildId: msg.guild.id,
                        adapterCreator: msg.guild.voiceAdapterCreator
                    })
                    connection.subscribe(player)
                    if (ytdl(url_lists[0])) { return }
                    player.play(createAudioResource(ytdl(url_lists[0])))
                    url_lists.shift();
                }
            } catch (e) {
                console.log('error v2')
            }
        }
    }
}


storedFunctions.stopPlayer = async function(args) {
    player.stop();
    //let yt_song = ytdl("https://www.youtube.com/watch?v=JM3Wyn2VmHg").pipe(fs.createWriteStream('audio/yt_audio.mp3')

}

storedFunctions.pausePlayer = async function(args) {
    player.pause();
    //let yt_song = ytdl("https://www.youtube.com/watch?v=JM3Wyn2VmHg").pipe(fs.createWriteStream('audio/yt_audio.mp3')

}

storedFunctions.skipSong = async function(args) {
    player.stop();
    //let yt_song = ytdl("https://www.youtube.com/watch?v=JM3Wyn2VmHg").pipe(fs.createWriteStream('audio/yt_audio.mp3')

}



module.exports = {
    initBot: initBot
}