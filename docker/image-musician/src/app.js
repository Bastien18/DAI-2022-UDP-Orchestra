const {v4: uuidv4} = require('uuid');
const conf = require('./conf');
const dgram = require('dgram');

const socket = dgram.createSocket('udp4');
const uuid = uuidv4();

let message;
const instrument = process.argv[2];

if(!instrument || !conf.INSTRUMENTS.hasOwnProperty(instrument)){
    console.log('Invalid instrument');
    return;
}

const content = JSON.stringify({
    uuid,
    sound: conf.INSTRUMENTS[instrument],
});

message = Buffer.from(content);
function update(){
    socket.send(message, conf.MULTICAST_PORT, conf.HOST, () => {
       console.log('Sending message : ' + content + " on port " + socket.address().port)
    });
}

setInterval(update, conf.INTERVAL);