const { EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'cola',
    description: 'Muestra la cola de reproducción',
    async execute(message, args, client) {
        try {
            if (!message.member.voice.channel) {
                return message.reply("¡Debes estar en un canal de voz para usar este comando!");
            }

            const player = client.poru.players.get(message.guild.id);

            const queue =
              player.queue.length > 9 ? player.queue.slice(0, 9) : player.queue;
        

            const embed = new EmbedBuilder()
                .setColor('White')
                .setTitle('Sonando')
                .setThumbnail(player.currentTrack.info.image)
                .setDescription(
                    `[${player.currentTrack.info.title}](${player.currentTrack.info.uri
                    }) [${ms(player.currentTrack.info.length)}]`,
                )
                .setFooter({ text: `Canciones en cola: ${player.queue.length} ` });

            if (queue.length)
                embed.addFields([
                    {
                        name: 'Cola',
                        value: queue
                            .map((track, index) => `**${index + 1})** \`${track.info.title}\``)
                            .join('\n'),
                    },
                ]);

            message.channel.send({ embeds: [embed] });

            return;
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
