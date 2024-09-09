const path = require('path');

function isAdminCheck(req, res, next) {
    if (req.session.user.isAdmin) {
        return next();
    }
    res.redirect('/login');
}

module.exports = isAdminCheck;