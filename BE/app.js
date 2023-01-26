require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var exphbs  = require('express-handlebars');
mongoose.connect("mongodb://localhost:27017/rests", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var app = express();
app.use(cors());
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dataRouter = require("./routes/data");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  //console.log(process.env.JWT_TOKEN);
  console.log("connected!");
});
// view engine setup
app.set("views", "./views/");
//app.set("view engine", "pug");
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/data", dataRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(express.static('public'));
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
