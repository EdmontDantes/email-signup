const { check, validationResult } = require('express-validator');
module.exports = {
    loginCheck: [
    check('email').isEmail(),
    check('password').isLength({ min: 3})
    ],

    loginValidate: (req, res, next) => {
    const info = validationResult(req);
    if(!info.isEmpty()) {
        req.flash('errors', 'Invalid Email or Password');
        return res.redirect('/');
    }
    next();
    }
}

// module.exports = loginCheck, loginValidate;