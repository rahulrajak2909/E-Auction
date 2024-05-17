function mailApi(email, password) {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rahulrajak2909@gmail.com',
      pass: 'cqwjxhdhxyjxmxuk'
    }
  });

  const mailOptions = {
    from: 'rahulrajak2909@gmail.com',
    to: email,
    subject: 'eAuction verification mail',
    html: "<h1>Welcome to eAuction</h1><p>You have successfully register on our application, your credentials are attached below</p><h2>Username : " + email + "</h2><h2>Password : " + password + "</h2><p>Click on the link below to verify your account</p>http://localhost:3001/verify?emailid=" + email
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = mailApi