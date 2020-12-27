const ScanType = require('../enums/ScanType');
const Channels = require('../enums/Channels');

module.exports = [
    {
        image: 'https://selfpublishingadvice.org/wp-content/uploads/2013/12/Amazon-01.png',
        name: 'Amazon',
        enabled: false,
        type: ScanType.SCRAPE,
        selectors: {
            item: {
                image: '#landingImage',
                status: '#availability span',
                name: '#productTitle',
                price: '#priceblock_ourprice'
            }
        },
        excluded_flags: ['Currently unavailable.'],
        included_flags: ['In stock.'],
        addToCart: {
            baseUrl: 'https://www.amazon.com/gp/aws/cart/add-res.html?ASIN.1=%s&Quantity.1=1',
            regex: /\/dp\/(.*)/
        },
        products: [
            {
                name: 'evga xc3',
                type: 'item',
                url: 'https://www.amazon.com/dp/B08L8L71SM',
                channel: Channels.RTX_3070
            },
            {
                name: 'msi gaming x trio',
                type: 'item',
                url: 'https://www.amazon.com/dp/B08KWN2LZG',
                channel: Channels.RTX_3070
            },
            {
                name: 'msi ventus 3x oc',
                type: 'item',
                url: 'https://www.amazon.com/dp/B08KWLMZV4',
                channel: Channels.RTX_3070
            },
            {
                name: 'evga ftw3 ultra',
                type: 'item',
                url: 'https://www.amazon.com/dp/B08L8L9TCZ',
                channel: Channels.RTX_3070
            },
            {
                name: 'asus tuf gaming',
                type: 'item',
                url: 'https://www.amazon.com/dp/B08L8KC1J7',
                channel: Channels.RTX_3070
            }
        ]
    },
    {
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/B%26H_Foto_%26_Electronics_Logo.svg/1280px-B%26H_Foto_%26_Electronics_Logo.svg.png',
        name: 'B&H Photo',
        enabled: true,
        request_delay: 2500,
        type: ScanType.SCRAPE,
        selectors: {
            search: {
                item: 'div[data-selenium="miniProductPage"]',
                image: 'a[data-selenium="miniProductPageProductImgLink"] img',
                status: 'div[data-selenium="miniProductPageQuantityContainer"] button',
                name: 'span[data-selenium="miniProductPageProductName"]',
                price: 'span[data-selenium="uppedDecimalPriceFirst"]',
                url: 'a[data-selenium="miniProductPageProductNameLink"]'
            }
        },
        excluded_flags: ['Notify When Available'],
        included_flags: ['Add to Cart', 'Preorder'],
        products: [
            {
                name: 'RTX 3070',
                type: 'search',
                url: 'https://www.bhphotovideo.com/c/buy/rtx-3070/ci/48849',
                channel: Channels.RTX_3070
            },
            {
                name: 'RTX 3080',
                type: 'search',
                url: 'https://www.bhphotovideo.com/c/buy/rtx-3080/ci/48452',
                channel: Channels.RTX_3080
            }
        ]
    },
    {
        image: 'https://c1.neweggimages.com/WebResource/Themes/2005/Nest/logo_424x210.png',
        name: 'Newegg',
        enabled: true,
        request_delay: 2500,
        type: ScanType.SCRAPE,
        selectors: {
            search: {
                item: '.item-cell .item-container',
                productNum: '.item-features:nth-child(6)',
                image: '.item-img img',
                status: '.item-button-area',
                name: '.item-title',
                price: '.price-current',
                url: '.item-title'
            }
        },
        excluded_flags: ['Sold Out', 'Auto Notify', 'View Details'],
        included_flags: ['Add to cart', 'Add To Cart', 'add to cart', 'Add to Cart'],
        addToCart: {
            baseUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=%s',
            regex: /\/p\/(.*)/
        },
        products: [
            {
                name: 'RTX 3070',
                type: 'search',
                url: 'https://www.newegg.com/p/pl?N=100007709%204841%20601357250',
                channel: Channels.RTX_3070
            },
            {
                name: 'RTX 3080',
                type: 'search',
                url: 'https://www.newegg.com/p/pl?N=100007709%20601357247%204841',
                channel: Channels.RTX_3080
            },
            {
                name: 'RTX 3070 Combo',
                type: 'search',
                url: 'https://www.newegg.com/p/pl?d=rtx+3070+combo&N=31001489&isdeptsrh=1',
                channel: Channels.RTX_3070
            },
            {
                name: 'RTX 3080 Combo',
                type: 'search',
                url: 'https://www.newegg.com/p/pl?d=rtx+3080+combo&N=31001489&isdeptsrh=1',
                channel: Channels.RTX_3080
            }
        ]
    },
    {
        image: 'https://pisces.bbystatic.com/image2/BestBuy_US/Gallery/BestBuy_Logo_2020-190616.png',
        name: 'Best Buy',
        type: ScanType.API,
        enabled: true,
        request_delay: 5000,
        selectors: {
            item: 'products',
            image: 'images[0].href',
            status: 'orderable',
            name: 'name',
            price: 'regularPrice',
            url: 'url'
        },
        excluded_flags: ['SoldOut', 'AutoNotify', 'ComingSoon'],
        included_flags: ['Available'],
        products: [
            {
                name: 'RTX 3070',
                url: 'https://api.bestbuy.com/v1/products((search=rtx&search=3070)&(categoryPath.id=abcat0507002))?apiKey=ooXTLEqUWOQkyIR6WmdGuDqy&format=json',
                channel: Channels.RTX_3070
            },
            {
                name: 'RTX 3080',
                url: 'https://api.bestbuy.com/v1/products((search=rtx&search=3080)&(categoryPath.id=abcat0507002))?apiKey=ooXTLEqUWOQkyIR6WmdGuDqy&format=json',
                channel: Channels.RTX_3080
            }
        ]
    },
    {
        image: 'https://logodix.com/logo/695365.png',
        name: 'Micro Center',
        enabled: true,
        request_delay: 1000,
        type: ScanType.SCRAPE,
        selectors: {
            search: {
                item: '.product_wrapper',
                image: '.result_left a img',
                status: '.result_right .details .detail_wrapper .stock',
                name: '.result_right .details .detail_wrapper .pDescription .normal',
                price: '.result_right .details .price_wrapper .price span',
                url: '.result_right .details .detail_wrapper .pDescription .normal h2 a'
            }
        },
        excluded_flags: ['Sold Out', 'Not Carried In This Store'],
        included_flags: ['in stock', 'Limited Availabilty'],
        products: [
            {
                name: 'RTX 3070',
                type: 'search',
                url: 'https://www.microcenter.com/search/search_results.aspx?Ntk=all&Ntt=rtx%203070&sortby=match&N=4294966937&storeid=155',
                channel: Channels.RTX_3070
            },
            {
                name: 'RTX 3080',
                type: 'search',
                url: 'https://www.microcenter.com/search/search_results.aspx?Ntk=all&Ntt=rtx%203080&sortby=match&N=4294966937&storeid=155',
                channel: Channels.RTX_3080
            }
        ]
    }
]