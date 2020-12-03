const _ = require('lodash');

class TimeoutManager {
    constructor(delay) {
        this.delay = delay;
        this.timeouts = [];
    }

    timeoutProduct(productID) {
        this.timeouts.push(productID);
        setTimeout(() => {
            _.pull(this.timeouts, productID);
        }, this.delay);
    }

    isTimedOut(productID) {
        return this.timeouts.includes(productID);
    }
}

module.exports = TimeoutManager;