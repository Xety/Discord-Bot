var Discord = require("discord.js");
var Config = require("./lib/config/config.json");

//API
var YouTube = require("./lib/api/youtube");
var Giphy = require("./lib/api/giphy");

var Permissions = require("./lib/permissions");

var trigger = "!"; //you can change that as you please, or set up a command to change it on the fly.


var bot = new Discord.Client();

var help = [ // so you dont have to deal with linespamming
    "Help",
    "Ping",
    "Youtube",
    "Gif",
    "Say",
    "Log",
    "Commit"
    ]

var commands = {
    "help": {
        description: "Lists of all commands.",
        process: function(bot, message, suffix) {
           bot.sendMessage(msg.author, "Here is a list of my currently availiable commands: " + help + ".")
           bot.sendMessage(msg.channel, "Please check your PM's")
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
    },
    "say": {
        usage: "<message>",
        description: "The bot says the message.",
        process: function(bot, message, suffix) {
            bot.sendMessage(message.channel, suffix, true);
        }
    },
    "log": {
        usage: "<log message>",
        description: "Logs the message to the bot console.",
        process: function(bot, message, suffix) {
            if(Permissions.isAllowed(message.author, Config.bot.permissions.owner)) {
                console.log(message.content);
            } else {
                bot.sendMessage(message.channel, "You can't use this command.");
            }
        }
    },
    "commit": {
        description: "Returns the last git commit this bot is running.",
        process: function(bot, message, suffix) {
            if(Permissions.isAllowed(message.author, Config.bot.permissions.owner)) {
                var commit = require('child_process').spawn('git', ['log', '--stat', '--oneline', '-1']);

                commit.stdout.on('data', function(data) {
                    bot.sendMessage(message.channel, "```" + data + "```");
                });

                commit.on('close',function(code) {
                    if(code !== 0){
                        bot.sendMessage(message.channel, "Failed checking git version!");
                    }
                });
            } else {
                bot.sendMessage(message.channel, "You can't use this command.");
            }
        }
    },
};

bot.on("message", function (msg) {
  //Shorter, more efficient.
  if (msg.content[0] === trigger) {
    var command = msg.content.toLowerCase().split(" ")[0].substring(1);
    var suffix = msg.content.toLowerCase().substring(command.length + 2);
    var cmd = commands[command];
    if (cmd) {
      cmd.process(bot, msg, suffix);
    }
  }
});


bot.login(Config.user.email, Config.user.password);
