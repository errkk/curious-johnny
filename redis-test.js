// Imports
var settings = require("./conf");
var redis = require("redis");
var Pusher = require('pusher');

// Inits
var client = redis.createClient();
var pusher = new Pusher(settings.PUSHER_CONF);

// Bindings
client.on("error", function (err) {
    console.log("Error " + err);
});

client.on('message', function(channel, message) {
    //var duration = parseInt(message, 10) || 1;
    pusher.trigger('test_channel', channel, {
        "message": message
    });

    return {
        'data_recieved': function() {
            console.log('Data recieved', message);
        },
        'response_sent': function() {
            console.log('Response sent', message);
        }
    }[channel]();

});

client.subscribe('data_recieved');
client.subscribe('response_sent');
