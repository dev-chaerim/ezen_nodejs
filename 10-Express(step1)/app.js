

 /* -----------------------------------------------------
  | 1) 모듈참조
  -----------------------------------------------------*/

const logger = require('../helper/LogHelper');
const { myip, urlFormat } = require('../helper/UtilHelper');

const url = require('url');
const fs = require('fs');
const { join, resolve } = require('path');

const dotenv = require('dotenv');
const express = require('express');

const useragent = require('express-useragent');
const serveStatic = require('serve-static');
const serveFavicon = require('serve-favicon');
const { application } = require('express');

const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const cookieParser = require('cookie-parser');

const expressSession = require('express-session');

 /* -----------------------------------------------------
  | 2) Express 객체 생성
  -----------------------------------------------------*/

const app = express();

//설정파일 내용 가져오기
const configFileName = process.env.NODE_ENV === "production" ? ".env.server.development" : ".env.server.production";
const configPath = join(resolve(), configFileName);

if(!fs.existsSync(configPath)) {
    try {
        throw new Error();
    } catch(e) {
        console.error("================================================================");
        console.error("|            Configuration Init Error             |");
        console.error("================================================================");
        console.error("환경설정 파일을 찾을 수 없습니다. 환경설정 파일의 경로를 확인하세요.");
        console.error(`환경설정 파일 경로: ${configPath}`);
        console.error("프로그램을 종료합니다.");
        process.exit(1);
        
    }
}

//설정파일 로드
dotenv.config({ path: configPath });


 /* -----------------------------------------------------
  | 3) 클라이언트의 접속시 초기화
  -----------------------------------------------------*/

app.use(useragent.express());


//클라이언트의 접속 감지

app.use((req, res, next) => {
    logger.debug('클라이언트가 접속했습니다.');
    const beginTime = Date.now();

    const current_url = urlFormat({
        protocol: req.protocol,
        host: req.get('host'),
        port: req.port,
        pathname: req.originalUrl
    });

    logger.debug(`[${req.method}] ${decodeURIComponent(current_url)}`);

    //클라이언트의 IP주소 출력
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    //클라이언트의 디바이스 정보 기록
    logger.debug(`[client] ${ip} / ${req.useragent.os} / ${req.useragent.browser} / ${req.useragent.version} / ${req.useragent.platform}`);

    res.on('finish', () => {
        const endTime = Date.now();

        const time = endTime - beginTime;
        logger.debug(`클라이언트의 접속이 종료되었습니다. ::: [runtime] ${time}ms`);
        logger.debug('--------------------------------------------------------');
    })

    next();
})


 /* -----------------------------------------------------
  | 4) Express 객체의 추가 설정
  -----------------------------------------------------*/

   // app.use(bodyParser.urlencoded({ extended: true }));
  // app.use(bodyParser.text());
  // app.use(bodyParser.json());
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));

  app.use(methodOverride('X-HTTP-Method'));
  app.use(methodOverride('X-HTTP-Method-Override'));
  app.use(methodOverride('X-Method-Override'));
  
  app.use(cookieParser(process.env.COOKIE_ENCRYPT_KEY));

  app.use(expressSession({
    secret: process.env.SESSION_ENCRYPT_KEY,
    resave: false,
    saveUninitialized: false
  }))

  app.use('/', serveStatic(process.env.PUBLIC_PATH));

  app.use(serveFavicon(process.env.FAVICON_PATH));

  const router = express.Router();

  app.use('/', router);



 /* -----------------------------------------------------
  | 5) 각 URL별 백엔드 기능 정의
  -----------------------------------------------------*/

  router.get('/page1', (req, res, next)=> {
    let html = '<h1>Page1</h1>';
    html += '<h2>Express로 구현한 Node.js 백엔드 페이지</h2>';

    res.status(200).send(html);
  })

  router.get('/page2', (req, res, next) => {
    let html = {a:100, b: 200};
    res.status(200).send(html);
  })

  router.get('/page3', (req, res, next) => {
    res.redirect('https://www.naver.com');
  })

  router.get('/send_get', (req, res, next) => {
    logger.debug('[프론트엔드로부터 전달받은 GET 파리마터]');
    for(let key in req.query) {
      const str = '\t >>' + key + '=' + req.query[key];
      logger.debug(str);
    }
  
    const answer = req.query.answer;
    let html = null;
  
    if(parseInt(answer) == 300) {
      html = "<h1 style='color:#0066ff'>정답입니다.</h1>"
    } else {
      html = "<h1 style='color:#ff6600'>틀렸습니다.</h1>"
    }
  
    res.status(200).send(html);
  })
  
  router.get('/send_url/:username/:age', (req, res, next) => {
    logger.debug('[프론트엔드로부터 전달받은 URL 파라미터');
    for( let key in req.params) {
      const str = '/t >>' + key + '=' + req.params[key];
      logger.debug(str);
    }
  
    const html = "<h1><span style='color:#0066ff'>" + req.params.username + "</span>님은 <span style='color:#ff6600'>" + req.params.age+ "</span>세 입니다.</h1>";
  
    res.status(200).send(html);
  });

  router.post('/send_post', (req, res, next) => {
    logger.debug('[프론트엔드로부터 전달받은 POST 파리마터]');
    for(let key in req.body) {
      const str = '\t >>' + key + '=' + req.body[key];
      logger.debug(str);
    }

    const html = "<h1><span style='color:#0066ff'>" + req.body.username + "</span>님은 <span style='color:#ff6600'>" + req.body.email+ "</span> 입니다.</h1>";

    res.status(200).send(html);
  });

  router.put('/send_put', (req, res, next) => {
    logger.debug('[프론트엔드로부터 전달받은 PUT 파리마터]');
    for(let key in req.body) {
      const str = '\t >>' + key + '=' + req.body[key];
      logger.debug(str);
    }

    const html = "<h1><span style='color:#0066ff'>" + req.body.username + "</span>님은 <span style='color:#ff6600'>" + req.body.grade+ "</span> 학년 입니다.</h1>";

    res.status(200).send(html);
  });

  router.delete('/send_delete', (req, res, next) => {
    logger.debug('[프론트엔드로부터 전달받은 DELETE 파리마터]');
    for(let key in req.body) {
      const str = '\t >>' + key + '=' + req.body[key];
      logger.debug(str);
    }

    const html = "<h1><span style='color:#0066ff'>" + req.body.username + "</span>님은 <span style='color:#ff6600'>" + req.body.point+ "</span> 점 입니다.</h1>";

    res.status(200).send(html);
  });

  /** 상품에 대한 Restful API 정의하기 */

  router
      .get('/product/:productNumber', (req, res, next) => {
        const html = "<h1><span style='color:#0066ff'>" + req.params.productNumber + "</span>번 상품 <span style='color:#ff6600'>조회</span>하기</h1>";
        res.status(200).send(html);
      })
      .post('/product', (req, res, next) => {
        let html = "<h1><span style='color:#0066ff'>" + req.body.productNumber + "</span> 상품 <span style='color:#ff6600'>등록</span>하기</h1>";
        html += `<p>상품명: ${req.body.productName}</p>`;
        html += `<p>재고수량: ${req.body.qty}</p>`;
        res.status(200).send(html);
      })
      .put('/product/:productNumber', (req, res, next) => {
        const html = "<h1><span style='color:#0066ff'>" + req.params.productNumber + "</span> 상품 <span style='color:#ff6600'>수정</span>하기</h1>";
        
        res.status(200).send(html);
      })
      .delete('/product/:productNumber', (req, res, next) => {
        const html = "<h1><span style='color:#0066ff'>" + req.params.productNumber + "</span> 상품 <span style='color:#ff6600'>삭제</span>하기</h1>";
        
        res.status(200).send(html);
      })

  /** 쿠키 */
  router
    .post('/cookie', (req, res, next) => {
      const msg = req.body.msg;

      res.cookie('my_msg', msg, {
        maxAge: 30*1000,
        path: '/'
      });

      res.cookie('my_msg_signed', msg, {
        maxAge: 30*1000,
        path: '/',
        signed: true
      });

      res.status(200).send('ok');
    })
    .get('/cookie', (req, res, next) => {
      for(let key in req.cookies) {
        const str = '[cookies]' + key + '=' + req.cookies[key];
        logger.debug(str);
      }
      
      for(let key in req.signedCookies) {
        const str = '[signedCookies]' + key + '=' + req.signedCookies[key];
        logger.debug(str);
      }

      const my_msg = req.cookies.my_msg;
      const my_msg_signed = req.signedCookies.my_msg_signed;

      const result_data = {
        my_msg: my_msg,
        my_msg_signed: my_msg_signed
      };

      res.status(200).send(result_data);
    })
    .delete('/cookie', (req, res, next) => {
      res.clearCookie('my_msg', { path: '/'});
      res.clearCookie('my_msg_signed', { path: '/'});
      res.status(200).send('clear');
    })

    /** 세션 */
    router
        .post('/session', (req, res, next) => {
          const username = req.body.username;
          const nickname = req.body.nickname;

          req.session.username = username;
          req.session.nickname = nickname;

          const json = { rt: 'ok' };
          res.status(200).send(json);
        })
        .get('/session', (req, res, next) => {
          for(let key in req.session) {
            const str = '[session]' + key + '=' + req.session[key];
            logger.debug(str);
          }

          const my_data = {
            username: req.session.username,
            nickname: req.session.nickname
          };

          res.status(200).send(my_data);
        })
        .delete('/session', async (req, res, next) => {
          let result = 'ok';
          let code = 200;

          try {
            await req.session.destroy();
          } catch(e) {
            logger.error(e.message);
            result = e.message;
            code = 500;
          }

          const json = { rt: result};
          res.status(code).send(json);
        })

    router
        .post('/session/login', (req, res, next) => {
          const id = req.body.userid;
          const pw = req.body.userpw;

          logger.debug('id=' + id);
          logger.debug('pw=' + pw);

          let login_ok = false;
          if(id == 'node' && pw == '1234') {
            logger.debug('로그인 성공');
            login_ok = true;
          }

          let result_code = null;
          let result_msg = null;

          if (login_ok) {
            req.session.userid = id;
            req.session.userpw = pw;
            result_code = 200;
            result_msg = 'OK';
          } else {
            result_code = 403;
            result_msg = 'fail';
          }

          const json = { rt: result_msg};
          res.status(result_code).send(json);
        })
        .delete('/session/login', async (req, res, next) => {
          let result = 'ok';
          let code = 200;

          try {
            await req.session.destroy();
          } catch(e) {
            logger.error(e.message);
            result = e.message;
            code = 500;
          }

          const json = { rt: result };
          res.status(code).send(json);
        })
        .get('/session/login', (req, res, next) => {
          const id = req.session.userid;
          const pw = req.session.userpw;

          let result_code = null;
          let result_msg = null;

          if(id !== undefined && pw !== undefined) {
            logger.debug('현재 로그인중이 맞습니다.');
            result_code = 200;
            result_msg = 'ok';
          } else {
            logger.debug('현재 로그인 중이 아닙니다.');
            result_code = 400;
            result_msg = 'fail'
          }

          const json = { rt: result_msg};
          res.status(result_code).send(json);
        })

 /* -----------------------------------------------------
  | 6) 설정한 내용을 기반으로 서버 구동 시작
  -----------------------------------------------------*/

  const ip = myip();

  app.listen(process.env.PORT, () => {
    logger.debug('------------------------------------------------');
    logger.debug('|             Start Express Server             |');
    logger.debug('------------------------------------------------');

    ip.forEach((v, i) => {
        logger.debug(`server address => http://${v}:${process.env.PORT}`);
    });

    logger.debug('------------------------------------------------');
  })

  process.on('exit', function () {
    logger.debug('백엔드가 종료되었습니다.');
  });

  process.on('SIGINT', () => {
    process.exit();
  });