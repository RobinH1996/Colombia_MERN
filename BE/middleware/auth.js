const User = require("../model/user_model");
const manageSession = require('./manageSession');


/************** CHECK AUTHORIZATION *************/

function checkAuth (req, res, next) {
  var email = req.body.auth.email;
  var psw = req.body.auth.psw;
  var query = User.find({email: email});
  query.exec(function (err, result) {
      if(result.length > 0){
          query = User.find({email: email, psw: psw});
          query.exec( function (err, result) {
            if(result.length > 0){
              manageSession(email, true, next, res);
            } else {
              res.send({ result: "Not Authorized" });
            }
          });
      } else {
        res.send({ result: "Not Authorized" });
      }
  });
}

module.exports = checkAuth;
