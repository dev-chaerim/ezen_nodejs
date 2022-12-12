/**
 * @Description : 파일, 폴더 처리 관련 유틸리티 함수 구현
 */

const fs = require('fs');
const { join } = require('path');

const mkdirs = (target, permission = '0755') => {

    if( target == undefined || target == null) { return;}

    target = target.replace(/\\/gi, '/');

    const target_list = target.split('/');

    let dir = '';

    if(target.substring(0, 1) == "/") {
        dir = "/";
    }

    target_list.forEach((v, i) => {
        dir = join(dir, v);

        if(v == ".") {
            return;
        }

        if(!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            fs.chmodSync(dir, permission);
        }
    })
};

module.exports.mkdirs = mkdirs;

