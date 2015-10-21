var util = require('util');
var youtube_node = require('youtube-node');
var Config = require("../config/config.json");

var YouTube = function () {
    this.youtube = new youtube_node();
    this.youtube.setKey(Config.youtube.api_key);
};

YouTube.prototype.respond = function (bot, channel, query) {
    this.youtube.search(query, 1, function(error, result) {
        if (error) {
            bot.sendMessage(channel, "An error ocurred. Please try again.");
        } else {
            if (!result || !result.items || result.items.length < 1) {
                bot.sendMessage(channel, "No results. Please try again with different tags.");
            } else {
                bot.sendMessage(channel, "http://www.youtube.com/watch?v=" + result.items[0].id.videoId );
            }
        }
    });
};

module.exports = new YouTube();
