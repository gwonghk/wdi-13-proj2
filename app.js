var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var app = express();

//____________________
//  Setup Middleware  \\________________

//connect w/ MongoDB ***
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/proj2');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




//____________________
//  Setup Passport   \\________________

// disable deprication error msgs
app.use(session({
    secret: 'wdi-13-hk',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// setup passport strategies
require('./passport/facebook')(passport);


var index = require('./routes/index');
var users = require('./routes/users')(app, passport);

//console.log(users);

app.use('/', index);
//app.use('/users', users); ** line was not neccessary because routes/user.js already modifies the app.js directly, so there is no point to tell it to go look for users middleware.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
