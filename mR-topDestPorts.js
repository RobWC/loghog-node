var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;

var mapFunc = function() {
  subType = this.log.subType;
  destPort = this.destination.port;
    destProtocol = this.protocol.id;
  if (subType != 'APPTRACK_SESSION_VOL_UPDATE') {
    if (!! destPort) {
        emit({
          'destPort': destPort,
          'destProto': destProtocol
        }, 1);
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
        replace: 'topDestPort'
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