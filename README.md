# mlepay
Client for [ML ePay](https://www.mlepay.com/api/docs).

###Install
```bash
$ npm install mlepay
```

###Write index.js

```javascript
var Mlepay = require('mlepay');
var mlepay = new Mlepay({receiver_email:process.env.EMAIL, secret_key:process.env.SECRET_KEY});
var options = {
  sender_email: "node@example.com",
  sender_name: "Test",
  sender_phone: "+639178888888",
  sender_address: "Malacanang Palace",
  amount: 100000,
  payload: "123456",
  description: "iPhone 6S Plus Grey 128 GB",
};
mlepay.createNewTransaction(options)
  .then(function(transaction) {
    console.dir(transaction);
  })
  .catch(function(err) {
    console.error(err);
  });
```
###Run
```bash
$ node .
```
