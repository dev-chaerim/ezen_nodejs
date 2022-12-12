const path = require('path');

const currentPath = path.join('C:/Users/hello/world', 'myphoto', '../photo.jpg');
console.group("\npath.join");
console.debug(currentPath);
console.groupEnd();

const dirname = path.dirname(currentPath);
const basename = path.basename(currentPath);
const extname = path.extname(currentPath);
console.group("\n경로 분할하기");
console.debug('디렉토리:%s', dirname);
console.debug('파일 이름:%s', basename);
console.debug('확장자:%s', extname);
console.groupEnd();

const parse = path.parse(currentPath);
console.group("/n경로정보 파싱");
console.debug(parse);
console.debug("root:" + parse.root);
console.debug("dir:" + parse.dir);
console.debug("name:" + parse.name);
console.debug("ext:" + parse.ext);
console.groupEnd();