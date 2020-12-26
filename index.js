require('dotenv').config();
const _ = require('lodash');
const { CronJob, CronTime } = require('cron');
const axios = require('axios');
const puppeteer = require('puppeteer-extra');
const Discord = require('discord.js');
const TimeoutManger = require('./src/classes/TimeoutManager');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin())

const util = require('./src/util/util');
const {logger, Print} = require('./src/util/Logger');

const Stores = require('./src/data/Stores');
const ScanType = require('./src/enums/ScanType');
const Channels = require('./src/enums/Channels');
const bot = new Discord.Client();
const timeoutManager = new TimeoutManger(30 * 60000);

const sendNotification = (channel, avatar, username, name, productName, status, price, image, url) => {
    const embed = new Discord.MessageEmbed()
    .setAuthor(username, avatar)
    .setColor('#5ACE7D')
    .setThumbnail(image)
    .setDescription(`[${productName}](${encodeURI(url)})`)
    .addField('Product', encodeURI(url))
    .addField('Price', (price) ? price : 'No price', true)
    .addField('Status', status, true)
    .setTimestamp()
    .setFooter('Developed by Krxnky#1274')

    bot.channels.fetch(channel)
        .then((c) => c.send({ embed: embed, content: ':rotating_light: Stock Update :rotating_light: <@302599378332549121>' }));
}

const sendError = (store, product, error) => {
    const errorString = `:warning: **Fatal Error!**\n\`Store: ${store.name}\nProduct: ${product.name}\` ${product.url}\n\n\`\`\`${error}\`\`\``;

    bot.channels.fetch(Channels.LOGS)
        .then((c) => c.send(errorString));
}

(async () => {
    await bot.login(process.env.TOKEN);
    const browser = await puppeteer.launch({});
    
    bot.stock_check = 1;

    console.log(`
    SSSSS .sSSSs.  SSSSS .sSSSSs.       .sSSSSSSSSs.   .sSSSSs.    .sSSSSs.    .sSSS  SSSSS  
    SSSSS SSSSS SS SSSSS SSSSSSSSSs. .sSSSSSSSSSSSSSs. SSSSSSSSSs. SSSSSSSSSs. SSSSS  SSSSS  
    S SSS S SSS  \`sSSSSS S SSS SSSS' SSSSS S SSS SSSSS S SSS SSSSS S SSS SSSSS S SSS SSSSS   
    S  SS S  SS    SSSSS S  SS       SSSSS S  SS SSSSS S  SS SSSSS S  SS SSSS' S  SS SSSSS   
    S..SS S..SS    SSSSS \`SSSSsSSSa. \`:S:' S..SS \`:S:' S..SS SSSSS S..SS       S..SSsSSSSS   
    S:::S S:::S    SSSSS .sSSS SSSSS       S:::S       S:::S SSSSS S:::S SSSSS S:::S SSSSS   
    S;;;S S;;;S    SSSSS S;;;S SSSSS       S;;;S       S;;;S SSSSS S;;;S SSSSS S;;;S  SSSSS  
    S%%%S S%%%S    SSSSS S%%%S SSSSS       S%%%S       S%%%S SSSSS S%%%S SSSSS S%%%S  SSSSS  
    SSSSS SSSSS    SSSSS SSSSSsSSSSS       SSSSS       SSSSSsSSSSS SSSSSsSSSSS SSSSS   SSSSS
    `)

    logger.info(`ℹ enabled stores: ${Stores.filter((s) => s.enabled).map((store) => store.name).join(', ')}`)
    const loop = new CronJob('5 */1 * * * *', async () => {
        for(const store of Stores.filter((s) => s.enabled)) {
            const page = await browser.newPage();
            for (const product of store.products) {
                logger.info(
                    Print.message('Checking stock...', product.name, store, true)
                )
                const results = [];
                try {
                    if(store.request_delay) await util.sleep(store.request_delay);
                    if(store.type == ScanType.SCRAPE) {
                        await page.goto(product.url);
                        const productStatus = await page.evaluate((store, product) => {
                            const result = [];
                            let total = 0;
                            if(product.type == 'search') {
                                const items = document.querySelectorAll(store.selectors[product.type].item);
                                total = items.length;
                                for (const item of items) {
                                    const status = item.querySelector(store.selectors[product.type].status).textContent.trim();
                                    const productImage = item.querySelector(store.selectors[product.type].image).src;
                                    const productName = item.querySelector(store.selectors[product.type].name).textContent.trim();
                                    if(!item.querySelector(store.selectors[product.type].price)) continue;
                                    const price = item.querySelector(store.selectors[product.type].price).textContent.trim()
                                    const url = item.querySelector(store.selectors[product.type].url).href;

                                    if(!store.excluded_flags.includes(status) && store.included_flags.includes(status)) {
                                        result.push({ productName, price, productImage, status, url });
                                    }
                                }
                            } else if(product.type == 'item') {
                                const status = document.querySelector(store.selectors[product.type].status).text().trim();
                                const productImage = document.querySelector(store.selectors[product.type].image).attr('src');
                                const productName = document.querySelector(store.selectors[product.type].name,).text();
                                const price = document.querySelector(store.selectors[product.type].price).text().trim();
                                const url = product.url;
            
                                if(!store.excluded_flags.includes(status) && store.included_flags.includes(status)) {
                                    result.push({ productName, price, productImage, status, url });
                                }
                            }

                            return Promise.resolve({ results: result, total: total });
                        }, store, product)
                        if(productStatus.total <= 0) throw 'No products found';
                        logger.info(
                            Print.message(`Products Found: ${productStatus.total}`, product.name, store, true)
                        )
                        productStatus.results.forEach((status) => results.push(status));
                    }
                    else if(store.type == ScanType.API) {
                        const res = await axios(product.url);
                        const items = _.get(res.data, store.selectors.item);
                        logger.info(
                            Print.message(`Found ${items.length} products`, product.name, store, true)
                        )
                        items.forEach((item) => {
                            const status = _.get(item, store.selectors.status);
                            const productImage = _.get(item, store.selectors.image);
                            const productName = _.get(item, store.selectors.name);
                            const price = _.get(item, store.selectors.price);
                            const url = _.get(item, store.selectors.url);

                            if(!store.excluded_flags.includes(status) && store.included_flags.includes(status)) {
                                results.push({ productName, price, productImage, status, url });
                            }
                        })
                    }
                    if(results.length > 0) {
                        results.forEach((result) => {
                            if(!timeoutManager.isTimedOut(result.url)) {
                                timeoutManager.timeoutProduct(result.url);
                                logger.info(
                                    Print.inStock(result.productName, store, true)
                                )
                                logger.info(
                                    Print.productInStock(result.url)
                                )
                                logger.info(`ℹ Product timed out for ${timeoutManager.delay}ms`)
                                sendNotification(product.channel, store.image, store.name, product.name, result.productName, result.status, result.price, result.productImage, result.url);
                            }
                        })
                    } else {
                        logger.info(
                            Print.outOfStock(product.name, store, true)
                        )
                    }
                } catch (error) {
                    logger.error(
                        Print.message(error, product.name, store, true)
                    )
                    sendError(store, product, error);
                }
            }
            page.close();
        }
    })
    loop.start();

    bot.on('message', async (message) => {
        const prefix = '.';
        const messageArray = message.content.split(' ');
        const cmd = messageArray[0].toLowerCase();
        const args = messageArray.slice(1);

        if(message.author.bot) return;
        if(cmd.substring(0, prefix.length) !== prefix) return;

        switch(cmd.slice(prefix.length)) {
            case 'stoploop': 
                loop.stop();
                message.channel.send(':white_check_mark: **Success!**\n\`Stock Loop: Stopped\`');
            break;

            case 'startloop':
                loop.start();
                message.channel.send(':white_check_mark: **Success!**\n\`Stock Loop: Started\`');
            break;

            case 'setcron': 
                if(args.length < 6) return message.channel.send(':x: **Error!**\n\`CronTime: Invalid\`')
                loop.setTime(new CronTime(args.join(' ')));
                message.channel.send(`:white_check_mark: **Success!**\n\`CronTime: ${args.join(' ')}\``);
            break;

            case 'nextcheck':
                message.channel.send(`:information_source: **Info**\n\`Next Check: ${loop.nextDate().utcOffset(-6).format('dddd hh:mm:ss')}\``)
            break;

            case 'togglestore':
                const store = Stores.find((s) => s.name.toLowerCase() == args.join(' ').toLowerCase());
                if(!store) return message.channel.send(':x: **Error!**\n\`Store Name: Invalid\`');

                store.enabled = !store.enabled;
                message.channel.send(`:white_check_mark: **Success!**\n\`Store: ${store.name}\nStatus: ${(store.enabled) ? 'Enabled' : 'Disabled'}\``);
            break;

            case 'setproducttimeout': 
                if(isNaN(args[0])) return message.channel.send(':x: **Error!**\n`Timeout: Invalid`');
                timeoutManager.delay = args[0];
                message.channel.send(`:white_check_mark: **Success!**\n\`Timeout: ${args[0]}ms\``);
            break;
        }
    })

    bot.channels.fetch(Channels.LOGS)
    .then((c) => c.send(`:arrows_counterclockwise: **InStock Started...**\n\`Enabled Stores: ${Stores.filter((s) => s.enabled).map((store) => store.name).join(', ')}\nNext Check: ${loop.nextDate().utcOffset(-6).format('dddd hh:mm:ss')}\nProduct Timeout: ${timeoutManager.delay}ms\``));

})();
