const commands = {
    play: async (args, msg, poru) => {
        if (!args.length) {
            msg.reply('Por favor, proporciona un enlace o término de búsqueda.');
            return;
        }

        if (!msg.member.voice.channel) {
            msg.reply('Debes estar en un canal de voz para reproducir música.');
            return;
        }

        const trackQuery = args.join(" ");
        const res = await poru.resolve({ query: trackQuery, source: "scsearch", requester: msg.member });

        if (res.loadType === "LOAD_FAILED") {
            return msg.reply("Failed to load track.");
        } else if (res.loadType === "NO_MATCHES") {
            return msg.reply("No source found!");
        }

        const player = poru.createConnection({
            guildId: msg.guild.id,
            voiceChannel: msg.member.voice.channelId,
            textChannel: msg.channel.id,
            deaf: true,
        });

        if (res.loadType === "PLAYLIST_LOADED") {
            for (const track of res.tracks) {
                track.info.requester = msg.user;
                player.queue.add(track);
            }
            msg.reply(`${res.playlistInfo.name} has been loaded with ${res.tracks.length} tracks.`);
        } else {
            const track = res.tracks[0];
            track.info.requester = msg.user;
            player.queue.add(track);
            msg.reply(`Queued Track \n \`${track.info.title}\``);
        }

        if (!player.isPlaying && player.isConnected) player.play();
    },
};

module.exports = commands;
