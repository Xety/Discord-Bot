var util = require('util');
var qs = require('query-string');
var request = require("request");
var Config = require("../config/config.json");

function Giphy () {}

Giphy.prototype.search = function (bot, channel, tags) {
    var query = qs.stringify({
        "api_key": Config.giphy.api_key,
        "rating": Config.giphy.rating,
        "format": Config.giphy.json,
        "limit": Config.giphy.limit
    });

    if (tags !== null) {
        query += "&tag=" + tags.join('+');
    }

    request(Config.giphy.url + Config.giphy.endpoint + "?" + query, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            console.error("giphy: Got error: " + body);
        } else {
            var responseObj = JSON.parse(body);

            if(responseObj.data.id) {
                bot.sendMessage(channel, "http://media.giphy.com/media/" + responseObj.data.id + "/giphy.gif [Tags: " + (tags ? tags : "Random GIF") + "]");
            } else {
                bot.sendMessage(channel, "Invalid tags, try something different. [Tags: " + (tags ? tags : "Random GIF") + "]");
            }
        }
    }.bind(this));
};

module.exports = Giphy;
