var dgram = require("dgram");
var listenPort = 1234;

var server = dgram.createSocket("udp4");

server.on("message", function (msg, rinfo) {
  sdSyslogParser(msg);
});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

server.bind(listenPort);


var sdSyslogParser = function(msg) {
  var patt = '.* - ([\w_]*)\s\[([\w\@\.]+) reason=\"([\w\s\.\-\/]+)\" source-address=\"([\w\s\.\-\/]+)\" source-port=\"([\w\s\.\-\/]+)\" destination-address=\"([\w\s\.\-\/]+)\" destination-port=\"([\w\s\.\-\/]+)\" service-name=\"([\w\s\.\-\/]+)\" nat-source-address=\"([\w\s\.\-\/]+)\" nat-source-port=\"([\w\s\.\-\/]+)\" nat-destination-address=\"([\w\s\.\-\/]+)\" nat-destination-port=\"([\w\s\.\-\/]+)\" src-nat-rule-name=\"([\w\s\.\-\/]+)\" dst-nat-rule-name=\"([\w\s\.\-\/]+)\" protocol-id=\"([\w\s\.\-\/]+)\" policy-name=\"([\w\s\.\-\/]+)\" source-zone-name=\"([\w\s\.\-\/]+)\" destination-zone-name=\"([\w\s\.\-\/]+)\" session-id-32=\"([\w\s\.\-\/]+)\" packets-from-client=\"([\w\s\.\-\/]+)\" bytes-from-client=\"([\w\s\.\-\/]+)\" packets-from-server=\"([\w\s\.\-\/]+)\" bytes-from-server=\"([\w\s\.\-\/]+)\" elapsed-time=\"([\w\s\.\-\/]+)\" application=\"([\w\s\.\-\/]+)\" nested-application=\"([\w\s\.\-\/]+)\" username=\"([\w\s\.\-\/]+)\" roles=\"([\w\s\.\-\/]+)\" packet-incoming-interface=\"([\w\s\.\-\/]+)\" encrypted=\"([\w\s\.\-\/]+)"\]';
  var logArray = new RegExp(patt);
  console.log(logArray[6])
  return object;
};

/*
 * <14>1 2012-05-02T20:41:10.805 SRXEdge RT_FLOW - RT_FLOW_SESSION_CLOSE [junos@2636.1.1.1.2.41 reason="unset" source-address="10.0.1.24" source-port="54895" destination-address="75.75.75.75" destination-port="53" service-name="junos-dns-udp" nat-source-address="50.76.52.162" nat-source-port="24181" nat-destination-address="75.75.75.75" nat-destination-port="53" src-nat-rule-name="1" dst-nat-rule-name="None" protocol-id="17" policy-name="1" source-zone-name="Trust" destination-zone-name="Untrust" session-id-32="926" packets-from-client="1" bytes-from-client="80" packets-from-server="1" bytes-from-server="128" elapsed-time="2" application="UNKNOWN" nested-application="UNKNOWN" username="N/A" roles="N/A" packet-incoming-interface="vlan.0" encrypted="No "]
 *
 */