const _ = require('lodash');
const cron = require('cron').CronJob;
const axios = require('axios');
const puppeteer = require('puppeteer-extra');
const Discord = require('discord.js');
const TimeoutManger = require('./src/classes/TimeoutManager');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin())

const Webhook = new Discord.WebhookClient('782073864423079956', 'Jo2ohjAaUCpftzfiqtaH0ml7aPNJd6mXOln6hhuvw7MLHRhd7TE72s4vIPcQsikiTldq');

const util = require('./src/util/util');
const logger = require('./src/util/Logger');

const Stores = require('./src/data/Stores');
const ScanType = require('./src/enums/ScanType');
const timeoutManager = new TimeoutManger(5 * 60000);

const sendNotification = (avatar, username, name, productName, status, price, image, url) => {
    const embed = new Discord.MessageEmbed()
    .setAuthor(username, avatar)
    .setColor('#0098FA')
    .setThumbnail(image)
    .setTitle(`${name} Restock`)
    .setDescription(`[${productName}](${encodeURI(url)})`)
    .addField('Product', encodeURI(url))
    .addField('Price', (price) ? price : 'No price', true)
    .addField('Status', status, true)
    .setTimestamp()
    .setFooter('Developed by Krxnky#1274')

    Webhook.send({ embeds: [embed], content: ':rotating_light: Stock Update :rotating_light: <@302599378332549121>' });
}

const sendError = (avatar, username, product, error) => {
    const embed = new Discord.MessageEmbed()
    .setAuthor(username, avatar)
    .setColor('#FA2C00')
    .setTitle(`Error occurred whilst checking \`${product}\``)
    .setDescription('```\n' + error.toString() + '\n```')

    Webhook.send({ embeds: [embed] });
}

(async () => {
    const browser = await puppeteer.launch({});
    Webhook.send('Starting anual checks...');
    let check = 1;
    new cron('0 */1 * * * *', async () => {
        console.clear();
        logger.info(`Annual check #${check++}`)
        logger.info(`Checking stock for: ${Stores.filter((s) => s.enabled).map((store) => store.name).join(', ')}`)
        for(const store of Stores.filter((s) => s.enabled)) {
            console.time(store.name);
            const page = await browser.newPage();
            for (const product of store.products) {
                logger.info(`(${store.name}): Checking ${product.name}`);
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
                        logger.info(`(${store.name}) (${product.name}): Found ${productStatus.total}`);
                        productStatus.results.forEach((status) => results.push(status));
                    }
                    else if(store.type == ScanType.API) {
                        const res = await axios(product.url);
                        const items = _.get(res.data, store.selectors.item);
                        logger.info(`(${store.name}) (${product.name}): Found ${items.length}`);
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
                    logger.info(`(${store.name}): Found ${results.length} in stock`)
                    results.forEach((result) => {
                        if(!timeoutManager.isTimedOut(result.url)) {
                            timeoutManager.timeoutProduct(result.url);
                            logger.info(`!!!RESTOCK!!! ${result.url} (${result.productName}) (${store.name}) `);
                            sendNotification(store.image, store.name, product.name, result.productName, result.status, result.price, result.productImage, result.url);
                        }
                    })
                } catch (error) {
                    logger.error(`ERROR (${store.name}): ${product.name}: ${error}`);
                    sendError(store.image, store.name, product.name, error);
                }
            }
            page.close();
            console.timeEnd(store.name);
        }
    }).start();
})();
