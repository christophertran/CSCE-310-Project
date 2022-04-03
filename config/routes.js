const { isLoggedIn, requiresLogin } = require('./middlewares/authorization');
const ExpressError = require('../utils/ExpressError');
const users = require('../app/users');
const monitoring = require('../app/monitoring');

module.exports = (app, passport, db) => {
    app.use((req, res, next) => {
        res.locals.error = req.flash('error');
        res.locals.success = req.flash('success');
        next();
    });

    app.get('/', (req, res) => {
        res.json('Hello World');
    });

    app.get('/register', isLoggedIn, users.renderRegister);
    app.post('/register', users.register);

    app.get('/login', isLoggedIn, users.renderLogin);
    app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), users.login);

    app.get('/logout', users.logout);

    app.get('/panel', requiresLogin, users.renderPanel);

    app.get('/health', monitoring.health(db));

    app.get('*', (req, res, next) => {
        next(new ExpressError('Page Not Found', 404));
    });
};
