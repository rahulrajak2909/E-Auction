const db = require('./connection')

function usermodel() {
    this.fetchAll = (collection_name) => {
        return new Promise((resolve, reject) => {
            db.collection(collection_name).find().toArray((err, result) => {
                err ? reject(err) : resolve(result);
            })
        })
    }

    this.fetchSubCategory = (ctmUrl) => {
        return new Promise((resolve, reject) => {
            db.collection('subcategory').find({ 'catnm': ctmUrl }).toArray((err, result) => {
                err ? reject(err) : resolve(result)
            })
        })
    }

    this.auctionList = (subcatnm,uid) => {
        return new Promise((resolve, reject) => {
            db.collection("product").find({ "SubCategryName": subcatnm, "uid": { $ne: uid },'vstatus':1 }).toArray((err, result) => {
                err ? reject(err) : resolve(result)
            })
        })
    }

    this.addProduct = (pDetails) => {
        return new Promise((resolve, reject) => {
            var _id = 0
            db.collection("product").find().toArray((err, result) => {
                if (result.length > 0) {
                    _id = result[0]._id
                    for (let row of result) {
                        if (_id < row._id)
                            _id = row._id
                    }
                }
                pDetails._id = _id + 1
                db.collection("product").insertOne(pDetails, (err, result) => {
                    err ? reject(err) : resolve(result);
                })
            })
        })
    }

    this.bidding = (proId) => {
        return new Promise((resolve, reject) => {
            db.collection("product").find({ "_id": parseInt(proId) }).toArray((err, result) => {
                err ? reject(err) : resolve(result)
            })
        })
    }

    this.currentBidPrice = (proId) => {
        return new Promise((resolve, reject) => {
            db.collection("bidding").find({ "pid": proId }).toArray((err, result) => {
                err ? reject(err) : resolve(result)
            })
        })
    }

    this.biddingData = (bidDetails) => {
        return new Promise((resolve, reject) => {
            var _id = 0
            db.collection("bidding").find().toArray((err, result) => {
                if (result.length > 0) {
                    _id = result[0]._id
                    for (let row of result) {
                        if (_id < row._id)
                            _id = row._id
                    }
                }
                bidDetails._id = _id + 1
                db.collection("bidding").insertOne(bidDetails, (err, result) => {
                    err ? reject(err) : resolve(result);
                })
            })
        })
    }

    this.fetchProductList = (uid) => {
        return new Promise((resolve, reject) => {
            db.collection("product").find({ "uid": uid }).toArray((err, result) => {
                err ? reject(err) : resolve(result);
            })
        })
    }

    this.fetchbiddinghistory = (pid) => {
        return new Promise((resolve, reject) => {
            db.collection("bidding").find({ "pid": pid }).toArray((err, result) => {
                err ? reject(err) : resolve(result);
            })
        })
    }
   
    this.bidResult = (pid) => {
        return new Promise((resolve, reject) => {
            db.collection("bidResult").find({ "pid": pid }).toArray((err, result) => {
                err ? reject(err) : resolve(result);
            })
        })
    }

  

    this.bidResultSave=(highBit)=>{
        return new Promise((resolve,reject)=>{
			var _id=0		
			db.collection("bidResult").find().toArray((err,result)=>{
				if(result.length>0)
				{
					_id=result[0]._id
					for(let row of result)
					{
						if(_id<row._id)
							_id=row._id
					}
				}
				highBit._id=_id+1
				db.collection("bidResult").insertOne(highBit,(err,result)=>{
					err ? reject(err):resolve(result);
				})
			})
		})	
     }
    
    

    this.buyerBidMdl = (pid) => {
        return new Promise((resolve, reject) => {
            db.collection("bidding").find({'pid':pid}).toArray((err, result) => {
                console.log(result);                
                err ? reject(err) : resolve(result);
            })
        })
    }



    this.paymentdetails = (paymentinfo) => {
        return new Promise((resolve, reject) => {
            var _id = 0
            db.collection("payment").find().toArray((err, result) => {
                if (result.length > 0) {
                    _id = result[0]._id
                    for (let row of result) {
                        if (_id < row._id)
                            _id = row._id
                    }
                }
                paymentinfo._id = _id + 1
                db.collection("product").update({ '_id': parseInt(paymentinfo.auctionid) }, { $set: { 'vstatus': 1 } }, (err, result) => {
                    db.collection("payment").insertOne(paymentinfo, (err, result) => {
                        err ? reject(err) : resolve(result);
                    })
                })
            })
        })
    }


	this.CheckAdmin = (uid, oldPassword) => {
		return new Promise((resolve, reject) => {
			db.collection('register').find({ 'email': uid, 'password': oldPassword }).toArray((err, result) => {
				err ? reject(err) : resolve(result)
			})
		})
	}

	this.updateData = (uid, newPassword) => {
		return new Promise((resolve, reject) => {
			db.collection('register').updateOne({ 'email': uid }, { $set: { 'password': newPassword } }, function (err, result) {				
				err ? reject(err) : resolve(result)
			})
		});
	}


	this.getProfile = (sunm) => {
		return new Promise((resolve, reject) => {
			db.collection('register').find({ 'email': sunm }).toArray((err, result) => {
				err ? reject(err) : resolve(result)
			})
		})
	} 



	this.updateDataEP = (updateData, uid) => {
		return new Promise((resolve, reject) => {
			db.collection('register').updateOne({ 'email': uid }, { $set: { 'name': updateData.Username, 'mobile': updateData.Phone, 'city': updateData.city, 'address': updateData.address } }, (err, result) => {
				err ? reject(err) : resolve(result)
			})
		})
	}




}






module.exports = new usermodel()