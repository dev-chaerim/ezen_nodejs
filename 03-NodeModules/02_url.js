const {URL} = require('url');

const myurl = 'http://www.itpaper.co.kr:8765/hello/world.html?a=123&b=456#home';

const location = new URL(myurl);

console.debug(location);
