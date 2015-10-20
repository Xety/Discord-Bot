var Discord = require("discord.js");
var Config = require("./lib/config/config.json");

//API
var yt = require("./lib/api/youtube");
var YouTube = new yt();

var gy = require("./lib/api/giphy");
var Giphy = new gy();


var bot = new Discord.Client();


var commands = {
    "help": {
        description: "Lists of all commands.",
        process: function(bot, message, suffix) {


            for(var cmd in commands) {
                var info = "`" + Config.bot.prefix + cmd + "`";
                var usage = commands[cmd].usage;

                if(usage) {
                    info += " " + usage;
                }

                var description = commands[cmd].description;
                if(description){
                    info += "\n\t*" + description + "*";
                }
                bot.sendMessage(message.author, info);
            }

            bot.sendMessage(message.author, "Some commands may be restricted due to the permissions.");
        }
    },
    "ping": {
        description: "Useful for checking if the bot is alive.",
        process: function(bot, message, suffix) {
            bot.sendMessage(message.channel, message.sender + " pong!");
        }
    },
    "youtube": {
        usage: "<tag1> <tag2> etc",
        description: "Gets a YouTube video matching tags.",
        process: function(bot, message, suffix){
            YouTube.respond(bot, message.channel, suffix);
        }
    },
    "gif": {
        usage: "<tag1> <tag2> etc",
        description: "Returns a random gif matching the tags passed.",
        process: function(bot, message, suffix) {
            var tags = suffix.split(" ");

            Giphy.search(bot, message.channel, tags);
        }
    }
};

bot.on("message", function (message) {

    if(!bot.user.equals(message.author) && (message.content[0] === Config.bot.prefix || message.content.indexOf(bot.user.mention()) === 0)) {
        var command = message.content.split(" ")[0].substring(1);
        var suffix = message.content.substring(command.length+2);

        if(message.content.indexOf(bot.user.mention()) === 0){
            command = msg.content.split(" ")[1];
            suffix = msg.content.substring(bot.user.mention().length + command.length + 2);
        }

        var cmd = commands[command];

        if (cmd) {
            cmd.process(bot, message, suffix);
        } else {
            bot.sendMessage(message.channel, "Invalid command **" + Config.bot.prefix + command + "**. Type `!help` to see the list of commands.");
        }
    } else {
        if(bot.user.equals(message.author)){
            return;
        }

        if (message.author.id != bot.user.id && message.isMentioned(bot.user)) {
            bot.sendMessage(message.channel, message.author + ", yeah ?");
        }
    }
});


bot.login(Config.user.email, Config.user.password);
