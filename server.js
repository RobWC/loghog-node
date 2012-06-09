var dgram = require("dgram");

//
var parsers = require('./parsers.js')

var listenPort = 1234;

var server = dgram.createSocket("udp4");

server.on("message", function(msg, rinfo) {
  sdSyslogParser(msg);
});

server.on("listening", function() {
  var address = server.address();
  console.log("server listening " + address.address + ":" + address.port);
});

server.bind(listenPort);

var sdSyslogParser = function(msg) {
  var string = msg.toString('utf8');
  var fields = string.split(" ");
  var datetime = fields[1],
      host = fields[2],
      type = fields[3],
      subType = fields[5];
  if (type == 'RT_FLOW') {
    var log = new parsers.RTFlowLogObject(string);
    log.parseLog();
  } else if (type == 'RT_IDP') {
    var log = new parsers.RTIDPLogObject(string);
    log.parseLog();
  };
  //return object;
};