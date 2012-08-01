var dgram = require("dgram");
//
var Db = require("mongodb").Db;
var Connection = require("mongodb").Connection;
var Server = require("mongodb").Server;

var logParser = new require('./logparser.js').LogParser();
 var db = new Db('logger', new Server('localhost', 27017, {}));
var listenPort = 1234;

var server = dgram.createSocket("udp4");

server.on("message", function(msg, rinfo) {
  logParser.parse(msg);
});

server.on("listening", function() {
  var address = server.address();
  console.log("server listening " + address.address + ":" + address.port);
});

db.open(function(err, result) {

  logParser.on('newLog',function(data){
    var self = this;
    db.collection('logs', function(err, collection) {
      collection.insert(self);
    });
  });
  
});

server.bind(listenPort);