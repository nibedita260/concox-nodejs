const net = require("net");
const client = new net.Socket();
const port = 7070;
const host = "127.0.0.1";
const { loginPacket,heartbeatPacket, gpsPacket } = require('./packets.js');
const { PacketType } = require('./packetTypes')

let loginInterval;
let heartbeatInterval;

client.connect(port, host, function() {
  console.log("Connected",loginPacket);
  // client.write("Hello From Client " + client.address().address);

  loginInterval = setInterval(() => {
    client.write(loginPacket);
  }, 1000);

});
client.on("data", function(data) {
  let protocolNumber = data.slice(3,4);
    console.log(protocolNumber.toString('hex'));
  switch (protocolNumber.toString('hex')) {
    case PacketType.LoginInformation:
      console.log("Server Says Login Success : ");

      //stop sending login packets
      clearInterval(loginInterval);
    
      //send heartbeat packets
      console.log('send heartbeat packets');
      heartbeatInterval = setInterval(()=>{
        client.write(heartbeatPacket)
        client.write(gpsPacket)
      },1000);
        break;
    case PacketType.HeartbeatPacket:
        console.log('heartbeat packet response received');
        break;
    default:
        console.log('default');
        
        break;
}
  
});
client.on('error', function(err){
  console.log(err);
  
})
client.on("close", function() {
  console.log("Connection closed");
});
