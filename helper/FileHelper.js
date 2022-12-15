/**
 * @Description : 파일, 폴더 처리 관련 유틸리티 함수 구현
 */

const fs = require('fs');
const { join, extname } = require('path');
const multer = require('multer'); //업로드 모듈

class FileHelper {
    static #current = null;

    static getInstance() {
        if(FileHelper.#current === null) {
            FileHelper.#current = new FileHelper();
        }

        return FileHelper.#current;
    }
    
    mkdirs (target, permission = '0755') {
    
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

    initMulter() {
        //업로드 될 폴더를 생성함
        this.mkdirs(process.env.UPLOAD_DIR);

        /** multer 객체 생성 --> 파일 제한 : 5개, 20M */
        const multipart = multer({
            /* 저장될 디렉토리 경로 및 파일 이름*/
            storage: multer.diskStorage({
                /** 업로드 된 파일이 저장될 디렉토리 설정 */
                // req는 요청정보, file은 최종적으로 업로드 된 결과 데이터가 저장되어 있을 객체
                destination: (req, file, callback) => {
                    
                    console.group("destination");
                    console.debug(file);
                    console.groupEnd();

                    //업로드 정보에 백엔드의 업로드 파일 저장 폴더 위치를 추가한다.
                    //윈도우 환경을 고려하여 역슬래시를 슬래시로 변경하는 처리 추가
                    file.upload_dir = process.env.UPLOAD_DIR.replace(/\\/gi, "/");

                    //multer 객체에게 업로드 경로를 전달
                    callback( null, file.upload_dir);
                },

                /** 업로드 된 파일이 저장될 파일 이름을 결정함 */
                filename: (req, file, callback) => {
                    console.group("filename");
                    console.debug(file);
                    console.groupEnd();

                    //파일의 원본 이름에서 확장자만 추출 --> ex) .png
                    const extName = extname(file.originalname).toLowerCase();
                    //파일이 저장될 이름 (현재_시각의_timestamp + 확장자)
                    const saveName = new Date().getTime().toString() + extName;

                    file.savename = saveName;
                    file.path = join(process.env.UPLOAD_URL, saveName).replace(/\\/gi, "/");
                    req.file = file;

                    callback(null, saveName);
                },
            }),
            /* 용량, 최대 업로드 파일 수 제한 설정*/
            limits : {

            },
            /* 업로드 될 파일의 확장자 제한 */
            fileFilter: (req, file, callback) => {

            },
        });

        return multipart;
    }

    /**
     * 에러가 존재한다면 에러 코드와 메시지를 설정하여 throw 시킨다.
     * @param {multer.MulterError} err 
     */
    checkUploadError(err) {

    }
}


module.exports = FileHelper.getInstance();

