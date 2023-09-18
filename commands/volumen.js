module.exports = {
  name: 'vol',
  description: 'Modifica el volumen de la canción actual',
  async execute(message, args, client) {

    const player = client.poru.players.get(message.guild.id);

    if (isNaN(args[0])) {
      return message.channel.send(`Indica un valor numérico entre 1 y 100.`);
    }
    //divide el valor por 100 para que sea un porcentaje
    let num = args[0] / 100;
    player.setVolume(num);
    message.reply(`Volumen modificado a **${args[0]}%**.`);

  },
};
