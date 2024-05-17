const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1:27017/SMT'

mongoose.connect(url)

const db=mongoose.connection

console.log('SMT mongo db server is connected sucess')

module.exports=db