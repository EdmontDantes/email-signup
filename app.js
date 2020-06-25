const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// bringing dotenv for Mongodb_URL and others should a need will arise
require('dotenv').config();

// Custom Packages not included in expres-gen
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require('passport');



// using connect-mongo here by using let
let MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// Passport Library middleware 
require('./lib/passport');

// connect to mongodb via mongoose possibly not needed after production
// replaced by session need to bring in some 404 page generating package with not found routes later since routes that don't exist hang the app
mongoose
        .connect(process.env.MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true
        })
        .then(() => {
            console.log('Mongodb Connected')
        })
        .catch(err => console.log(`Mongo error: ${err}`));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use cookies and session to connect to MongoDB
app.use(cookieParser());
app.use(cookieParser()); // has to be first
app.use(session({ //after cookieParser
    resave: false,
    saveUninitialized: false,
    useCreateIndex: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGODB_URI,
        mongooseConnection: mongoose.connection,
        autoReconnect: true
    }),
    cookie: {
        secure: false,
        maxAge: 1000 * 60 *60 * 24
    }
}));

// using flash, passport.initialize and pass.sess
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// !!! testing purposes only REMEMBER TO REMOVE LATER
app.use((req, res, next) => {
  console.log('Session', req.session);
  console.log('User', req.user);
  next();
});

// local variables better keep them in app.js
// local Variables middleware goes here
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  res.locals.info = req.flash('info');
  next()
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
