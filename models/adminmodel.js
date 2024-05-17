const db = require('./connection')


function adminmodel() {
	// get all user details from db and request comming from  admin.js routing

	this.fetchAllUsers = () => {
		return new Promise((resolve, reject) => {
			db.collection('register').find({ 'role': 'user' }).toArray((err, result) => {
				err ? reject(err) : resolve(result);
			})
		})
	}

	this.manageUserStatus = (urlObj) => {
		return new Promise((resolve, reject) => {
			if (urlObj.s == "block") {
				db.collection("register").update({ '_id': parseInt(urlObj.regid) }, { $set: { 'status': 0 } }, (err, result) => {
					err ? reject(err) : resolve(result);
				})
			}
			else if (urlObj.s == "unblock") {
				db.collection("register").update({ '_id': parseInt(urlObj.regid) }, { $set: { 'status': 1 } }, (err, result) => {
					err ? reject(err) : resolve(result);
				})
			}
			else {
				db.collection("register").remove({ '_id': parseInt(urlObj.regid) }, (err, result) => {
					err ? reject(err) : resolve(result);
				})
			}

		})
	}




	this.addCategory = (categoryDetails) => {
		return new Promise((resolve, reject) => {

			var _id = 0

			db.collection("category").find().toArray((err, result) => {
				if (result.length > 0) {
					_id = result[0]._id
					for (let row of result) {
						if (_id < row._id)
							_id = row._id
					}
				}
				categoryDetails._id = _id + 1
				db.collection("category").insertOne(categoryDetails, (err, result) => {
					err ? reject(err) : resolve(result);
				})
			})
		})
	}


	this.addsubCategory = (subcategoryDetails) => {
		return new Promise((resolve, reject) => {

			var _id = 0

			db.collection("subcategory").find().toArray((err, result) => {
				if (result.length > 0) {
					_id = result[0]._id
					for (let row of result) {
						if (_id < row._id)
							_id = row._id
					}
				}
				subcategoryDetails._id = _id + 1
				db.collection("subcategory").insertOne(subcategoryDetails, (err, result) => {
					err ? reject(err) : resolve(result);
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


module.exports = new adminmodel()