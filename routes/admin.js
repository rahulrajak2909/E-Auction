const express = require('express');
const url = require('url');
const adminmodel = require('../models/adminmodel')
const usermodel = require('../models/usermodel')
const cityDetails = require('indian-cities-json')
const path = require('path')
const router = express.Router();


// middel ware fun for unothirized use and ctm url links redirect on login
router.use(function (req, res, next) {
  if (req.session.sunm == undefined || req.session.srole != 'admin') {
    console.log('Invalid user please login first');
    req.session.destroy()
    res.redirect('/login')
  }
  next()
})

// middleware funcation for featch all categories from db and show on sub categories page
var clist
router.use('/createSubCat', function (req, res, next) {
  usermodel.fetchAll('category').then((result) => {
    clist = result;
    next();
  }).catch((err) => {
    console.log(err);

  })
})


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('adminhome', { 'sunm': req.session.sunm });
});

router.get('/manageusers', function (req, res, next) {
  adminmodel.fetchAllUsers().then((result) => {
    res.render('manageusers', { 'userDetails': result, 'sunm': req.session.sunm });
  }).catch((err) => {
    console.log(err);
  })
});


router.get('/manageUserStatus', function (req, res, next) {

  var urlObj = url.parse(req.url, true).query
  adminmodel.manageUserStatus(urlObj).then((result) => {
    res.redirect('/admin/manageusers');
  }).catch((err) => {
    console.log(err);
  })
});

router.get('/createCat', function (req, res, next) {
  res.render('createCat', { 'result': '', 'sunm': req.session.sunm });
});

router.post('/createCat', function (req, res, next) {

  categoryDetails = {}
  categoryDetails.catnm = req.body.catnm

  var catIconObj = req.files.caticon
  var catIconNM = Date.now() + "-" + catIconObj.name
  serverPath = path.join(__dirname, '../public/img/uploads/caticon', catIconNM)
  catIconObj.mv(serverPath)

  categoryDetails.catIconNM = catIconNM
  adminmodel.addCategory(categoryDetails).then((result) => {
    res.render('createCat', { 'result': 'This Category Added sucessfully .', 'sunm': req.session.sunm });
  }).catch((err) => {

  })
})

router.get('/createSubCat', function (req, res, next) {
  res.render('createSubCat', { 'clist': clist, 'result': '', 'sunm': req.session.sunm });
});


router.post('/createSubCat', function (req, res, next) {

  subCategoryDetails = {}
  subCategoryDetails.catnm = req.body.catnm
  subCategoryDetails.subcatnm = req.body.subcatnm

  var subcaticonObj = req.files.subcaticon
  var subcaticonnm = Date.now() + "-" + subcaticonObj.name
  serverPath = path.join(__dirname, '../public/img/uploads/subcaticon', subcaticonnm)
  subcaticonObj.mv(serverPath)


  subCategoryDetails.subcaticonnm = subcaticonnm
  adminmodel.addsubCategory(subCategoryDetails).then((result) => {
    res.render('createSubCat', { 'clist': clist, 'result': 'sub cat added done.', 'sunm': req.session.sunm })
  }).catch((err) => {
    console.log(err);

  })
});

router.get('/changePassword', function (req, res, next) {
  res.render('changePassword', { 'sunm': req.session.sunm, 'Pcheck': '' });
});

router.post('/changePassword', function (req, res, next) {
  var uid = req.body.uid
  var oldPassword = req.body.oldPassword
  var newPassword = req.body.newPassword
  adminmodel.CheckAdmin(uid, oldPassword).then((result) => {
    if (result.length > 0) {
      adminmodel.updateData(uid, newPassword).then((result1) => {
        res.render('changePassword', { 'sunm': req.session.sunm, 'Pcheck': 'Password update done' });
      }).catch((err) => {
        console.log(err);
      })
    }
    else {
      res.render('changePassword', { 'sunm': req.session.sunm, 'Pcheck': 'Old Password Is not match Please Check agein' });
    }
  }).catch((err) => {
    console.log(err);
  })
});

router.get('/viewProfile', function (req, res, next) {
  adminmodel.getProfile(req.session.sunm).then((result) => {
    res.render('viewProfile', { 'sunm': req.session.sunm, 'getProfile': result[0] })
  }).catch((err) => {
    console.log(err);
  })
})

router.get('/editProfile', function (req, res, next) {
  adminmodel.getProfile(req.session.sunm).then((result) => {
    res.render('editProfile', { 'sunm': req.session.sunm, 'getProfile': result[0], 'cityDetails': cityDetails.cities })
  }).catch((err) => {
    console.log(err);
  })
})

router.post('/editProfile', function (req, res, next) {
  var updateData = req.body
  var uid = req.session.sunm
  adminmodel.updateDataEP(updateData, uid).then((result) => {
    adminmodel.getProfile(uid).then((resultUpdate) => {
      res.render('editProfile', { 'sunm': req.session.sunm, 'getProfile': resultUpdate[0], 'cityDetails': cityDetails.cities })
    }).catch((err) => {
      console.log(err);
    })
  }).catch((err) => {
    console.log(err);
  })
})



module.exports = router;
