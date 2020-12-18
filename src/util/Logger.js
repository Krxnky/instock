const winston = require('winston');

module.exports = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.prettyPrint(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.align(),
                winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`)
            )
        }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.align(),
                winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`)
            )
        })
    ]
})