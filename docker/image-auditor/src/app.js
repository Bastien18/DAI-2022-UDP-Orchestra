const conf = require('./conf');
const dgram = require('dgram');
const net = require('net');

const socket        = dgram.createSocket('udp4');
const server        = net.createServer();
const instruments   = conf.INSTRUMENTS;
const musicians     = new Map();

function onMessage(message, source){
    const content = {
        ...JSON.parse(message),
        lastActive: Date.now(),
    };
    content.instrument = Object.keys(instruments).find((instrument) => instruments[instrument] === content.sound);
    content.activeSince = musicians.has(content.uuid) ? musicians.get(content.uuid).activeSince : content.lastActive;

    delete content.sound;
    musicians.set(content.uuid, content);

    console.log('Message from musician : ' + message + ' source port: ' + source.port + '\n');
}

function onConnect(socket){
    const now = Date.now();
    const content = Array.from(musicians.entries()).filter(([uuid, musician]) => {
        if((now - musician.lastActive) > conf.ACTIVE_INTERVAL){
            musicians.delete(uuid);
            return false;
        }
        return true;
    });

    const payload = JSON.stringify(content.map(([uuid, musician]) => ({
        uuid,
        instrument: musician.instrument,
        activeSince: new Date(musician.activeSince),
    })));

    socket.write(payload + '\n');
    socket.end();

}

socket.bind(conf.MULTICAST_PORT, () => {
    console.log('Multicast group joined');
    socket.addMembership(conf.HOST)
});

socket.on('message', onMessage);

server.listen(conf.TCP_PORT);
server.on('connection', onConnect);

