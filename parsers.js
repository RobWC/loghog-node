var util = require('util');
var events = require('events');
//third party
var RTFlowLogObject = function(msg) {
  events.EventEmitter.call(this);

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
    id: ''
  }
  this.source = {
    address: '',
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
  this.destination = {
    address: '',
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

util.inherits(RTFlowLogObject, events.EventEmitter);

exports.RTFlowLogObject = RTFlowLogObject;

RTFlowLogObject.prototype.parseLog = function() {
  var self = this;

  var entries = this.message.split(" ");
  this.log.datetime = new Date(entries[1]);
  this.log.host = entries[2];
  this.log.type = entries[3];
  this.log.subType = entries[5];
  var reasonArray = /reason=\"([\w\s]+)\"/.exec(this.message);
  if ( !! reasonArray) {
    this.session.closeReason = reasonArray[1];
  } else {
    this.session.closeReason = '';
  };
  for (entry in entries) {
    var field = entries[entry].split("\"")[0];
    var value = entries[entry].split("\"")[1];
    if ( !! value) {
      switch (field) {
      case 'source-address=':
        this.source.address = value;
        break;
      case 'source-port=':
        this.source.port = value;
        break;
      case 'destination-address=':
        this.destination.address = value;
        break;
      case 'destination-port=':
        this.destination.port = value;
        break;
      case 'service-name=':
        this.protocol.serviceName = value;
        break;
      case 'nat-source-address=':
        this.source.nat.address = value;
        break;
      case 'nat-source-port=':
        this.source.nat.port = value;
        break;
      case 'nat-destination-address=':
        this.destination.nat.address = value;
        break;
      case 'nat-destination-port=':
        this.destination.nat.port = value;
        break;
      case 'src-nat-rule-name=':
        this.source.nat.ruleName = value;
        break;
      case 'dst-nat-rule-name=':
        this.destination.nat.ruleName = value;
        break;
      case 'protocol-id=':
        this.protocol.id = value;
        break;
      case 'policy-name=':
        this.policy.name = value;
        break;
      case 'source-zone-name=':
        this.source.zone = value;
        break;
      case 'destination-zone-name=':
        this.destination.zone = value;
        break;
      case 'session-id-32=':
        this.session.id = value;
        break;
      case 'packets-from-client=':
        this.source.packets = value;
        break;
      case 'bytes-from-client=':
        this.source.bytes = value;
        break;
      case 'packets-from-server=':
        this.destination.packets = value;
        break;
      case 'bytes-from-server=':
        this.destination.bytes = value;
        break;
      case 'elapsed-time=':
        this.session.elapsedTime = value;
        break;
      case 'application=':
        this.protocol.application = value;
        break;
      case 'nested-application=':
        this.protocol.nestedApplication = value;
        break;
      case 'username=':
        this.user.username = value;
        break;
      case 'roles=':
        this.user.roles = value;
        break;
      case 'packet-incoming-interface=':
        this.session.ingressInt = value;
        break;
      case 'encrypted=':
        this.protocol.encrypted = value;
        break;
      default:
        //console.log('')
      }
    };
  };
  self.message = '';
  return self;
  //this.saveToMongo();
}

var RTIDPLogObject = function(msg) {
  events.EventEmitter.call(this);

  this.message = msg;
  this.log = {
    host: '',
    type: '',
    subType: '',
    idpType: '',
    serviceName: '',
    datetime: '',
    epocTime: '',
    packetId: '',
    message: ''
  }
  this.attack = {
    name: '',
    action: '',
    threatSeverity: ''
  }
  this.session = {
    elapsedTime: '',
    ingressInt: '',
    egressInt: '',
    repeatCount: ''
  }
  this.policy = {
    name: '',
    ruleName: '',
    rulebaseName: ''
  }
  this.protocol = {
    application: '',
    encrypted: ''
  }
  this.source = {
    address: '',
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
  this.destination = {
    address: '',
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
};

util.inherits(RTIDPLogObject, events.EventEmitter);

exports.RTIDPLogObject = RTIDPLogObject;

RTIDPLogObject.prototype.parseLog = function() {
  var self = this;

  var entries = this.message.split(" ");
  this.log.datetime = new Date(entries[1]);
  this.log.host = entries[2];
  this.log.type = entries[3];
  this.log.subType = entries[5];
  for (entry in entries) {
    var field = entries[entry].split("\"")[0];
    var value = entries[entry].split("\"")[1];
    if ( !! value) {
      switch (field) {
      case 'message=':
        this.log.message = value;
        break;
      case 'packet-log-id':
        this.log.packetId = value;
        break;
      case 'attack-name=':
        this.attack.name = value;
        break;
      case 'threat-severity=':
        this.attack.threatSeverity = value;
        break;
      case 'action=':
        this.attack.action = value;
        break;
      case 'repeat-count=':
        this.session.rebeatCount = value;
        break;
      case 'rulebase-name=':
        this.policy.rulebaseName = value;
        break;
      case 'rule-name=':
        this.policy.ruleName = value;
        break;
      case 'message-type=':
        this.log.idpType = value;
        break;
      case 'epoc-time=':
        this.log.epocTime = value;
        break;
      case 'source-address=':
        this.source.address = value;
        break;
      case 'source-port=':
        this.source.port = value;
        break;
      case 'destination-address=':
        this.destination.address = value;
        break;
      case 'destination-port=':
        this.destination.port = value;
        break;
      case 'service-name=':
        this.log.serviceName = value;
        break;
      case 'nat-source-address=':
        this.source.nat.address = value;
        break;
      case 'nat-source-port=':
        this.source.nat.port = value;
        break;
      case 'nat-destination-address=':
        this.destination.nat.address = value;
        break;
      case 'nat-destination-port=':
        this.destination.nat.port = value;
        break;
      case 'protocol-name=':
        this.protocol.name = value;
        break;
      case 'policy-name=':
        this.policy.name = value;
        break;
      case 'source-zone-name=':
        this.source.zone = value;
        break;
      case 'destination-zone-name=':
        this.destination.zone = value;
        break;
      case 'inbound-packets=':
        this.source.packets = value;
        break;
      case 'inbound-bytes':
        this.source.bytes = value;
        break;
      case 'outbound-bytes=':
        this.destination.bytes = value;
        break;
      case 'outbound-packets=':
        this.destination.packets = value;
        break;
      case 'elapsed-time=':
        this.session.elapsedTime = value;
        break;
      case 'application-name=':
        this.protocol.application = value;
        break;
      case 'source-interface-name=':
        this.session.ingressInt = value;
        break;
      case 'destination-zone-name=':
        this.session.egressInt = value;
        break;
      case 'encrypted=':
        this.protocol.encrypted = value;
        break;
      default:
        //console.log('')
      }
    };
  };
  //this.saveToMongo();
  self.message = '';
  return self;
}