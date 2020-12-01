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
            },
            {
                name: 'RTX 3090',
                url: 'https://api.bestbuy.com/v1/products((search=rtx&search=3090)&(categoryPath.id=abcat0507002))?apiKey=ooXTLEqUWOQkyIR6WmdGuDqy&format=json'
            }
        ]
    },
    {
        image: 'https://c1.neweggimages.com/WebResource/Themes/2005/Nest/logo_424x210.png',
        name: 'Newegg',
        type: ScanType.SCRAPE,
        request_delay: 5000,
        selectors: {
            search: {
                item: '.item-cell',
                image: '.item-img img',
                status: '.item-button-area',
                name: '.item-title',
                price: '.price-current',
                url: '.item-title'
            }
        },
        excluded_flags: ['Sold Out', 'Auto Notify'],
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
                name: 'RTX 3090',
                type: 'search',
                url: 'https://www.newegg.com/p/pl?N=100007709%204841%20601357248'
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
            },
            {
                name: 'RTX 3090 Combo',
                type: 'search',
                url: 'https://www.newegg.com/p/pl?d=rtx+3090+combo&N=31001489&isdeptsrh=1'
            }
        ]
    },
    // {
    //     image: 'https://90a1c75758623581b3f8-5c119c3de181c9857fcb2784776b17ef.ssl.cf2.rackcdn.com/images_sf_MC_logo.png',
    //     name: 'Micro Center',
    //     type: ScanType.SCRAPE,
    //     headers: {
    //         'Cookie': 'SortBy=match; _ga=GA1.2.1283361821.1605138472; _gcl_au=1.1.154948292.1605138472; a1ashgd=urke366v3z900000urke366v3z900000; _fbp=fb.1.1605138472553.267711440; __zlcmid=117jZw37Zpc5wWJ; T630202=TVNJIEdlRm9yY2UgUlRYIDMwNzAgVmVudHVzIDNYIE92ZXJjbG9ja2VkIFRyaXBsZS1GYW4gOEdCIEdERFI2IFBDSWUgNC4wIEdyYXBoaWNzIENhcmQ=; S630202=193326; S629088=182063; T629088=UE5ZIEdlRm9yY2UgUlRYIDMwNzAgWExSOCBHYW1pbmcgVHJpcGxlLUZhbiA4R0IgR0REUjYgUENJZSA0LjAgR3JhcGhpY3MgQ2FyZA==; storeSelected=155; S630201=193243; T630201=TVNJIEdlRm9yY2UgUlRYIDMwNzAgR2FtaW5nIFggVHJpbyBUcmlwbGUtRmFuIDhHQiBHRERSNiBQQ0llIDQuMCBHcmFwaGljcyBDYXJk; S628685=177071; T628685=QVNVUyBHZUZvcmNlIFJUWCAzMDkwIFN0cml4IE92ZXJjbG9ja2VkIFRyaXBsZS1GYW4gMjRHQiBHRERSNlggUENJZSA0LjAgR3JhcGhpY3MgQ2FyZA==; rpp=24; isOnWeb=False; _gid=GA1.2.445059566.1606686507; viewtype=grid; rearview=0,628685,630201,630202,629088; MicrocenterPrivacy=Accepted; myStore=true'
    //     },
    //     selectors: {
    //         search: {
    //             item: '.product_wrapper',
    //             image: '.result_left a img',
    //             status: '.result_right .details .detail_wrapper .stock span',
    //             name: '.result_right .details .detail_wrapper .pDescription .normal',
    //             price: '.result-right .details .price_wrapper .price',
    //             url: '.result_left a img'
    //         }
    //     },
    //     excluded_flags: ['Sold Out', 'Not Carried In This Store'],
    //     included_flags: ['in stock'],
    //     products: [
    //         {
    //             name: 'RTX 3070',
    //             type: 'search',
    //             url: 'https://www.microcenter.com/search/search_results.aspx?Ntk=all&Ntt=rtx%203070&sortby=match&N=4294966937&myStore=true'
    //         }
    //     ]
    // }
]