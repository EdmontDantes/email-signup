
const User = require('../models/User');


module.exports = {
    index: (req, res) => {
        res.render('./main/index');
    },
    logged: (req, res) => {
        if(req.isAuthenticated()) {
        
            res.render('./main/logged');
        
        } else {
                return res.send('You are not authorized to view this page');
            }
        },

}