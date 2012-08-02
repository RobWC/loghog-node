var dgram = require("dgram");
var cluster = require("cluster");
var numCPUs = require("os").cpus().length;
//
var Db = require("mongodb").Db;
var Connection = require("mongodb").Connection;
var Server = require("mongodb").Server;
var logParser = require('./logparser.js').LogParser;
var listenPort = 1234;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {


  var parser = new logParser();

  var db = new Db('logger', new Server('localhost', 27017, {}));
  db.open(function(err, result) {
    parser.on('save', function(data) {
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
};