var dgram = require("dgram");
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
  //var test = '<14>1 2012-05-02T20:41:10.805 SRXEdge RT_FLOW - RT_FLOW_SESSION_CLOSE [junos@2636.1.1.1.2.41 reason="unset" source-address="10.0.1.24" source-port="54895" destination-address="75.75.75.75" destination-port="53" service-name="junos-dns-udp" nat-source-address="50.76.52.162" nat-source-port="24181" nat-destination-address="75.75.75.75" nat-destination-port="53" src-nat-rule-name="1" dst-nat-rule-name="None" protocol-id="17" policy-name="1" source-zone-name="Trust" destination-zone-name="Untrust" session-id-32="926" packets-from-client="1" bytes-from-client="80" packets-from-server="1" bytes-from-server="128" elapsed-time="2" application="UNKNOWN" nested-application="UNKNOWN" username="N/A" roles="N/A" packet-incoming-interface="vlan.0" encrypted="No "]';
  //var rtLogCloseRegex = new RegExp("^.* - ([\w_]*) \W([\w\@\.]+) reason=\"([\w\s\.\-\/]+)\" source-address=\"([\w\s\.\-\/]+)\" source-port=\"([\w\s\.\-\/]+)\" destination-address=\"([\w\s\.\-\/]+)\" destination-port=\"([\w\s\.\-\/]+)\" service-name=\"([\w\s\.\-\/]+)\" nat-source-address=\"([\w\s\.\-\/]+)\" nat-source-port=\"([\w\s\.\-\/]+)\" nat-destination-address=\"([\w\s\.\-\/]+)\" nat-destination-port=\"([\w\s\.\-\/]+)\" src-nat-rule-name=\"([\w\s\.\-\/]+)\" dst-nat-rule-name=\"([\w\s\.\-\/]+)\" protocol-id=\"([\w\s\.\-\/]+)\" policy-name=\"([\w\s\.\-\/]+)\" source-zone-name=\"([\w\s\.\-\/]+)\" destination-zone-name=\"([\w\s\.\-\/]+)\" session-id-32=\"([\w\s\.\-\/]+)\" packets-from-client=\"([\w\s\.\-\/]+)\" bytes-from-client=\"([\w\s\.\-\/]+)\" packets-from-server=\"([\w\s\.\-\/]+)\" bytes-from-server=\"([\w\s\.\-\/]+)\" elapsed-time=\"([\w\s\.\-\/]+)\" application=\"([\w\s\.\-\/]+)\" nested-application=\"([\w\s\.\-\/]+)\" username=\"([\w\s\.\-\/]+)\" roles=\"([\w\s\.\-\/]+)\" packet-incoming-interface=\"([\w\s\.\-\/]+)\" encrypted=\"([\w\s\.\-\/]+)\"\W");
  //var logArray = rtLogCloseRegex.exec(test);
  var string = msg.toString('utf8');
  //console.log(string);
  var entries = string.split(" ");
  for (entry in entries) {
    //console.log(entries[entry] + ' ' + entry);
    if (!!entries[entry].split("\"")[1]) {
      //console.log(entries[entry].split("\"")[1]);
      var field = entries[entry].split("\"")[0];
      var value = entries[entry].split("\"")[1];
      switch(field) {
        case 'source-address=':
          console.log(value);
        case 'source-port=':
              console.log(value);
        case 'destination-address=':
        case 'destination-port=':
        case 'service-name=':
        case 'nat-souce-address=':
        case 'nat-source-port=':
        case 'nat-destination-address=':
        case 'nat-destination-port=':
        case 'src-nat-rule-name=':
        case 'dst-nat-rule-name=':
        case 'protocol-id=':
        case 'policy-name=':
        case 'source-zone-name=':
        case 'destination-zone-name=':
        case 'session-id-32=':
        case 'packets-from-client=':
        case 'bytes-from-client=':
        case 'packets-from-server=':
        case 'bytes-from-server=':
        case 'elapsed-time=':
        case 'application=':
        case 'nested-application=':
        case 'username=':
        case 'roles=':
        case 'packet-incoming-interface=':
        case 'encrypted=':
        default:
          console.log('ignored')
      }
    };
  };
  //return object;
};

/*
 * <14>1 2012-05-02T20:41:10.805 SRXEdge RT_FLOW - RT_FLOW_SESSION_CLOSE [junos@2636.1.1.1.2.41 reason="unset" source-address="10.0.1.24" source-port="54895" destination-address="75.75.75.75" destination-port="53" service-name="junos-dns-udp" nat-source-address="50.76.52.162" nat-source-port="24181" nat-destination-address="75.75.75.75" nat-destination-port="53" src-nat-rule-name="1" dst-nat-rule-name="None" protocol-id="17" policy-name="1" source-zone-name="Trust" destination-zone-name="Untrust" session-id-32="926" packets-from-client="1" bytes-from-client="80" packets-from-server="1" bytes-from-server="128" elapsed-time="2" application="UNKNOWN" nested-application="UNKNOWN" username="N/A" roles="N/A" packet-incoming-interface="vlan.0" encrypted="No "]
 *
 *<14>1 2012-05-06T20:08:10.475 SRXEdge RT_FLOW - RT_FLOW_SESSION_CLOSE [junos@2636.1.1.1.2.41 reason="TCP FIN" source-address="10.0.1.24" source-port="51261" destination-address="17.173.66.48" destination-port="443" service-name="junos-https" nat-source-address="50.76.52.162" nat-source-port="20601" nat-destination-address="17.173.66.48" nat-destination-port="443" src-nat-rule-name="1" dst-nat-rule-name="None" protocol-id="6" policy-name="1" source-zone-name="Trust" destination-zone-name="Untrust" session-id-32="2500" packets-from-client="14" bytes-from-client="2458" packets-from-server="11" bytes-from-server="1184" elapsed-time="14" application="UNKNOWN" nested-application="UNKNOWN" username="N/A" roles="N/A" packet-incoming-interface="vlan.0" encrypted="No "]

  <14>1 0
  2012-05-06T20:08:10.475 1
  SRXEdge 2
  RT_FLOW 3
  - 4
  RT_FLOW_SESSION_CLOSE 5
  [junos@2636.1.1.1.2.41 6
  reason="TCP 7
  FIN" 8
  source-address="10.0.1.24" 9
  SRC
  source-port="51261" 10
  destination-address="17.173.66.48" 11
  destination-port="443" 12
  service-name="junos-https" 13
  nat-source-address="50.76.52.162" 14
  nat-source-port="20601" 15
  nat-destination-address="17.173.66.48" 16
  nat-destination-port="443" 17
  src-nat-rule-name="1" 18
  dst-nat-rule-name="None" 19
  protocol-id="6" 20
  policy-name="1" 21
  source-zone-name="Trust" 22
  destination-zone-name="Untrust" 23
  session-id-32="2500" 24
  packets-from-client="14" 25
  bytes-from-client="2458" 26
  packets-from-server="11" 27
  bytes-from-server="1184" 28
  elapsed-time="14" 29
  application="UNKNOWN" 30
  nested-application="UNKNOWN" 31
  username="N/A" 32
  roles="N/A" 33
  packet-incoming-interface="vlan.0" 34
  encrypted="No 35
  "] 36
  
 *
 */