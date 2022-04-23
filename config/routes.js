const { isLoggedIn, requiresLogin } = require('./middlewares/authorization');
const catchAsync = require('./utils/catchAsync');
const authors = require('../app/authors');
const books = require('../app/books');
const clubs = require('../app/clubs');
const events = require('../app/events');
const lists = require('../app/lists');
const users = require('../app/users');
const landing = require('../app/landing');

module.exports = (app, passport) => {
    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        res.locals.error = req.flash('error');
        res.locals.success = req.flash('success');
        next();
    });

    app.get('/', catchAsync(landing.renderLanding));

    app.get('/register', isLoggedIn, users.renderRegister);
    app.post('/register', users.register);

    app.get('/login', isLoggedIn, users.renderLogin);
    app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), users.login);

    app.get('/logout', requiresLogin, users.logout);

    app.get('/author', authors.renderAuthor);

    // Books routes
    app.get('/books', catchAsync(books.index));
    app.post('/books', catchAsync(books.createBook));
    app.get('/books/new', books.renderNewForm);
    app.get('/books/:id', catchAsync(books.showBook));
    app.put('/books/:id', catchAsync(books.updateBook));
    app.delete('/books/:id', catchAsync(books.deleteBook));
    app.get('/books/:id/edit', catchAsync(books.renderEditForm));

    app.get('/clubs', clubs.renderClub);

    app.get('/events', events.renderEvent);

    app.get('/lists', lists.renderList);

    app.get('/users', users.renderUser);

    app.get('*', (req, res) => {
        res.sendStatus(404);
    });
};
