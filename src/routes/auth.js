const express = require("express");
const router = express.Router();
const Empleado = require("../models/Empleado-local");
const passport = require("passport");

router.get("/auth/facebook", passport.authenticate("facebook"));
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/",
    failureFlash: true,
  })
);

router.get("/auth/google", passport.authenticate("google", {scope: ['profile']}));
router.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/",
    failureFlash: true,
  })
);

router.get('/add-user',(req, res)=>{
  res.render('add-user');
});

errors = []

router.post('/add-user', async (req, res)=>{
  const {name, email, password, confirme_password} = req.body;
  if(name.length < 5){
    errors.push({text: 'ERROR: el nombre debe ser minimo de 5 caracteres'})
  }
  if(password.length < 5){
    errors.push({text: 'ERROR: la contraseña debe ser minimo de 5 caracteres'}) 
  }
  if(password != confirme_password){
    errors.push({text: 'ERROR: las contraseñas no coinciden'})
  }
  
  if(errors.length > 0){
    req.flash('failure', 'ERROR: hubo un error, comprueba que tu nombre y constraseña sean de más de 5 caracteres y que tus contraseñas sea iguales')
    res.redirect('/add-user')
  }else{
    const user = await Empleado.findOne({email: email});
    if (user) {
        req.flash('failure', 'Éste nombre de usuario ya está en uso');
        res.redirect('/add-user');
    }else{
        const newUser = new Empleado({ name, email, password});
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save();
        req.flash('success', 'Usuario creado satisfactoriamente');
        res.redirect('/');
    }
  }
});


router.post("/login",(req, res, next) => {
  passport.authenticate("local.login", {
    successRedirect: "/profile",
    failureRedirect: "/",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
