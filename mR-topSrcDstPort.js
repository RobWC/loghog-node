var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;

var mapFunc = function() {
  subType = this.log.subType;
  sourceAddress = this.source.address;
  destAddr = this.destination.address;
  destPort = this.destination.port;
  destProtocol = this.protocol.id;
  ipNumArray = sourceAddress.split('.')
  if (subType == 'RT_FLOW_SESSION_DENY') {
    if ( !! sourceAddress && !! destPort && !! destProtocol) {
      ipnum = parseInt((16777216 * parseInt(ipNumArray[0])) + (65536 * parseInt(ipNumArray[1])) + (256 * parseInt(ipNumArray[2])) + parseInt(ipNumArray[3]));
      if (ipnum >= 167772160 && ipnum <= 184549375) {
        //10.x.x.x ignore
      } else {
        emit({
          'srcAddr': sourceAddress,
          'dstAddr': destAddr,
          'destPort': destPort,
          'destProto': destProtocol
        }, 1);
      }
    }
  } else {
    //skip
  }

};

var reduceFunc = function(key, values) {
  var count = 0;
  values.forEach(function(v) {
    count += v;
  });

  return count;
};

var db = new Db('logger', new Server('localhost', 27017, {}), {
  native_parser: true
});
db.open(function(err, db) {
  db.collection('logs', function(err, collection) {
    collection.mapReduce(mapFunc, reduceFunc, {
      out: {
        replace: 'topSourceAdressDestPort'
      },
      verbose: true
    }, function(err, collection, stats) {
      if (err) {
        console.log(err);
      }
      console.log(stats);
      db.close();
    });
  });
});