const { mkdirs} = require('../helper/FileHelper');
const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");
const dotenv = require("dotenv");
const { join, resolve } = require("path");
const fs = require("fs");

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

dotenv.config({ path: configPath });

mkdirs(process.env.LOG_PATH);

const { combine, timestamp, printf, splat, colorize } = winston.format;

const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: "YY/MM/DD HH:mm:ss SSS",
        }),
        printf((info) => {
            return `${info.timestamp} [${info.level}]: ${info.message}`;
        }),
        splat()
    ),

    transports: [
        new winstonDaily({
            name: "log",
            level: process.env.LOG_LEVEL,
            datePattern: "YYMMDD",
            dirname: process.env.LOG_PATH,
            filename: "log_%DATE%.log",
            maxSize: 50000000,
            maxFiles: 50,
            zippedArchive: true,
        })
    ]
});

if(process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            prettyPrint: true,
            showLevel: true,
            level: process.env.LOG_LEVEL,
            format: combine(
                colorize({ all: true}),
                printf((info) => {
                    return `${info.timestamp} [${info.level}]: ${info.message}`;
                })
            )
        })
    );
}

module.exports = logger;