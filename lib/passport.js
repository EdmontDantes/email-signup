const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');


passport.serializeUser((user, done) =>{
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});



passport.use('local-login',
    new LocalStrategy({
        usernameField: 'userName',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, userName, password, done) => {
        User.findOne({userName}, (err, user) => {
            if(err) {
                return done(err, null);
            }
            if(!user) {
                return done(null, false, req.flash('errors', 'User Not Found'));
            }

            bcrypt.compare(password, user.password).then((result) => {
                if(!result) {
                    return done(null, false, req.flash('errors', 'Check userName and password'));
                } else {
                    return done(null, user);
                }
            }).catch((error) => {
                return done(error, null);
            })
        })
    }

    )

);