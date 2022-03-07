var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require(`mongoose`);
var jwt = require(`jsonwebtoken`);

require(`dotenv`).config();

var version1indexRouter = require("./routes/index");
var version1usersRouter = require("./routes/users");
var version1booksRouter = require(`./routes/books`);
var version1commentsRouter = require(`./routes/comments`);

mongoose.connect(
  `mongodb://localhost/Api-BookStore`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    console.log(`Connected`, err ? false : true);
  }
);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/api/v1", version1indexRouter);
app.use("/api/v1/users", version1usersRouter);
app.use("/api/v1/books", version1booksRouter);
app.use("/api/v1/comments", version1commentsRouter);

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
