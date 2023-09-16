const { joinVoiceChannel, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const commands = {
    play: async (args, msg, player) => {
        if (!args.length) {
            msg.reply('Por favor, proporciona un enlace de YouTube.');
            return;
        }

        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) {
            msg.reply('Debes estar en un canal de voz para reproducir música.');
            return;
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: msg.guild.id,
            adapterCreator: msg.guild.voiceAdapterCreator
        });

        const stream = ytdl(args[0], { filter: 'audioonly' });
        const resource = createAudioResource(stream);
        player.play(resource);

        connection.subscribe(player);
        msg.reply(`Reproduciendo: ${args[0]}`);
    },

    // Puedes agregar más comandos aquí...
};

module.exports = commands;
