const axios = require('axios');
const cheerio = require('cheerio');
const Discord = require('discord.js');

const Webhook = new Discord.WebhookClient('782073864423079956', 'Jo2ohjAaUCpftzfiqtaH0ml7aPNJd6mXOln6hhuvw7MLHRhd7TE72s4vIPcQsikiTldq');
const Stores = require('./src/data/Stores');

const sendNotification = (avatar, username, name, productName, status, price, image, url) => {
    const embed = new Discord.MessageEmbed()
    .setAuthor(username, avatar)
    .setColor('#32CD32')
    .setThumbnail(image)
    .setTitle(`${name} In Stock`)
    .setDescription(`[${productName}](${encodeURI((username == 'Best Buy') ? 'https://www.bestbuy.com' + url : url)})`)
    .addField('Price', (price) ? price : 'No price', true)
    .addField('Status', status, true)
    .setTimestamp()
    .setFooter('Developed by Krxnky#1274')

    Webhook.send({ embeds: [embed], content: '<@302599378332549121>' });
}

const sendError = (avatar, username, product, error) => {
    const embed = new Discord.MessageEmbed()
    .setAuthor(username, avatar)
    .setColor('#FA2C00')
    .setTitle(`Error occurred whilst checking \`${product}\``)
    .setDescription('```\n' + error.toString() + '\n```')

    Webhook.send({ embeds: [embed], content: '<@302599378332549121>' });
}

let check = 1;
setInterval(() => {
    console.clear();
    console.log(`Annual check #${check++}`)
    console.log(`Checking stock for: ${Stores.map((store) => store.name).join(', ')}`)
    Stores.forEach((store) => {
        store.products.forEach(async (product) => {
            console.log(`INFO (${store.name}): Checking ${product.name}`);
            const results = [];
            try {
                const res = await axios(product.url);

                if(res.status !== 200) return console.log(`ERROR (${store.name}): ${product.name}: Status Code ${res.status}`);
        
                const $ = cheerio.load(res.data);

                if(product.type == 'search') {
                    $(store.selectors[product.type].item).each(function() {
                        const status = $(store.selectors[product.type].status, this).text().trim();
                        const productImage = $(store.selectors[product.type].image, this).attr('src');
                        const productName = $(store.selectors[product.type].name, this).text();
                        const price = $(store.selectors[product.type].price, this).text().trim();
                        const url = $(store.selectors[product.type].url, this).attr('href');

                        if(!store.excluded_flags.includes(status) && store.included_flags.includes(status)) {
                            results.push({ productName, price, productImage, url })
                        }
                    })
                } else if(product.type == 'item') {
                    const status = $(store.selectors[product.type].status).text().trim();
                    const productImage = $(store.selectors[product.type].image).attr('src');
                    const productName = $(store.selectors[product.type].name,).text();
                    const price = $(store.selectors[product.type].price).text().trim();
                    const url = product.url;

                    if(!store.excluded_flags.includes(status) && store.included_flags.includes(status)) {
                        results.push({ productName, price, productImage, url })
                    }
                }
    
                console.log(`INFO (${store.name}): Found ${results.length} in stock`)
                results.forEach((result) => {
                    sendNotification(store.image, store.name, product.name, result.productName, 'In Stock', result.price, result.productImage, result.url);
                })
            } catch (error) {
                console.log(`ERROR (${store.name}): ${product.name}: ${error}`);
                sendError(store.image, store.name, product.name, error);
            }

        })
    })
}, 5000)

