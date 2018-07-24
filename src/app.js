require('./models/init');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var connectMongodb = require('connect-mongo');
var session = require('express-session');

var pageRouter = require('./route.page');
var apiRouter = require('./route.api');
var config = require('./config');
var auth = require('./middlewares/auth');

var mongoStore = new connectMongodb(session);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.cookieName));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: config.sessionSecret,
    store: new mongoStore({
      url: config.mongodbUrl
    }),
    resave: true,
    saveUninitialized: true,
  })
);
app.use(auth.authUser);
app.use('/', pageRouter);
app.use('/api/v1', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.format({
    json() {
      res.send({ error: err.toString() } );
    },
    html() {
      res.render('error');
    },

    default() {
      const message = `${errorDetails}`;
      res.send(`500 Internal Server error:\n${err.toString}`);
    },
  })
});

module.exports = app;
