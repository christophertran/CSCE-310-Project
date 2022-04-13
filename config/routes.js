const { isLoggedIn, requiresLogin } = require('./middlewares/authorization');
const users = require('../app/users');
const monitoring = require('../app/monitoring');

module.exports = (app, passport, db) => {
    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        res.locals.error = req.flash('error');
        res.locals.success = req.flash('success');
        next();
    });

    app.get('/', (req, res) => {
        res.render('landing');
    });

    app.get('/register', isLoggedIn, users.renderRegister);
    app.post('/register', users.register);

    app.get('/login', isLoggedIn, users.renderLogin);
    app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), users.login);

    app.get('/logout', requiresLogin, users.logout);

    app.get('/health', monitoring.health(db));

    // Render the page for a single author
    app.get('/author', (req, res) => {
        res.render('authors/author')
    });

    // Render the page for a single book
    app.get('/books', (req, res) => {
        res.render('books/book')
    });

    // Render the page for a single club
    app.get('/clubs', (req, res) => {
        res.render('clubs/club')
    });

    // Render the page for a single event
    app.get('/events', (req, res) => {
        res.render('events/event')
    });

    // Render the page for a single list
    app.get('/lists', (req, res) => {
        res.render('lists/list')
    });

    // Render the page for a single user
    app.get('/users', (req, res) => {
        res.render('users/user')
    });

    app.get('*', (req, res) => {
        res.sendStatus(404);
    });
};
