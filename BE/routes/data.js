var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
const User = require("../model/user_model");
const Data = require("../model/data_model");
const checkAuth = require("../middleware/auth");

router.post("/getData", checkAuth, function (req, res, next) {
  getByFiltering(res, req.body);
});

router.post("/setFav", checkAuth,  async function (req, res, next) {
    var email = req.body.auth.email;
    var set = req.body.data.set;
    var id = req.body.data.id; 

    var query = Data.find({_id: id});
    query.select("fav");
    query.exec((err, fav) => {
        if(set){
            fav.push(email);
        } else {
            fav.splice(fav.indexOf(email), 1);
        }
        query = Data.findOne({_id: id});
        query.update({fav: [...fav]});
        query.exec((err, result) => {
            console.log(result);
            if(result.ok === 1) 
                getByFiltering(res, req.body);
        })
    })
  });

  router.post("/removeOne", checkAuth, function (req, res, next) {
    var id = req.body.data.id;    
    Data.remove({_id: id}, (result) => {
        console.log(result);
        getByFiltering(res, req.body);
    })
  });

  router.post("/appendItem", checkAuth, (req, res, next) => {
    const data = new Data({
        email: req.body.auth.email,
        name: req.body.data.name,
        loc: req.body.data.loc,
        fav: []
    }); console.log('OK');
    data.save((err) => {
        if(err)
            console.log(err);
        else
            getByFiltering(res, req.body);
    });
  });

  router.post("/updateItem", checkAuth, (req, res, next) => {
    var loc = req.body.data.loc;
    var name = req.body.data.name;
    var id = req.body.data.id; 

    var query = Data.find({_id: id});
    query.select("fav");
    query.exec((err, fav) => {
        query = Data.findOne({_id: id});
        query.update({name: name, loc: loc});
        query.exec((err, result) => {
            console.log(result);
            if(result.ok === 1) 
                getByFiltering(res, req.body);
        })
    })
  });

  const getByFiltering = (res, filter) => {
    var email = filter.auth.email;  
    var nameFilter = filter.data.nameFilter;
    var locFilter = filter.data.locFilter;
    var favFilter = filter.data.favFilter;
    var curPage = filter.data.curPage;
    const limitNum = 20;
    var skip = limitNum * (curPage - 1);
    //----- getting data from DB
    query = Data.find();          
    query.or([{email: email}, {email: ''}]);
    query.sort({name: 1});
    if(nameFilter !== '')
        query.where({ "name": { '$regex' : nameFilter, '$options' : 'i' } });
    if(locFilter !== '')
        query.where({ "loc": { '$regex' : locFilter, '$options' : 'i' } });
    if(favFilter)
    query.where( { fav: { $all: [email] } } );
    query.skip(skip).limit(limitNum);
    query.exec((err, result) => {
            query = Data.count();
            query.or([{email: email}, {email: ''}]);
            if(nameFilter !== '')
                query.where({ "name": { '$regex' : nameFilter, '$options' : 'i' } });
            if(locFilter !== '')
                query.where({ "loc": { '$regex' : locFilter, '$options' : 'i' } });
            if(favFilter)
                query.where( { 'fav': { $all: [email] } } );
            query.exec((err, count) => {
                console.log(count);
                var data = {
                    rests: result,
                    totalNum: count
                }
                res.send({ result: 'OK', data: data});
            })
    })
}

module.exports = router;