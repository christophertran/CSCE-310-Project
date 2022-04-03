const { requiresLogin, requiresAdmin } = require('./middlewares/authorization');
const admin = require('../app/admin');
const users = require('../app/users');
const monitoring = require('../app/monitoring');

module.exports = (app, passport, db) => {
    app.get('/', (req, res) => {
        res.json('Hello World');
    });

    app.post('/api/login', passport.authenticate('local'), users.login);
    app.get('/api/logout', users.logout);
    app.get('/api/ping', requiresLogin, users.ping);

    app.get('/admin/login', admin.renderLogin);
    app.post('/admin/login', passport.authenticate('local', { failureRedirect: '/admin/login' }), admin.login);
    app.get('/admin/panel', requiresAdmin, admin.renderPanel);

    app.get('/health', monitoring.health(db));
};
