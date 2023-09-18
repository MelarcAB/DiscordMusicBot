const commands =[
    {
        "name": "/play",
        "description": "Reproduce una canción de YouTube. Si no se especifica una canción, se reanuda la reproducción.",
    },
    {
        "name": "/pause",
        "description": "Pausa la reproducción.",
    },
    {
        "name": "/cola",
        "description": "Muestra la cola de reproducción.",
    },
    {
        "name": "/vol",
        "description": "Modifica el volumen de la canción actual. El valor debe ser un número entre 1 y 100.",
    },
    {
        "name": "/skip",
        "description": "Salta a la siguiente canción.",
    },
    {
        "name": "/help",
        "description": "Devuelve una lista de comandos disponibles.",
    },
]

module.exports = commands;
