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
    "colas": {
        "function": "showQueue"
    },
    "skip": {
        "function": "skipSong"
    }
}




function getCommands() {
    return commands;
}




module.exports = {
    getCommands: getCommands
}