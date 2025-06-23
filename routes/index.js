const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const Registration = mongoose.model('Registration');
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/', (req, res) => {
  //res.send('It works!');
  res.render('index', { title: 'Simple Kitchen' });
});

router.get('/register', (req, res) => {
  //res.send('It works!');
  res.render('register', { title: 'Simple Kitchen Register Form' });
});

router.get('/registrations', basic.check((req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('registrants', { title: 'Listing registrations', registrations });
    })
    .catch(() => { 
      res.send('Sorry! Something went wrong.'); 
    });
}));

router.post('/', 
    [
        check('name')
        .isLength({ min: 1 })
        .withMessage('Please enter a name'),
        check('email')
        .isLength({ min: 1 })
        .withMessage('Please enter an email'),
        check('username').isLength({ min: 1 }).withMessage('Please enter a username'), 
        check('password').isLength({ min: 1 }).withMessage('Please enter a password'),
    ],
    async(req, res) => {
        //console.log(req.body);
        const errors = validationResult(req);
        if (errors.isEmpty()) {
          const registration = new Registration(req.body);
          //generate salt to hash password
          const salt = await bcrypt.genSalt(10);
          //set user password to hashed passowrd
          registration.password = await bcrypt.hash(registration.password, salt);
          registration.save()
            .then(() => {res.redirect('/thankyou');})
            .catch((err) => {
              console.log(err);
              res.send('Sorry! Something went wrong.');
            });
          } else {
            res.render('form', { 
                title: 'Registration form',
                errors: errors.array(),
                data: req.body,
             });
          }
    });
    router.get('/thankyou', (req, res) => {
      res.render('thankyou', { title: 'Thanks' });
    });
    
module.exports = router;
