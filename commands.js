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




function getCommands() {
    return commands;
}




module.exports = {
    getCommands: getCommands
}