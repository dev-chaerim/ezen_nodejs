const fs = require('fs');

const target = './output_async.txt';
const content = 'Hello World!';
const isExists = fs.existsSync(target);

if(!isExists) {
    fs.writeFile(target, content, 'utf8', (err) => {
        if(err) {
            console.error(err);
            return;
        }

        console.debug(target + '에 데이터 쓰기 완료');

        fs.chmod(target, '0766', (err)=> {
            if(err) {
                console.error(err);
                return;
            }
        })

        console.debug(target + '의 퍼미션 설정을 요청했습니다.');
    });
    console.debug(target + '의 퍼미션 설정을 요청했습니다.');
} else {
    fs.unlink(target, (err) => {
        if(err) {
            console.error(err);
            return;
        }
        console.debug(target + '의 파일 삭제 완료');
    })
    console.debug(target + '의 파일 삭제를 요청했습니다.');
}