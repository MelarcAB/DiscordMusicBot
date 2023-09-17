module.exports = {
    name: 'pause',
    description: 'Reproduce una canción de YouTube',
    async execute(message, args, client) {
      

        try {

            const player = client.poru.createConnection({
                guildId: message.guild.id,
                voiceChannel: message.member.voice.channelId,
                textChannel: message.channel.id,
                deaf: true,
            });


            if (player.isPlaying && player.isConnected){
                if (player.isPlaying && player.isConnected) player.pause(true);
                return message.reply("Pausado");
            }else{
                return message.reply("No hay canciones en la cola.");
            }
      

        } catch (error) {
            console.error("Error al procesar el comando play:", error);
            message.reply("Ocurrió un error inesperado. Por favor intenta nuevamente.");
        }
    },
};
