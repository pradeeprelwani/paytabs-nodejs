var express = require('express');
var router = express.Router();
var Paytabs = require('../services/Paytabs');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/paytabs', Paytabs.createPage);
router.post('/paytabs/returnUrl', Paytabs.returnUrl);

module.exports = router;
