const fs = require('fs');

const target = './output_async.txt';

if(fs.existsSync(target)) {
    fs.readFile(target, 'utf8', (err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        console.debug(data);
    })
    console.debug(target + '파일을 읽도록 요청했습니다.');
} else {
    console.debug(target + '파일이 존재하지 않습니다.')
}