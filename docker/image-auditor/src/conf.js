const HOST = '239.255.12.12';
const MULTICAST_PORT = 6565;
const TCP_PORT = 2205;
const ACTIVE_INTERVAL = 5000;
const INSTRUMENTS = {
    piano: 'ti-ta-ti',
    trumpet: 'pouet',
    flute: 'trulu',
    violin: 'gzi-gzi',
    drum: 'boum-boum',
};

module.exports = {
    HOST,
    MULTICAST_PORT,
    TCP_PORT,
    ACTIVE_INTERVAL,
    INSTRUMENTS,
};