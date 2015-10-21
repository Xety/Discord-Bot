var util = require('util');
var qs = require('query-string');
var request = require("request");
var config = require("../config/config.json");

var Giphy = function () {};

Giphy.prototype.search = function (bot, channel, tags) {
    var query = qs.stringify({
        "api_key": config.giphy.api_key,
        "rating": config.giphy.rating,
        "format": config.giphy.json,
        "limit": config.giphy.limit
    });

    if (tags !== null) {
        query += "&tag=" + tags.join('+');
    }

    request(config.giphy.url + config.giphy.endpoint + "?" + query, function (error, response, body) {
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

module.exports = new Giphy();
