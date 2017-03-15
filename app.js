var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var socketio = require('socket.io');
var passportSocketIo = require('passport.socketio');

var app = express();
var http = require('http');
var server = http.Server(app);
var io = socketio(server);

//____________________
//  Setup Middleware  \\________________

//connect w/ MongoDB ***
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
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
//var sessionStore = new express.session.MemoryStore();
app.use(session({
    //store: sessionStore,
    resave: true,
    saveUninitialized: true,
    secret: 'wdi-13-hk'
}));
app.use(passport.initialize());
app.use(passport.session());

// setup passport strategies
require('./passport/facebook')(passport);


var index = require('./routes/index');
var users = require('./routes/users')(app, passport);

app.use('/', index);
//app.use('/users', users); ** line was not neccessary because routes/user.js already modifies the app.js directly, so there is no point to tell it to go look for users middleware.


//___________________________
//  Setup Passport Socket    \________________

io.use(passportSocketIo.authorize({
  //store: sessionStore,
  key: 'connect.sid',
  secret: 'wdi-13-hk',
  passport: passport,
  cookieParser: cookieParser
}));

//_______________________
//  Import Controllers   \__________________
// *** dont need to do this if im using sockets.js to manage everyting
//var movementController = require('./controller/movementController');
//app.use('/', movementController);


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


//_______________________
//  Event Socket         \__________________
var eventSocket = io.of('/events');
eventSocket.on('connection', function(socket) {
  console.log('!!!!!!!!!Connection established!!!!!!!!!!!!');
  // example 'event1', with an object. Could be triggered by socket.io from the front end
  socket.on('step', function(podo_step_oldData){    // user data from the socket.io passport middleware
    if (socket.request.user && socket.request.user.logged_in) {
      console.log('SERVER Socket received podo_step_old data:', podo_step_oldData);
      movementController.saveStep(podo_step_oldData)
    }
  });
});

module.exports = app;
