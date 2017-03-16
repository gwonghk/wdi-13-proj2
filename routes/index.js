var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* if they try to jump to home page directly,
its handeled in users.js
but why in app.get instead of router .get?? */

module.exports = router;
