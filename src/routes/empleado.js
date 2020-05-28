const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const Visita = require('../models/Visita');
router.get('/',(req, res) => {
    res.render("login")
});

router.get('/profile',(req, res) => {
    res.render('profile', { user: req.user })
});


router.get('/add-customer',(req, res) => {
    res.render('add-customer')
});

router.post('/add-customer',async (req, res) => {
    const { name, plate, make, model, vin } = req.body;
    const cliente = await Cliente.findOne({ name: name });
    if (cliente!= null) {
        req.flash('failure', 'This vehicle is already added');
        res.redirect('/add-customer');
    } else {
        const newClient = new Cliente({ name, plate, make, model, vin });
        await newClient.save();
        req.flash('success', 'Customer add successfully');
        res.redirect('/profile');
    }
});

router.get('/add-visit',(req, res) => {
    res.render('add-visit');
});

router.post('/add-visit',async (req, res) => {
    const { plate, date, visit, description } = req.body;
    const newVisit = new Visita({ plate, visit, description,date });
    await newVisit.save();
    req.flash('success', 'Visit add successfully');
    res.redirect('/profile');
});


router.get('/search-customer',(req, res) => {
    res.render('search-customer', { user: req.user })
});


router.post('/search-customer',async (req, res) => {
    const { by, query } = req.body;
    if (by === "Name") {
        const customers = await Cliente.find({ name: { $regex: query, $options: "$i" } });
        if (customers) {
            res.render('view-customers', {customers, by, query, user: req.user});
        } else {
            req.flash('failure', 'ERROR: This Customer no exits')
            res.redirect('/search-customer', {user: req.user})
        }
    } else {
        if (by==="License Plate") {
            const customers = await Cliente.find({ plate: { $regex: query, $options: "$i" } });
            if (customers) {
                res.render('view-customers', {customers, by, query, user: req.user });
            } else {
                req.flash('failure', 'ERROR: This Customer no exits')
                res.redirect('/search-customer', {user: req.user})
            }
        } else {
            const customers = await Cliente.find({ vin: { $regex: query, $options: "$i" } });
            if (customers) {
                res.render('view-customers', {customers, by, query, user: req.user});
            } else {
                req.flash('failure', 'ERROR: This Customer no exits')
                res.redirect('/search-customer', {user: req.user})
            }
        }
    }

});

router.get('/view-customer',(req, res) => {
    res.render('search-customer')
});

router.post('/view-customer', async (req, res) => {
    const {plate} = req.body;
    const c =  await Cliente.find({ plate: { $regex: plate, $options: "$i" } })
    const visits = await Visita.find({plate: {$regex:plate, $options: "$i"}})
    const costumer = c[0]
    if(visits.length > 0){
      res.render('view-customer', {costumer, visits})
    }else{
      res.render('view-customerNull', {costumer, value: "There have been no visits for this vehicle"})
    }

});
module.exports = router;