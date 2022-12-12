const { urlFormat } = require('../helper/UtilHelper');

const url1 = urlFormat({
    protocol: 'https',
    hostname: 'example.com',
    pathname: 'somepath'
});
console.log(`url1: ${url1}`);

const url2 = urlFormat({
    protocol: 'https',
    hostname: 'example.com',
    pathname: '/somepath'
});
console.log(`url2: ${url2}`);

const url3 = urlFormat({
    protocol: 'http:',
    hostname: 'example.com',
    port: 8080,
    pathname: '/somepath'
});
console.log(`url3: ${url3}`);

const url4 = urlFormat({
    protocol: 'https',
    hostname: 'example.com',
    port: 8080,
    pathname: '/somepath',
    username: 'john',
    password: 'abc',
    search: 'item=bike'
});
console.log(`url4: ${url4}`);