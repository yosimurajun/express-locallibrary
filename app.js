var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var dev_db_url = `mongodb+srv://libraryexample:example@cluster0.ajhou.mongodb.net/myFirstDatabase?retryWrites=true`;
// const mongoDB = process.env.MONGODB_URI || dev_db_url;

var mongoose = require("mongoose");

mongoose.connect(dev_db_url);

var db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
let catalog = require("./routes/catalog");

const compression = require("compression");
const helmet = require("helmet");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());
app.use(compression());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalog);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

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
