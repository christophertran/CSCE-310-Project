module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect(req.originalUrl);
        }

        return next();
    },

    requiresLogin: (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.session.returnTo = req.originalUrl;
            return res.redirect('/login');
        }

        return next();
    },

    requiresAdmin: (req, res, next) => {
        if (!req.user && !req.user.type === 'admin') {
            return res.sendStatus(401);
        }

        return next();
    },
};
