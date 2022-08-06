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
const { url } = require('inspector');
// import {url} from "inspector"

const url_lists = []
var storedFunctions = {}

var stopped = true;



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
        console.log(url_lists)

    } catch (e) {
        console.log('Error')
    }
});


player.on(AudioPlayerStatus.Playing, () => {
    console.log('>START PLAYING > ' + url_lists[0])
});

player.on(AudioPlayerStatus.Buffering, () => {
    console.log(">Status: buffering")

});


//Cuando el reproductor para un audio
player.on(AudioPlayerStatus.Idle, () => {
    console.log("idle")
    try {
        if (url_lists.length > 0 && !stopped) {
            url_lists.shift()
            player.play(createAudioResource(ytdl(url_lists[0])))
        }

        /*if (url_lists.length > 0) {
            if (ytdl(url_lists[0])) return
            player.play(createAudioResource(ytdl(url_lists[0])))
            //  url_lists.shift()
        }*/
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
    } catch (e) { }

}




//Event on exception uncaught
process.on('uncaughtException', function (err) {
    console.log('Excepcion: ' + err);
    console.log('Quitando de la lista: ' + url_lists[0]);
    url_lists.shift()
});


function playNextSong() {
    if (url_lists.length > 0) {
        console.log("PASANDO A LA SIGUIENTE CANCION")
    } else {
        console.log("NO HAY MÁS CANCIONES A LA LISTA")
    }
}


storedFunctions.playPlayer = async function (args, msg) {

    //if !play
    if (args.length == 1) {
        stopped = false
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
            } else {
                msg.channel.send("El bot está en otro canal de audio.")
            }


        } else if (player.state.status == 'paused') {
            player.unpause();
            console.log("Reanudado reproductor pausado")
        }

        return;
    } else {
        //else !play URL 
        let play_now = false;
        if (url_lists.length == 0) {
            play_now = true
            stopped = false

        }
        url_lists.push(args[1]);
        console.log("URL AÑADIDA AL PLAYER")
        //Check si ya está en un canal de voz
        //por ahora limitado a 1
        if (player.subscribers.length == 0) {
            //si no lo está acceder
            let voice_channel_id = msg.member.voice.channel.id
            if (voice_channel_id) {
                const connection = joinVoiceChannel({
                    channelId: voice_channel_id,
                    guildId: msg.guild.id,
                    adapterCreator: msg.guild.voiceAdapterCreator
                })
                connection.subscribe(player)
            }
        }
        if (url_lists.length == 1) {
            let video_url = url_lists[0]
            await player.play(createAudioResource(await ytdl(video_url)))
        }

    }
}


storedFunctions.stopPlayer = async function (args) {
    stopped = true
    player.stop();
    console.log("PLAYER STOP")
    //let yt_song = ytdl("https://www.youtube.com/watch?v=JM3Wyn2VmHg").pipe(fs.createWriteStream('audio/yt_audio.mp3')

}

storedFunctions.pausePlayer = async function (args) {
    console.log("PLAYER PAUSE")
    player.pause();

}

storedFunctions.skipSong = async function (args) {
    if (url_lists.length > 1) {
        console.log("PLAYER SKIP")
        player.stop();
        url_lists.shift()
        await player.play(createAudioResource(await ytdl(url_lists[0])))
    } else {
        player.stop();
        msg.channel.send("No hay más vídeos a reproducir.");
        console.log("PLAYER CAN'T SKIP")
    }
}

storedFunctions.playerStatus = async function (args) {
    console.log('STATUS PLAYER : ' + player.state.status)
}

storedFunctions.showQueue = async function (args, msg) {
    console.log(url_lists)
    if (url_lists.length == 0) {
        msg.channel.send("La cola está vacía. Para añadir nuevas URLs de Youtube usa '!play URL_VIDEO'");
        return;
    }

    msg.channel.send(url_lists.toString())
}



module.exports = {
    initBot: initBot
}