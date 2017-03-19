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
var MongoStore = require('connect-mongo')(session);
var graph = require('fbgraph');

var app = express();
var http = require('http');
var server = http.Server(app);
//var io = socketio(server);

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

var mongoStoreObj = new MongoStore({ mongooseConnection: mongoose.connection })

// disable deprication error msgs
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: 'wdi-13-hk',
	store: mongoStoreObj
}));

app.use(passport.initialize());
app.use(passport.session());

// setup passport strategies
require('./passport/facebook')(passport);
var index = require('./routes/index');
var users = require('./routes/users')(app, passport);

app.use('/', index);
//app.use('/users', users); ** line was not neccessary because routes/user.js already modifies the app.js directly, so there is no point to tell it to go look for users middleware.



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



/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var http = require('http');
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 *  Socket.io
 */
var io = require('socket.io')(server);
var sockets = require('./socket/socket')(io);


//With Socket.io >= 1.0
io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,         // the same middleware you registrer in express
    key:          'connect.sid',        // the name of the cookie where express/connect stores its session_id
    secret:       'wdi-13-hk',     // the session_secret to parse the cookie
    store:        mongoStoreObj,           // we NEED to use a sessionstore. no memorystore please
    success:      onAuthorizeSuccess,   // *optional* callback on success - read more below
    fail:         onAuthorizeFail,      // *optional* callback on fail/error - read more below
}));



function onAuthorizeSuccess(data, accept){
    console.log('SOCKET-PASSPORT: successful connection to socket.io');

    // The accept-callback still allows us to decide whether to
    // accept the connection or not.
    accept(null, true);

    // OR

    // If you use socket.io@1.X the callback looks different
    accept();
}

function onAuthorizeFail(data, message, error, accept){
    if(error)
        throw new Error(message);
    console.log('SOCKET-PASSPORT: failed connection to socket.io:', message);

    // We use this callback to log all of our failed connections.
    accept(null, false);

    // OR

    // If you use socket.io@1.X the callback looks different
    // If you don't want to accept the connection
    if(error)
        accept(new Error(message));
    // this error will be sent to the user as a special error-package
    // see: http://socket.io/docs/client-api/#socket > error-object
}








/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}

module.exports = app;
