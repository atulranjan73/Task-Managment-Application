const express = require('express');
const router = express.Router(); // Correct syntax

const { signupValidation, loginValidation } = require('../Middleware/Authvalidation');
const { signup, login ,alluser} = require('../Controllers/Authcontroller');

router.post('/login', loginValidation , login );
router.post('/signup', signupValidation ,signup);
router.get('/Alluser', alluser);

module.exports = router; 
