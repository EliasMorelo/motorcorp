const mongoose = require("mongoose");
const passport = require("passport");
const facebookStrategy = require("passport-facebook").Strategy;
const googleStrategy = require("passport-google-oauth20").Strategy;
const localStrategy = require("passport-local").Strategy;
const Users = require("../models/Empleado");
const UsersLocal = require("../models/Empleado-local");

const usersConfig = require("../../config");

passport.use(
    new facebookStrategy(
        {
            clientID: usersConfig.facebook.id,
            clientSecret: usersConfig.facebook.key,
            callbackURL: "/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos', 'email']
        },
        function (accesToken, refresToken, profile, done) {
            Users.findOne({ provider_id: profile.id }, function (error, user) {
                if (error) {
                    throw error;

                } else {
                    if (!error && user != null && user != '') {
                        return done(null, user)
                    }
                    else {
                        const usuario = new Users({
                            provider_id: profile.id,
                            provider: profile.provider,
                            name: profile.displayName,
                            photos: profile.photos[0].value,
                            email: profile.email,
                        });

                        usuario.save(function (err) {
                            if (err) throw err;
                            done(null, user);
                        });
                    }

                }
            });
        }
    )
);

passport.use(
    new googleStrategy(
        {
             clientID: usersConfig.google.id,
             clientSecret: usersConfig.google.key,
             callbackURL: "/auth/google/redirect",
            profileFields: ["id", "displayName", "provider", "photos"]
        },
       function (accesToken, refresToken, profile, done) {
          Users.findOne({ provider_id: profile.id}, function (error, user) {
                if (error) {
                    throw error
                } else {
                    if (!error && user != null && user != '') { return done(null, user) } else {
                        const usuario = new Users({
                            provider_id: profile.id,
                            provider: profile.provider,
                            name: profile.displayName,
                            photos: profile.photos[0].value,
                        });

                        usuario.save(function (err) {
                            if (err) throw err;
                            done(null, user);
                        });
                    }
                }
            });
        }
    )
);

passport.use('local.login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
}, async (req, email, password, done)=> {
   const user = await UsersLocal.findOne({email: email});
   if(!user){
      return done(null, false, {message: 'Usuario no encontrado'});
   }else{
     const resultado = await user.decryptPassword(password);
     if (resultado) {
         return done(null, user);
     }else{
         return done(null, false, {message: 'Contraseña incorrecta'});
     }
   }
}));

passport.serializeUser(function(user, done) {
    done(null, user)
});

passport.deserializeUser(function(obj, done) {
    done(null, obj)
});