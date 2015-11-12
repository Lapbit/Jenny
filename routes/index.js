var express = require('express');
var router = express.Router();
var indexDao = require('../server/db/indexDao.js');

var mysql = require('mysql');
var config = require('../server/config/config.js')
var pool  = mysql.createPool(config);


/* GET home page. */
router.get('/', function(req, res, next) {
  // var p1 = dashboardDao.get(1);
  // p1.then(function(rets){
  // 	console.log(rets);
  // })
  pool.query('select * from students where id=1', function(err, rows, fields){
  	if (err) throw err;
  	console.log('haha: ', rows);
  })
  // res.render('index', { title: 'Express' });
});

/* GET work page. */
router.get('/work', function(req, res, next) {
  res.render('work', { title: 'Express' });
});

module.exports = router;
