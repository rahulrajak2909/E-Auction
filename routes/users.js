const express = require('express');
const usermodel = require('../models/usermodel')
const cityDetails = require('indian-cities-json')
const url = require('url')
const path = require('path')
const router = express.Router();

// middel ware fun for unothirized use and ctm url links redirect on login
router.use(function (req, res, next) {
  if (req.session.sunm == undefined || req.session.srole != 'user') {
    console.log('Invalid user please login first');
    req.session.destroy()
    res.redirect('/login')
  }
  next()
})
// middle ware funcation for add products
var clist
router.use('/addProduct', function (req, res, next) {
  usermodel.fetchAll('category').then((result) => {
    clist = result
    next()
  }).catch((err) => {
    console.log(err);
  })
});
// middle ware funcation for getting userprofile updates with diffrent methods
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('userHome', { 'sunm': req.session.sunm });
});

router.get('/showCategory', function (req, res, next) {
  usermodel.fetchAll('category').then((result) => {
    res.render('showCategory', { 'clist': result, 'sunm': req.session.sunm });
  }).catch((err) => {
    console.log(err);

  })
});


router.get('/showSubCategory', function (req, res, next) {
  var ctmUrl = url.parse(req.url, true).query.cnm
  usermodel.fetchSubCategory(ctmUrl).then((result) => {
    res.render('showSubCategory', { 'catnm': ctmUrl, 'sclist': result, 'sunm': req.session.sunm });
  }).catch((err) => {
    console.log(err);

  })
});

router.get('/auctionList', function (req, res, next) {
  var urlobj = url.parse(req.url,true).query
  var catnm = urlobj.catnm
  var subcatnm = urlobj.subcatnm
  usermodel.auctionList(subcatnm,req.session.sunm).then((result) => {
    res.render('auctionList', { 'sunm': req.session.sunm, 'iteamList': result });

  }).catch((err) => {
    console.log(err);
  })
});

router.get('/bidding', function (req, res, next) {
  var proId = url.parse(req.url, true).query.pid
  var currentPrice
  usermodel.bidding(proId).then((result) => {
    usermodel.currentBidPrice(proId).then((bidresult) => {
      if (bidresult.length > 0) {
        var cprice = parseInt(bidresult[0].biddingprice)
        for (let row of bidresult) {
          if (cprice < parseInt(row.biddingprice))
            cprice = parseInt(row.biddingprice)
        }
        currentPrice = cprice
      }
      else
        currentPrice = result[0].AuctionBasePrise
      res.render('bidding', { 'sunm': req.session.sunm, 'plist': result[0], 'currentPrice': currentPrice })
    }).catch((err) => {
      console.log(err);
    })
  }).catch((err) => {
    console.log(err);
  })
});

router.post('/bidding', function (req, res, next) {
  bidDetails = req.body
  bidDetails.uid = req.session.sunm
  bidDetails.info = Date()
  usermodel.biddingData(bidDetails).then((result) => {
    res.redirect('/users/bidding?pid=' + req.body.pid)
  }).catch((err) => {
    console.log(err);

  })
});

// router.get('/biddinghistory', function (req, res, next) {
//   var pid = url.parse(req.url, true).query.pid
//   var tempCprice
//   usermodel.fetchbiddinghistory(pid).then((result) => {
//     if (result.length > 0) {
//       var Cprice = parseInt(result[0].biddingprice)
//       for (let row of result) {
//         if (Cprice < parseInt(row.biddingprice)) {
//           Cprice = parseInt(row.biddingprice)
//         }
//         tempCprice = Cprice
//         tempCpriceobj = row
//       }
//     }
//     else
//       tempCprice = result[0].AuctionBasePrise


//     res.render('biddinghistory', { 'sunm': req.session.sunm, 'bidhistory': result, 'tempCprice': tempCprice, 'tempCpriceobj': tempCpriceobj });
//   }).catch((err) => {
//     console.log(err);
//   })
// });

router.get('/biddinghistory', function (req, res, next) {
  var pid = url.parse(req.url, true).query.pid
  usermodel.fetchbiddinghistory(pid).then((result) => {
      res.render('biddinghistory', { 'sunm': req.session.sunm, 'bidHistry': result})  
    }).catch((err) => {
      console.log(err);
    })
})

router.get('/biddinghistoryuser', function (req, res, next) {
  var pid = url.parse(req.url, true).query.pid
  usermodel.fetchbiddinghistory(pid).then((result) => {
      res.render('biddinghistoryuser', { 'sunm': req.session.sunm, 'bidHistry': result})  
    }).catch((err) => {
      console.log(err);
    })
})

router.get('/buyerList', function (req, res, next) {
  usermodel.fetchProductList(req.session.sunm).then((result) => {
    console.log(result);
    for (let row of result) {
      if ((Date.now() - row.timeinfo) > 172800000) {
        console.log('myUser stam details');
        console.log(row._id);
      }
    }
    res.render('buyerList', { 'sunm': req.session.sunm, 'plist': result });
  }).catch((err) => {
    console.log(err);
  })
});

router.get('/addProduct', function (req, res, next) {
  res.render('addProduct', { 'clist': clist, 'output': '', 'sunm': req.session.sunm });
});

router.post('/addProduct', function (req, res, next) {
  pDetails = {}
  fileObj1 = req.files.iconFile1
  filenm1 = Date.now() + "-" + fileObj1.name
  serverPath = path.join(__dirname, '../public/img/uploads/picon', filenm1)
  fileObj1.mv(serverPath)

  if (req.files.iconFile2 != undefined) {
    fileObj2 = req.files.iconFile2
    filenm2 = Date.now() + "-" + fileObj2.name
    serverPath = path.join(__dirname, '../public/img/uploads/picon', filenm2)
    fileObj2.mv(serverPath)
  }
  else {
    filenm2 = "logo.png"
  }

  if (req.files.iconFile3 != undefined) {
    fileObj3 = req.files.iconFile3
    filenm3 = Date.now() + "-" + fileObj3.name
    serverPath = path.join(__dirname, '../public/img/uploads/picon', filenm3)
    fileObj3.mv(serverPath)
  }
  else {
    filenm3 = "logo.png"
  }

  if (req.files.iconFile4 != undefined) {
    fileObj4 = req.files.iconFile4
    filenm4 = Date.now() + "-" + fileObj4.name
    serverPath = path.join(__dirname, '../public/img/uploads/picon', filenm4)
    fileObj4.mv(serverPath)
  }
  else {
    filenm4 = "logo.png"
  }

  pDetails = req.body
  pDetails.iconFile1 = filenm1
  pDetails.iconFile2 = filenm2
  pDetails.iconFile3 = filenm3
  pDetails.iconFile4 = filenm4
  pDetails.timeinfo = Date.now()
  pDetails.auctionstarttime = 0
  pDetails.vstatus = 0
  pDetails.status = 1

  usermodel.addProduct(pDetails).then((result) => {
    res.render('addProduct', { 'sunm': req.session.sunm, 'clist': clist, 'output': 'Product Added Successfully...' });
  }).catch((err) => {
    console.log(err)
  })

});

router.get('/fetchsubcatajax', function (req, res, next) {
  var cnm = url.parse(req.url, true).query.cnm
  usermodel.fetchSubCategory(cnm).then((result) => {
    res.send(result)
  }).catch((err) => {
    console.log(err);

  })
});

router.get('/showAllProduct', function (req, res, next) {
  var PAYPAL_URL = "https://www.sandbox.paypal.com/cgi-bin/webscr"
  var PAYPAL_ID = "sb-m43j81317944@business.example.com"
  usermodel.fetchProductList(req.session.sunm).then((result) => {
    res.render('showAllProduct', { 'PAYPAL_URL': PAYPAL_URL, 'PAYPAL_ID': PAYPAL_ID, 'sunm': req.session.sunm, 'prolist': result });
  }).catch((err) => {
    console.log(err)
  })
});

router.get('/paymentdetails', function (req, res, next) {
  var paymentinfo = url.parse(req.url, true).query
  paymentinfo.amount = 250
  paymentinfo.info = Date.now()
  usermodel.paymentdetails(paymentinfo).then((result) => {
    res.redirect('/users/showAllProduct')
  }).catch((err) => {
    console.log(err);

  })
});


router.get('/changePasswordUser', function (req, res, next) {
  res.render('changePasswordUser', { 'sunm': req.session.sunm, 'Pcheck': '' });
});

router.post('/changePasswordUser', function (req, res, next) {
  var uid = req.body.uid
  var oldPassword = req.body.oldPassword
  var newPassword = req.body.newPassword
  usermodel.CheckAdmin(uid, oldPassword).then((result) => {
    if (result.length > 0) {
      usermodel.updateData(uid, newPassword).then((result1) => {
        res.render('changePasswordUser', { 'sunm': req.session.sunm, 'Pcheck': 'Password update done' });
      }).catch((err) => {
        console.log(err);
      })
    }
    else {
      res.render('changePasswordUser', { 'sunm': req.session.sunm, 'Pcheck': 'Old Password Is not match Please Check agein' });
    }
  }).catch((err) => {
    console.log(err);
  })
});

router.get('/uViewProfile', function (req, res, next) {
  usermodel.getProfile(req.session.sunm).then((result) => {
    res.render('uViewProfile', { 'sunm': req.session.sunm, 'getProfile': result[0] })
  }).catch((err) => {
    console.log(err);
  })
})


router.get('/uEditProfile', function (req, res, next) {
  usermodel.getProfile(req.session.sunm).then((result) => {
    res.render('uEditProfile', { 'sunm': req.session.sunm, 'getProfile': result[0], 'cityDetails': cityDetails.cities })
  }).catch((err) => {
    console.log(err);
  })
})

router.post('/uEditProfile', function (req, res, next) {
  var updateData = req.body
  var uid = req.session.sunm
  usermodel.updateDataEP(updateData, uid).then((result) => {
    usermodel.getProfile(uid).then((resultUpdate) => {
      res.render('uEditProfile', { 'sunm': req.session.sunm, 'getProfile': resultUpdate[0], 'cityDetails': cityDetails.cities })
    }).catch((err) => {
      console.log(err);
    })
  }).catch((err) => {
    console.log(err);
  })
})









module.exports = router;
