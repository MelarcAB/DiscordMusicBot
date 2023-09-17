module.exports = {
    name: 'cola',
    description: 'Muestra la cola de reproducción',
    async execute(message, args, client) {
        try {
            if (!message.member.voice.channel) {
                return message.reply("¡Debes estar en un canal de voz para usar este comando!");
            }
       
            const player = client.poru.createConnection({
                guildId: message.guild.id,
                voiceChannel: message.member.voice.channelId,
                textChannel: message.channel.id,
                deaf: true,
            });
            const queue = player.queue;
            let queueString = queue.length > 0 ? "Cola de reproducción: \n" : "No hay canciones en la cola.";
            for (let i = 0; i < queue.length; i++) {
                console.log(queue[i].info.title);
                queueString += `${i + 1}. ${queue[i].info.title} \n`;
            }
            return message.reply(queueString);


        } catch (error) {
            console.error("Error al procesar el comando play:", error);
            message.reply("Ocurrió un error inesperado. Por favor intenta nuevamente.");
        }
    },
};
