var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// フロントからAPIをキックする際のエラー対応で追加
var cors = require('cors');

require('dotenv').config();

// 1.APIを定義したファイルのパスを追加(.jsは不要)
var usersRouter = require('./routes/users');
var messagesRouter = require('./routes/messages');
var roomsRouter = require('./routes/rooms');
var mentionRouter = require('./routes/mentions');
var threadRouter = require('./routes/threads');
var unrepliedRouter = require('./routes/unreplied');
var waiting_responseRouter = require('./routes/waiting_response');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// 2.ルーティングを追加(1.APIを定義した～で追加したファイルのAPIが呼び出せるように同様に追加)
app.use('/', usersRouter);
app.use('/', messagesRouter);
app.use('/', roomsRouter);
app.use('/', mentionRouter);
app.use('/', threadRouter);
app.use('/', unrepliedRouter);
app.use('/', waiting_responseRouter);

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
  res.render('error');
});

module.exports = app;
