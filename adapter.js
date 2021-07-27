const net = require("net");
const port = 7070;
const host = "127.0.0.1";
const { loginPacket ,loginPacketResponse, heartbeatPacketResponse} = require('./packets');
const server = net.createServer();
const { PacketType } = require('./packetTypes')
server.listen(port, host, () => {
  console.log("TCP Server is running on port " + port + ".");
});


let sockets = [];

server.on("connection", function(sock) {
  console.log("Client Connected: " + sock.remoteAddress + ":" + sock.remotePort);
//   sockets.push(sock);

  sock.on("data", function(data) {
    console.log(data);
    //get the protocol number from buffer array
    let protocolNumber = data.slice(3,4);
    console.log(protocolNumber.toString('hex'));
    
    switch (protocolNumber.toString('hex')) {
        case PacketType.LoginInformation:
            console.log('Login packet received');
            sock.write(
                loginPacketResponse
            );
            //send login packet response
            // sockets.forEach(function(sock, index, array) {
            //     // sock.write(loginPacket)
            //     sock.write(
            //         loginPacketResponse
            //     );
            //   });
            break;
        case PacketType.HeartbeatPacket:
            console.log('heartbeat packet received');
            //write response for heartbeat packet
            sock.write(
                heartbeatPacketResponse
            );
            break;
        case PacketType.GPSPositioningData:
            console.log('gps location received');
            break;
        default:
            console.log('default');
            
            break;
    }
    // Write response data back to all the connected, the client will receive it as data from the server
    
  });

  // Add a 'close' event handler to this instance of socket
  sock.on("close", function(data) {
    let index = sockets.findIndex(function(o) {
      return (
        o.remoteAddress === sock.remoteAddress &&
        o.remotePort === sock.remotePort
      );
    });
    if (index !== -1) sockets.splice(index, 1);
    console.log("CLOSED: " + sock.remoteAddress + " " + sock.remotePort);
  });
});

//check if the incoming packet is login packet
function isLoginPacket(incomingPacket) {
  return Buffer.compare(loginPacket, incomingPacket) ? false : true;
}
