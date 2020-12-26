const winston = require('winston');
const chalk = require('chalk');
const util = require('./util');

const prettyJson = winston.format.printf((info) => {
    const timestamp = new Date().toLocaleTimeString();

    let out = `${chalk.grey(`[${timestamp}]`)} ${info.level} ${chalk.grey(
		'::'
    )} ${info.message}`;
    
    if (Object.keys(info.metadata).length > 0) {
		out = `${out} ${chalk.magenta(JSON.stringify(info.metadata, null, 2))}`;
    }
    
    return out;
})

const buildProductString = (name, store, color) => {
    if (color) {
		return (
			chalk.cyan(`[${store.name}]`) +
			chalk.grey(` ${util.truncate(name, 50)}`)
		);
	}

	return `[${store.name}] ${util.truncate(name, 50)}`;
}

const buildSetupString = (topic, store, color) => {
    if (color) {
		return (
			chalk.cyan(`[${store.name}]`) + chalk.grey(` [${topic}]`)
		);
	}

	return `[${store.name}] [${topic}]`;
}

module.exports.logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.metadata({
                    fillExcept: ['level', 'message', 'timestamp']
                }),
                prettyJson
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

module.exports.Print = {
    outOfStock(name, store, color) {
		if (color) {
			return (
				'✖ ' +
				buildProductString(name, store, true) +
				' :: ' +
				chalk.red('OUT OF STOCK')
			);
		}

		return `✖ ${buildProductString(name, store)} :: OUT OF STOCK`;
    },
    inStock(name, store, color) {
        const productString = `${buildProductString(name, store)} :: IN STOCK`;

        if (color) {
			return chalk.bgGreen.white.bold(`🚀🚨 ${productString} 🚨🚀`);
        }
        
        return `🚀🚨 ${productString} 🚨🚀`;
    },
    productInStock(url) {
        const productString = `Product Page: ${url}`;

        return productString;
    },
    message(message, topic, store, color) {
        if (color) {
			return (
				'✖ ' +
				buildSetupString(topic, store, true) +
				' :: ' +
				chalk.yellow(message)
			);
		}

		return `✖ ${buildSetupString(topic, store)} :: ${message}`;
    }
}