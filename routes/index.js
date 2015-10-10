var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET work page. */
router.get('/work', function(req, res, next) {
  res.render('work', { title: 'Express' });
});

module.exports = router;
