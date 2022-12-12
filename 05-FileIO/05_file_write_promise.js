const fs = require('fs');

const target = './output_promise.txt';
const content = 'Hello World!';
const isExists = fs.existsSync(target);

if(!isExists) {
    const myPromise = fs.promises.writeFile(target, content);

    myPromise
        .then(()=>{
            fs.promises.chmod(target, '0766').then(()=> {
                console.log('퍼미션 설정 완료');
            }).catch((e)=> {
                console.error("퍼미션 설정 완료");
                console.error(e);
            })
            console.debug('저장완료');
        })
        .catch((e)=>{
            console.error('저장실패');
            console.error(e);
        })
    
        console.log(target + '의 파일 저장을 요청했습니다.');
} else {
    fs.promises
        .unlink(target)
        .then(() => {
            console.debug('삭제완료');
        })
        .catch((e)=>{
            console.error('삭제실패');
            console.error(e);
        })
    
        console.log(target + '의 파일 삭제를 요청했습니다.');
}