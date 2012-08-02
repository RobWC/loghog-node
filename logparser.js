var util = require('util');
var events = require('events');
//third party
var parsers = require('./parsers.js')

var LogParser = function() {
  events.EventEmitter.call(this);
};

util.inherits(LogParser,events.EventEmitter);

exports.LogParser = LogParser;

LogParser.prototype.parse = function(msg) {
  var self = this;
  
  self.emit('test', 'hello');
  
  var string = msg.toString('utf8');
  var fields = string.split(" ");
  var datetime = fields[1],
      host = fields[2],
      type = fields[3],
      subType = fields[5];
  if (type == 'RT_FLOW') {
    var log = new parsers.RTFlowLogObject(string);
    console.log(log.parseLog());
    self.emit('save',JSON.stringify(log.parseLog()));
  } else if (type == 'RT_IDP') {
    var log = new parsers.RTIDPLogObject(string);
    self.emit('save',JSON.stringify(log.parseLog()));
  };
  
};