const express = require("express")
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const app = express()
require("./database")
require("./config/passport")


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'sessionSecret',
    resave: false,
    saveUnitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use((req, res, next) =>{
    app.locals.success = req.flash('success');
    app.locals.failure = req.flash('failure');
    app.locals.error = req.flash('error');
    next();
});

app.use(require('./routes/empleado'));
app.use(require('./routes/auth'));

app.use(express.static(path.join(__dirname, 'public')));


app.listen(app.get('port'), ()=>{
    console.log('Server on port', app.get('port'));
});

