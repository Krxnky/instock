const ScanType = require('../enums/ScanType');

    // {
    //     image: 'https://pisces.bbystatic.com/image2/BestBuy_US/Gallery/BestBuy_Logo_2020-190616.png',
    //     name: 'Best Buy',
    //     type: ScanType.SCRAPE,
    //     selectors: {
    //         search: {
    //             item: '.sku-item',
    //             image: '.product-image',
    //             status: '.add-to-cart-button',
    //             name: '.sku-header a',
    //             price: '.priceView-customer-price [aria-hidden="true"]',
    //             url: '.sku-header a'
    //         },
    //         item: {
    //             image: '.primary-image',
    //             status: '.add-to-cart-button',
    //             name: '.sku-title',
    //             price: '.price-box .priceView-customer-price [aria-hidden="true"]',
    //         }
    //     },
    //     excluded_flags: ['Sold Out', 'Coming Soon'],
    //     included_flags: ['Add to cart', 'Add To Cart', 'add to cart', 'Add to Cart'],
    //     products: [
    //         {
    //             name: 'RTX 3070',
    //             type: 'search',
    //             url: 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&id=pcat17071&iht=y&keys=keys&ks=960&list=n&qp=category_facet%3DGPUs%20%2F%20Video%20Graphics%20Cards~abcat0507002%5Echipsetmanufacture_facet%3DChipset%20Manufacture~NVIDIA&sc=Global&st=rtx%203070&type=page&usc=All%20Categories'
    //         },
    //         {
    //             name: 'RTX 3080',
    //             type: 'search',
    //             url: 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&id=pcat17071&iht=y&keys=keys&ks=960&list=n&qp=chipsetmanufacture_facet%3DChipset%20Manufacture~NVIDIA&sc=Global&st=rtx%203080&type=page&usc=All%20Categories'
    //         },
    //         {
    //             name: 'RTX 3090',
    //             type: 'search',
    //             url: 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&id=pcat17071&iht=y&keys=keys&ks=960&list=n&qp=chipsetmanufacture_facet%3DChipset%20Manufacture~NVIDIA&sc=Global&st=rtx%203090&type=page&usc=All%20Categories'
    //         },
    //         {
    //             name: 'Xbox Series X',
    //             type: 'item',
    //             url: 'https://www.bestbuy.com/site/microsoft-xbox-series-x-1tb-console-black/6428324.p?skuId=6428324'
    //         },
    //         {
    //             name: 'PS5',
    //             type: 'item',
    //             url: 'https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149'
    //         }
    //     ]
    // },

module.exports = [
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
                url: 'https://api.bestbuy.com/v1/products((search=rtx&search=3070)&(categoryPath.id=abcat0507002))?apiKey=ooXTLEqUWOQkyIR6WmdGuDqy&format=json'
            },
            {
                name: 'RTX 3080',
                url: 'https://api.bestbuy.com/v1/products((search=rtx&search=3080)&(categoryPath.id=abcat0507002))?apiKey=ooXTLEqUWOQkyIR6WmdGuDqy&format=json'
            }
        ]
    },
    {
        image: 'https://c1.neweggimages.com/WebResource/Themes/2005/Nest/logo_424x210.png',
        name: 'Newegg',
        enabled: true,
        request_delay: 5000,
        type: ScanType.SCRAPE,
        selectors: {
            search: {
                item: '.item-cell .item-container',
                image: '.item-img img',
                status: '.item-button-area',
                name: '.item-title',
                price: '.price-current',
                url: '.item-title'
            }
        },
        excluded_flags: ['Sold Out', 'Auto Notify', 'View Details'],
        included_flags: ['Add to cart', 'Add To Cart', 'add to cart', 'Add to Cart'],
        products: [
            {
                name: 'RTX 3070',
                type: 'search',
                url: 'https://www.newegg.com/p/pl?N=100007709%204841%20601357250'
            },
            {
                name: 'RTX 3080',
                type: 'search',
                url: 'https://www.newegg.com/p/pl?N=100007709%20601357247%204841'
            },
            {
                name: 'RTX 3070 Combo',
                type: 'search',
                url: 'https://www.newegg.com/p/pl?d=rtx+3070+combo&N=31001489&isdeptsrh=1'
            },
            {
                name: 'RTX 3080 Combo',
                type: 'search',
                url: 'https://www.newegg.com/p/pl?d=rtx+3080+combo&N=31001489&isdeptsrh=1'
            }
        ]
    },
    {
        image: 'https://logodix.com/logo/695365.png',
        name: 'Micro Center',
        enabled: false,
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
                url: 'https://www.microcenter.com/search/search_results.aspx?Ntk=all&Ntt=rtx%203070&sortby=match&N=4294966937&storeid=155'
            },
            {
                name: 'RTX 3080',
                type: 'search',
                url: 'https://www.microcenter.com/search/search_results.aspx?Ntk=all&Ntt=rtx%203080&sortby=match&N=4294966937&storeid=155'
            }
        ]
    }
]