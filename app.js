var five = require("johnny-five");
var redis = require("redis");
var board = new five.Board();
var client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

board.on("ready", function() {
    var self = this;

    var green = new five.Led(9);
    var red = new five.Led(10);

    client.on('message', function(channel, message) {
        var duration = parseInt(message, 10) || 1;
        return {
            'tweet': function() {
                green.fadeIn();
                self.wait(duration * 1000, function() {
                    green.fadeOut();
                });
            },
            'response': function() {
                red.fadeIn();
                self.wait(duration * 1000, function() {
                    red.fadeOut();
                });
            }
        }[channel]();
    });

    client.subscribe('tweet');
    client.subscribe('response');

    // pinMode is set to OUTPUT by default
    // Inject the `led` hardware into
    // the Repl instance's context;
    // allows direct command line access
    board.repl.inject({
        red: red,
        green: green
    });



});
