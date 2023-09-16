const config = require("./config.json");
const commands = require("./commands.js");
const disc_client = require('./disc_client');





console.log("started")


initBot()









//Init BOT
function initBot() {
    console.log("Iniciando bot")
    disc_client.initBot();
}