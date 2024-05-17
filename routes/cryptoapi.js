const crypto = require('crypto')

function myencrypt(data) {
    var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
    var mystr = mykey.update(data, 'utf8', 'hex')
    mystr += mykey.final('hex');
    return mystr
}

function mydcrypt(edata) {
    var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
    var mystr = mykey.update(edata, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return mystr
}

module.exports = { 'myencrypt': myencrypt, 'mydcrypt':mydcrypt }