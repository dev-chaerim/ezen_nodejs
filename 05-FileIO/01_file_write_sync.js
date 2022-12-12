const fs = require('fs');

const target = './output_sync.txt';
const content = "Hello World\nNiceWorld";
const isExists = fs.existsSync(target);

if(!isExists) {
    fs.writeFileSync(target, content, 'utf8');
    fs.chmodSync(target, '0766');
    console.log(target + '파일에 데이터 쓰기 및 퍼미션 설정 완료.');
} else {
    fs.unlinkSync(target);
    console.log(target+ '파일 삭제 완료.');
}