var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  try{
    res.render('index', { title: 'Express' });
  }catch(err){
    res.json(err);
  }
});

module.exports = router;
