const {URL, URLSearchParams} = require('url');

const address = 'http://www.itpaper.co.kr/hello/world.html?a=123&b=456';
const {searchParams} = new URL(address);
console.debug(searchParams);

console.debug('요청 파라미터 중 a의 값: %s (%s)', searchParams.get('a'), typeof searchParams.get('a'));

const params = Object.fromEntries(searchParams);
console.log(params);

const obj = {name: 'hello', nick: 'world', 'address': '서울시 서초구'};
const str = new URLSearchParams(obj);
console.log('조합된 요청 파라미터 : %s', str);