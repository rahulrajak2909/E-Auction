const express = require('express');
const indexmodel = require('../models/indexmodel')
const mailApi = require('./mailApi')
const cryptoapi = require('./cryptoapi')
const cityDetails = require('indian-cities-json')
const url = require('url')

const router = express.Router();

// middle ware funcation to check user details in cokkies
var cunm = ''
var cpass = ''
router.use('/login', function (req, res, next) {
  if (req.cookies.cunm != undefined) {
    cunm = req.cookies.cunm
    cpass = req.cookies.cpass
  }
  next();
});


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/index', function (req, res, next) {
  res.render('index');
});

router.get('/about', function (req, res, next) {
  res.render('about');
});

router.get('/contact', function (req, res, next) {
  res.render('contact');
});

router.get('/register', function (req, res, next) {
  console.log('cityDetails test');
  console.log(cityDetails);

  res.render('register', { 'output': '', 'cityDetails': cityDetails.cities });
});



router.post('/register', function (req, res, next) {
  indexmodel.registerUser(req.body).then((result) => {
    mailApi(req.body.email, req.body.password)
    res.render('register', { 'output': 'register complete done', 'cityDetails': cityDetails.cities })
  }).catch((err) => {
    console.log(err)
  })

});

router.get('/verify', function (req, res, next) {
  var verifyLog = url.parse(req.url, true).query.emailid
  indexmodel.verifyUser(verifyLog).then((result) => {
    console.log('user verifide done');
    console.log(verifyLog);
    res.redirect('login')
  }).catch((err) => {
    console.log(err);
  })
});



router.get('/login', function (req, res, next) {
  req.session.destroy()
  res.render('login', { 'output': '', 'cunm': cunm, 'cpass': cpass });
});

router.post('/login', function (req, res, next) {

  indexmodel.myUser(req.body).then((result) => {
    if (result.length > 0) {
      if (req.body.chk != undefined) {
        res.cookie('cunm', result[0].email, { 'maxAge': 3600000 * 24 * 365 })
        res.cookie('cpass', result[0].password, { 'maxAge': 3600000 * 24 * 365 })
      }

      req.session.sunm = result[0].email
      req.session.srole = result[0].role

      console.log(req.session.sunm);

      if (result[0].role == "admin")
        res.redirect('/admin')
      else
        res.redirect('/users')
    }
    else
      res.render('login', {
        'output': 'Invalid user please login again or verify account', 'cunm': cunm, 'cpass': cpass
      });

  }).catch((err) => {
    console.log(err);
  })
});

router.get('/logout', function (req, res, next) {
  req.session.destroy()
  res.redirect('/login')
});


router.get('/service', function (req, res, next) {
  res.render('service');
});


module.exports = router;
