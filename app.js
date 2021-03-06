var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var url = require('url');

mongoose.connect('mongodb://heroku_app33151901:808rh44glmtm6tai561haltb61@ds031701.mongolab.com:31701/heroku_app33151901');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(callback){
    console.log("Connected to database!");
});
var models = require('./models/profile_models.js');
var profileModel = models.profileModel;

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var FACEBOOK_APP_ID = "313293458870038";
var FACEBOOK_APP_SECRET = "0510036871cf28eb369bc28adc2598b2";


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

 

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID, 
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
  },
  function(accessToken, refreshToken, profile, done) {
    // profileModel.findOne({identifier:profile.id},function(error,users){
    //     if (users===null){
    //         console.log("hihi")
    //         var newProfile = new profileModel({
    //             identifier:profile.id,
    //             username:profile.displayName,
    //             languages:{}
    //         });

    //         newProfile.save(function(error){
    //             return done(error,users);
    //         });
    //     }
    //     else {
    //         return done(error,users);
    //     }
            
    // });
    return done(null,profile);
  }
));

// var passport = require('passport');
// var GoogleStrategy = require('passport-google').Strategy;
// passport.serializeUser(function(user,done){
//     done(null,user);
// })
// passport.deserializeUser(function(obj,done){
//     done(null,obj);
// })
// passport.use(new GoogleStrategy({
//     returnURL: 'http://localhost:3000/auth/google/return',
//     realm: 'http://localhost:3000'
// },
// function(identifier,profile,done){
//     process.nextTick(function(){
//         profile.identifier = identifier;
//         return done(null,profile);
//     });
// }
// ));

var routes = require('./routes/index');
var game = require("./routes/game");
var language = require("./routes/language");
var profile = require("./routes/profile");
var users = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'blahblah',
                 saveUninitialized: true,
                 resave: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/game',game);
app.use('/language',language);
app.use('/profile',profile);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
