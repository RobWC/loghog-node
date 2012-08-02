var dgram = require("dgram");
//
var Db = require("mongodb").Db;
var Connection = require("mongodb").Connection;
var Server = require("mongodb").Server;
var logParser = require('./logparser.js').LogParser;

var parser = new logParser();

var db = new Db('logger', new Server('localhost', 27017, {}));
var listenPort = 1234;

db.open(function(err, result) {
  console.log(result);
  parser.on('save',function(data){
    console.log(data);
    db.collection('logs', function(err, collection) {
      collection.insert(data);
    });
  });
});

var server = dgram.createSocket("udp4");

server.on("message", function(msg, rinfo) {
  parser.parse(msg);
});

server.on("listening", function() {
  var address = server.address();
  console.log("server listening " + address.address + ":" + address.port);
});

server.bind(listenPort);