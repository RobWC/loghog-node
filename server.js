var dgram = require("dgram");
var Db = require("mongodb").Db;
var Connection = require("mongodb").Connection;
var Server = require("mongodb").Server;
var db = new Db('logger', new Server('localhost', 27017, {}));
var logArray = new Array();

var listenPort = 1234;

var server = dgram.createSocket("udp4");

server.on("message", function (msg, rinfo) {
  sdSyslogParser(msg);
});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " + address.address + ":" + address.port);
});

server.bind(listenPort);


var sdSyslogParser = function(msg) {
  var string = msg.toString('utf8');
  var logObj = new LogObject(string);
  var entries = string.split(" ");
  logObj.log.datetime = entries[1];
  logObj.log.host = entries[2];
  logObj.log.type = entries[3];
  logObj.log.subType = entries[5];
  var reasonArray = /reason=\"([\w\s]+)\"/.exec(string);
  if (!!reasonArray) {
    logObj.session.closeReason = reasonArray[1];
  } else {
    logObj.session.closeReason = '';
  };
  for (entry in entries) {
    var field = entries[entry].split("\"")[0];
    var value = entries[entry].split("\"")[1];
    if (!!value) {
      switch(field) {
        case 'source-address=':
          logObj.source.address = value;
          break;
        case 'source-port=':
          logObj.source.port = value;
          break;
        case 'destination-address=':
          logObj.destination.address = value;
          break;
        case 'destination-port=':
          logObj.destination.port = value;
          break;
        case 'service-name=':
          logObj.protocol.serviceName = value;
          break;
        case 'nat-source-address=':
          logObj.source.nat.address = value;
          break;
        case 'nat-source-port=':
          logObj.source.nat.port = value;
          break;
        case 'nat-destination-address=':
          logObj.destination.nat.address = value;
          break;
        case 'nat-destination-port=':
          logObj.destination.nat.port = value;
          break;
        case 'src-nat-rule-name=':
          logObj.source.nat.ruleName = value;
          break;
        case 'dst-nat-rule-name=':
          logObj.destination.nat.ruleName = value;
          break;
        case 'protocol-id=':
          logObj.protocol.id = value;
          break;
        case 'policy-name=':
          logObj.policy.name = value;
          break;
        case 'source-zone-name=':
          logObj.source.zone = value;
          break;
        case 'destination-zone-name=':
          logObj.destination.zone = value;
          break;
        case 'session-id-32=':
          logObj.session.id = value;
          break;
        case 'packets-from-client=':
          logObj.source.packets = value;
          break;
        case 'bytes-from-client=':
          logObj.source.bytes = value;
          break;
        case 'packets-from-server=':
          logObj.destination.packets = value;
          break;
        case 'bytes-from-server=':
          logObj.destination.bytes = value;
          break;
        case 'elapsed-time=':
          logObj.session.elapsedTime = value;
          break;
        case 'application=':
          logObj.protocol.application = value;
          break;
        case 'nested-application=':
          logObj.protocol.nestedApplication = value;
          break;
        case 'username=':
          logObj.user.username = value;
          break;
        case 'roles=':
          logObj.user.roles = value;
          break;
        case 'packet-incoming-interface=':
          logObj.session.ingressInt = value;
          break;
        case 'encrypted=':
          logObj.protocol.encrypted = value;
          break;
        default:
          //console.log('')
      }
    };
  };
  console.log(logObj);
  if (logArray.length == 5) {
    
    for(var i = logArray.length; i = 0; i--) {
      var log = logArray.pop();
      log.saveToMongo();
    };
    for (log in logArray) {
      logArray[log]
    };
  } else {
    logArray.push(logObj);
  }
  //return object;
};

var LogObject = function(msg) {
  this.message = msg;
  this.log = {
    host: '',
    type: '',
    subType: '',
    datetime: ''
  }
  this.session = {
    id: '',
    elapsedTime: '',
    ingressInt: '',
    closeReason: ''
  }
  this.policy = {
    name: ''
  }
  this.protocol = {
    serviceName: '',
    application: '',
    nestedApplication: '',
    encrypted: '',
    id:''
  }
  this.source = {
    address: '',
    port: '',
    zone: '',
    packets:'',
    bytes: '',
    nat: {
      address: '',
      port: '',
      ruleName: ''
    }
  }
  this.destination = {
    address:'',
    port: '',
    zone: '',
    packets: '',
    bytes: '',
    nat: {
      address: '',
      port: '',
      ruleName: ''
    }
  }
  this.user = {
    username: '',
    roles: ''
  }
};

LogObject.constructor = LogObject;

LogObject.prototype = {
  saveToMongo: function() {
    var self = this;
    db.open(function(err,result){
      db.collection('logs', function(err,collection){
        collection.insert(self,function(err,docs){
          if (err) {
            console.log(err);
          } else {
            console.log('insert');
            db.close();
          };
        });
      });
    });
  }
};