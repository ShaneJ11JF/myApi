var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var debug = require('debug')('myapi:server');

try {
  mongoose.connect(config.database);

}

catch(e) {
  console.log(e.message);
}

var api = require('./routes/api');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Acess-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();

});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use(passport.initialize());

app.get('/', function(req, res){
  res.send('Page under construction');
});

app.use('/api', api);

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
