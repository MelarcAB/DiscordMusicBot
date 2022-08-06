var commands = {
        "play": {
            "function": "playPlayer"
        },
        "pause": {
            "function": "pausePlayer"
        },
        "stop": {
            "function": "stopPlayer"
        },
        "cola": {
            "function": "showQueue"
        },
        "skip": {
            "function": "skipSong"
        },
        "status": {
            "function": "playerStatus"
        }
    }
    /*
    const relations = new Map([
        ["play", playPlayer]
    ])

    const funnction = relations.get('play')
    funnctiohn()

    */
function getCommands() {
    return commands;
}




module.exports = {
    getCommands: getCommands
}