process.on('exit', ()=> {
    console.debug('exit 이벤트 발생함.');
});

process.on('onSayHello', (a, b) => {
    console.debug('onSayHello 이벤트 발생함: %s %s', a, b);
});

setTimeout(()=> {
    console.debug('2초 후에 onSayHello 이벤트 전달 시도함.');
    process.emit('onSayHello', 'Hello', 'World');
}, 2000);

console.debug('-----프로그램 흐름 종료--------');