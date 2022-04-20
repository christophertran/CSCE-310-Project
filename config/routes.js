const { isLoggedIn, requiresLogin } = require('./middlewares/authorization');
const authors = require('../app/authors');
const books = require('../app/books');
const clubs = require('../app/clubs');
const events = require('../app/events');
const lists = require('../app/lists');
const users = require('../app/users');
const landing = require('../app/landing.js');

module.exports = (app, passport, db) => {
    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        res.locals.error = req.flash('error');
        res.locals.success = req.flash('success');
        next();
    });

    app.get('/', landing.display);

    app.get('/register', isLoggedIn, users.renderRegister);
    app.post('/register', users.register);

    app.get('/login', isLoggedIn, users.renderLogin);
    app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), users.login);

    app.get('/logout', requiresLogin, users.logout);

    // Render the page for a single author
    app.get('/author', authors.renderAuthor);

    // Render the page for a single book
    app.get('/books', books.renderBook);

    // Render the page for a single club
    app.get('/clubs', clubs.renderClub);

    // Render the page for a single event
    app.get('/events', events.renderEvent);

    // Render the page for a single list
    app.get('/lists', lists.renderList);

    // Render the page for a single user
    app.get('/users', users.renderUser);

    app.get('*', (req, res) => {
        res.sendStatus(404);
    });
};
