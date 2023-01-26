var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
const manageSession = require('../middleware/manageSession');
const User = require("../model/user_model");
const Data = require("../model/data_model");
const presaveData =  [
  {email: 'a@a.com', _id: "1", name: 'Hot Dog', loc: 'New York', fav: [] },
  {email: 'b@b.com', _id: "2", name: 'China Food', loc: 'Beijing', fav: [] },
  {email: 'c@c.com', _id: "3", name: 'Good Wine', loc: 'Moscow', fav: [] },
  {email: '', _id: "4", name: 'sldkekdf', loc: 'NewYork', fav: [] },
  {email: '', _id: "5", name: 'ddgff', loc: 'rrwer', fav: [] },
  {email: '', _id: "6", name: 'wersdr', loc: 'sdfefsd', fav: [] },
  {email: '', _id: "7", name: 'ccvsrfg', loc: 'ghjgh', fav: [] },
  {email: '', _id: "8", name: 'dfgegsvg', loc: 'rtyrt', fav: [] },
  {email: '', _id: "9", name: 'cvbfgsdf', loc: 'dfgdfg', fav: [] },
  {email: 'a@a.com', _id: "10", name: 'aasdwef', loc: 'fdfgdf', fav: [] },
  {email: 'a@a.com', _id: "11", name: 'sdfefdvbd', loc: 'dfgdfg', fav: [] },
  {email: 'a@a.com', _id: "12", name: 'zsdfgs', loc: 'NewdfgdfgYork', fav: [] },
  {email: 'a@a.com', _id: "13", name: 'ertert3ed', loc: 'NewerterYork', fav: [] },
  {email: 'a@a.com', _id: "14", name: 'fgngh', loc: 'fgdfgd', fav: [] },
  {email: 'a@a.com', _id: "15", name: 'sdfsderer', loc: 'NewdYork', fav: [] },
  {email: 'a@a.com', _id: "16", name: '345dgdedfe', loc: 'tgbtgbt', fav: [] },
  {email: 'a@a.com', _id: "17", name: 'ert34', loc: 'yffdfgd', fav: [] },
  {email: 'a@a.com', _id: "18", name: 'rty45efdge', loc: 'iokjkl', fav: [] },
  {email: 'a@a.com', _id: "19", name: 'rter33', loc: 'jkjmy', fav: [] },
  {email: 'b@b.com', _id: "20", name: 'yutyuty', loc: 'ghngyt', fav: [] },
  {email: 'b@b.com', _id: "21", name: '54ddfgdfyt', loc: 'ghntyutyu', fav: [] },
  {email: '', _id: "22", name: 'xcvdfgd5', loc: 'ghntfgb', fav: [] },
  {email: 'b@b.com', _id: "23", name: 'fdfghfg5', loc: 'dgfge', fav: [] },
  {email: 'b@b.com', _id: "24", name: 'fgdr455', loc: 'dfgeryujk', fav: [] },
  {email: '', _id: "25", name: 'dfger54', loc: 'dtfyft', fav: [] },
  {email: 'b@b.com', _id: "26", name: 'cvbbfgh545', loc: 'urtrbyu', fav: [] },
  {email: 'b@b.com', _id: "27", name: 'dfgert45', loc: 'ugtrgfdrt', fav: [] },
  {email: 'b@b.com', _id: "28", name: 'bfgrt5', loc: 'dfrfherg', fav: [] },
  {email: 'b@b.com', _id: "29", name: 'dfgre5', loc: 'dfgrghyf', fav: [] },
  {email: 'c@c.com', _id: "30", name: 'wsdfgd5t', loc: 'hjythtf', fav: [] },
  {email: 'c@c.com', _id: "31", name: '56egfgdf', loc: 'fygcvgbf', fav: [] },
  {email: 'c@c.com', _id: "32", name: 'dfger4', loc: 'ryvbyuuigv', fav: [] },
  {email: 'c@c.com', _id: "33", name: 'dfgery345e', loc: 'xdfrgfev', fav: [] },
  {email: 'c@c.com', _id: "34", name: 'xrfrer4', loc: 'bgfhvdg', fav: [] },
  {email: 'c@c.com', _id: "35", name: 'cxcvrfe', loc: 'thjunh', fav: [] },
  {email: 'c@c.com', _id: "36", name: 'bcvbdft', loc: 'jutyujuj', fav: [] },
  {email: 'c@c.com', _id: "37", name: 'dfgertgc', loc: 'rdgfdgh', fav: [] },
  {email: '', _id: "38", name: 'cxxvfe4', loc: 'rthrnrdef', fav: [] },
  {email: '', _id: "39", name: 'dfgde4', loc: 'ergrtfth', fav: [] },
  {email: '',_id: "40", name: 'wwer34', loc: 'tyj6tyujtj', fav: [] },
  {email: 'c@c.com',_id: "41", name: 'dfg4f34d', loc: 'fdfgsg', fav: [] },
  {email: '',_id: "42", name: 'dfghryer4', loc: 'dfgrthrty', fav: [] },
  {email: 'c@c.com',_id: "43", name: 'dfger54', loc: 'dfgghntn', fav: [] },
  {email: '',_id: "44", name: '34gdfd', loc: 'ffgfghthf', fav: [] },
  {email: '',_id: "45", name: 'sgerge45', loc: 'dfvsdfreh', fav: [] },
  {email: '',_id: "46", name: 'defdgdfe', loc: 'dfgerytty', fav: [] },
  {email: '',_id: "47", name: '3e4tert3', loc: 'dfgdferte', fav: [] },
  {email: '',_id: "48", name: 'HoxfvxcgetDog', loc: 'rtjhbg', fav: [] },
  {email: 'c@c.com',_id: "49", name: '45gdfgdfg', loc: 'sdsdhhg', fav: [] },
  {email: 'c@c.com',_id: "50", name: '67rhry', loc: 'uyuhgg', fav: [] },
  {email: 'c@c.com',_id: "51", name: 'uiuiuyuiy', loc: 'wwsdc'}
];

router.post("/signUp", function (req, res, next) {
  var email = req.body.email;

  var query = User.find({email: email});
  query.exec((err, result) => {
    if(result.length > 0) {
      res.send({ result: "REPEAT" });
    } else {
      const user = new User({
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
        psw: req.body.psw
      });
      user.save((err) => {
        if(err){
          res.send({ result: err });
        } else {
          res.send({ result: "OK" });

          /********** PRE-SAVE TABLE DATA *************/
          query = Data.find();
          query.exec((err, result) => {
            if(result.length === 0){
              for(var i =0; i < presaveData.length; i++){
                const rest = new Data({
                  email: presaveData[i].email,
                  name: presaveData[i].name,
                  loc: presaveData[i].loc,
                  fav: presaveData[i].fav
                });
                rest.save((err) => {
                  if(err){
                    res.send({result: "data pre-saving failed."});
                  }
                })
              }
            }
          })


        }
      });
    }
  });
});

router.post("/logIn", function (req, res, next){
  var email = req.body.email;
  var psw = req.body.psw;

  var query = User.find({email: email});
  query.exec(function (err, result) {
    if(result.length > 0){
      query = User.find({email: email, psw: psw});
      query.exec( function (err, result) {
        if(result.length > 0){
          manageSession(email, false, null, res);
        } else {
          res.send({ result: 'PSW_ERR' });
        }
      });
    } else {
      res.send({ result: 'NO_EMAIL'});
    }
  });
});

module.exports = router;