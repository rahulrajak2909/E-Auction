const db = require('./connection')

function indexmodel(){

    // registration code start comming from routes>index.js file 
    this.registerUser=(userDetails)=>{
        return new Promise((resolve,reject)=>{
            userDetails.role='user'
        userDetails.status=0
        userDetails.info=Date()

        // console.log(userDetails)
        var _id=0
        db.collection('register').find().toArray((err,result)=>{
            if(result.length>0){
                _id=result[0]._id
                for(let row of result){
                    if(_id<row._id)
                        _id=row._id
                }
            }
            userDetails._id=_id+1
            db.collection('register').insertOne(userDetails,(err,result)=>{
                err ? reject(err) : resolve(result)
            })
            console.log(userDetails)
        })
        })        
    }

    // login code start comming from routes>index.js file 
    this.myUser=(userLoginDetails)=>{
        return new Promise((resolve,reject)=>{
            db.collection("register").find({'email':userLoginDetails.email,'password':userLoginDetails.password,'status':1}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
        })    
    }
    
    this.verifyUser=(verifyLog)=>{
        return new Promise((resolve,reject)=>{
            db.collection("register").updateOne({'email':verifyLog},{$set:{'status':1}},(err,result)=>{
                err ? reject(err) : resolve(result);
            })
        }) 
    }
    
}
module.exports=new indexmodel()