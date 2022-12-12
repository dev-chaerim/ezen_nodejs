const { channel } = require('diagnostics_channel');
const { EventEmitter } = require('events');

class Radio extends EventEmitter {
    constructor() {
        super();
    }
}

const radio = new Radio();

radio.setMaxListeners(5);

const onTurnOn = (channel) => console.debug('라디오가 켜졌습니다. 채널번호=' + channel);
radio.on('turnon', onTurnOn);
radio.on('turnon', (channel)=> console.log('Hello Radio' + channel));
radio.addListener('changechannel', (channel)=> console.log('채널이 %d 번으로 변경되었습니다.', channel));

radio.once('turnoff', (channel)=> console.log('라디오가 꺼졌습니다. 채널번호=' + channel));

for(let i=0; i<2; i++) {
    console.group('%d번째 실행중...', i+1);
    radio.emit('turnon', i);
    radio.emit('changechannel', i);

    radio.emit('turnoff', i);
    console.debug();
    console.groupEnd();
}

radio.removeListener('turnon', onTurnOn);
radio.emit('turnon', 1000);