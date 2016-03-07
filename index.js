var httpClient = require('superagent');
var Promise = require('bluebird');
var crypto = require('crypto');

function Mlepay(opts) {
  if (!opts.receiver_email) {
    throw new Error('MissingReceiverEmail');
  }
  if (!opts.secret_key) {
    throw new Error('MissingSecretKey');
  }
  this.receiver_email = opts.receiver_email;
  this.secret_key = opts.secret_key;
  this.apiEndpoint = !opts.apiEndpoint ? 'https://www.mlepay.com/api/v2/transaction/create' : opts.apiEndpoint;
}

Mlepay.prototype = {
  createNewTransaction: function(txnOpts) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      if (!txnOpts.sender_email || !txnOpts.sender_name || !txnOpts.sender_phone || !txnOpts.sender_address || !txnOpts.amount) {
       reject(new Error('MissingRequiredParameters'));
      }
      var body = {
        receiver_email: _this.receiver_email,
        sender_email: txnOpts.sender_email,
        sender_name: txnOpts.sender_name,
        sender_phone: txnOpts.sender_phone,
        sender_address: txnOpts.sender_address,
        amount: txnOpts.amount,
        currency: txnOpts.currency === null ? "PHP": txnOpts.currency,
        timestamp: Math.floor(new Date() / 1000),
        nonce: crypto.randomBytes(8).toString('hex'),
        expiry: txnOpts.expiry,
        payload: txnOpts.payload,
        description: txnOpts.description,
      };
      var base = "POST&" + _quoteUrl(_this.apiEndpoint) + "&" + _quoteUrl(JSON.stringify(body));
      var signature = crypto.createHmac('sha256', _this.secret_key).update(base).digest('base64');
      httpClient.post(_this.apiEndpoint)
        .set('User-Agent', "mlepay node.js client 0.1.0")
        .set('X-Signature', signature)
        .send(body)
        .end(function(err, res) {
          if (err) {
            return reject(new Error(res.body.response + " ("+res.body.code+") " + res.body.description));
          }
          resolve(res.body);
        });
    });
  }
}

function _quoteUrl(url) {
    var safe = '/';
    var toUnencode = [];
    url = encodeURIComponent(url);
    for (var i = safe.length - 1; i >= 0; --i) {
        var encoded = encodeURIComponent(safe[i]);
        if (encoded !== safe.charAt(i)) {
            toUnencode.push(encoded);
        }
    }
    url = url.replace(new RegExp(toUnencode.join('|'), 'ig'), decodeURIComponent);
    return url;
}

module.exports = Mlepay;
