var ejs = require('ejs');
var fs = require('fs');

var nodemailer = require("nodemailer");

var FROM_ADDRESS = 'foo@bar.com';
var TO_ADDRESS = 'test@test.com';

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'arun.reddy143@gmail.com',
        pass: 'arun1234'
    }
});

var sendMail = function (toAddress, subject, content, next) {

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"arun.reddy143@gmail.com', // sender address
        to: 'arun.reddy143@gmail.com,shashikanth.reddy.nalabolu@one.verizon.com ', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ?', // plain text body
        html: content
    };

    smtpTransport.sendMail(mailOptions, next);
};
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Express' });

    // specify jade template to load
    var template = process.cwd() + '/views/emails/test.ejs';

    // get template from file system
    fs.readFile(template, 'utf8', function (err, file) {
        if (err) {
            //handle errors
            console.log('ERROR!');
            return res.send('ERROR!');
        }
        else {
            //compile jade template into function
            var compiledTmpl = ejs.compile(file, { filename: template });
            // set context to be used in template
            var context = { title: 'Express' };
            // get html back as a string with the context applied;
            var html = compiledTmpl(context);

            sendMail(TO_ADDRESS, 'test', html, function (err, response) {
                if (err) {
                    console.log('ERROR!');
                    return res.send('ERROR');
                }
                res.send("Email sent!");
            });
        }
    });
});

module.exports = router;
