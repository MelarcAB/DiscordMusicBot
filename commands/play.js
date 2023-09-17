module.exports = {
    name: 'play',
    description: 'Reproduce una canción de YouTube',
    async execute(message, args, client) {
        //si no hay argumento, se checkea si hay una canción en la cola, si no hay, se retorna un mensaje de error
        //si hay una canción en la cola, se reproduce
        if (args.length < 1) {
            try {
                
                const player = client.poru.createConnection({
                    guildId: message.guild.id,
                    voiceChannel: message.member.voice.channelId,
                    textChannel: message.channel.id,
                    deaf: true,
                });
                if (player.isPaused && player.isConnected) player.pause(false);

                message.reply("Se reanudó la reproducción.");

            } catch (error) {
                console.error("Error al procesar el comando play:", error);
                message.reply("Ocurrió un error inesperado. Por favor intenta nuevamente.");
            }
    
        } else {
            const trackURL = args[0];

            if (!message.member.voice.channel) {
                return message.reply("¡Debes estar en un canal de voz para usar este comando!");
            }

            if (!trackURL.includes("youtube")) {
                return message.reply("¡Debes proporcionar un link de youtube!");
            }

            try {
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
            } catch (error) {
                console.error("Error al procesar el comando play:", error);
                message.reply("Ocurrió un error inesperado. Por favor intenta nuevamente.");
            }
        }


    },
};
