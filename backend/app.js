var MongoClient = require('mongodb').MongoClient;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//測試透過 Express 操作 Local 資料庫
const name = 'Jason';
const gender = 'Male';
MongoClient.connect('mongodb://localhost:27017/', function(err, db) {
    var dbo = db.db('try');
    if (!err) {
        console.log('Connect!');
        dbo.collection('tryList').insertOne({ name: name, gender: gender }, (err, result) => {
            if (!err) {
                console.log('Insert!');
            } else {
                console.log('Not work!');
            }
        });
    } else {
        console.log(err);
    }
});
//從表單拿資料
app.get('/senddata', function(req, res) {});

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

// Test Server Running
app.listen(5000, () => {
    console.log('Server Running!')
})

module.exports = app;