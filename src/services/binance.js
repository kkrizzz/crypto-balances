const Bluebird = require("bluebird");
const req = Bluebird.promisify(require("request"));

// const decimals = 8;
// const multiplier = Math.pow(10, decimals);
const ASSET = "BNB";

module.exports = {
    supported_address: [ ASSET ],

    check(addr) {
        return RegExp('^bnb1\\w{37,39}$').test(addr);
    },

    symbol(addr) {
        return ASSET;
    },

    fetch(addr) {
        const url = `https://explorer.binance.org/api/v1/balances/${addr}`;

        return req(url, {json: true})
        .timeout(5000)
        .cancellable()
        .spread(function(resp, json) {
            if (resp.statusCode < 200 || resp.statusCode >= 300) throw new Error(JSON.stringify(resp));

            const asset = json.balance.find(b => b.asset === ASSET);
            const balance = asset ? asset.free : 0;

            return {
                quantity: balance,
                asset: ASSET
            };
        });
    }
};
