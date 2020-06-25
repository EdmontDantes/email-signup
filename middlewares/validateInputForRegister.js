module.exports = {
    validateInput: (req, res, next) => {
        const { userName, name, email, password, address: { street, city, state} } = req.body
        if(!name || !email || !password || !userName || street || city || state) {
            req.flash('errors', 'All inputs Must Be Filled')
        } else {
            req.flash('success', 'You Have Successfully registered')
        }
        next();
        }
}