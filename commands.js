var commands = {
    "play": {
        "function": "playPlayer"
    },
    "pause": {
        "function": "pausePlayer"
    },
    "colas": {
        "function": "showQueue"
    }
}




function getCommands() {
    return commands;
}




module.exports = {
    getCommands: getCommands
}