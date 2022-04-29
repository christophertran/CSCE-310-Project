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

    // Users routes
    app.get('/users/:id', catchAsync(users.showUser));
    app.put('/users/:id', requiresLogin, catchAsync(users.updateUser));
    app.delete('/users/:id', requiresLogin, users.deleteUser);
    app.get('/users/:id/edit', requiresLogin, catchAsync(users.renderEditForm));

    // Authors routes
    app.get('/authors', catchAsync(authors.index));
    app.post('/authors', requiresLogin, catchAsync(authors.createAuthor));
    app.get('/authors/new', requiresLogin, authors.renderNewForm);
    app.get('/authors/:id', catchAsync(authors.showAuthor));
    app.put('/authors/:id', requiresLogin, catchAsync(authors.updateAuthor));
    app.delete('/authors/:id', requiresLogin, catchAsync(authors.deleteAuthor));
    app.get('/authors/:id/edit', requiresLogin, catchAsync(authors.renderEditForm));

    // Books routes
    app.get('/books', catchAsync(books.index));
    app.post('/books', requiresLogin, catchAsync(books.createBook));
    app.get('/books/new', requiresLogin, books.renderNewForm);
    app.get('/books/search', books.renderSearchForm);
    app.get('/books/sresults', catchAsync(books.search));
    app.get('/books/:id', catchAsync(books.showBook));
    app.put('/books/:id', requiresLogin, catchAsync(books.updateBook));
    app.delete('/books/:id', requiresLogin, catchAsync(books.deleteBook));
    app.get('/books/:id/edit', requiresLogin, catchAsync(books.renderEditForm));
    app.post('/books/:id/reviews', requiresLogin, catchAsync(books.createReview));
    app.delete('/books/:id/reviews/:reviewid', requiresLogin, catchAsync(books.deleteReview));


    // Clubs routes
    app.get('/clubs', catchAsync(clubs.index));
    app.post('/clubs', requiresLogin, catchAsync(clubs.createClub));
    app.get('/clubs/new', requiresLogin, clubs.renderNewForm);
    app.get('/clubs/:id', catchAsync(clubs.showClub));
    app.put('/clubs/:id', requiresLogin, catchAsync(clubs.updateClub));
    app.delete('/clubs/:id', requiresLogin, catchAsync(clubs.deleteClub));
    app.get('/clubs/:id/edit', requiresLogin, catchAsync(clubs.renderEditForm));
    app.get('/clubs/:id/members', catchAsync(clubs.getMembers));
    app.post('/clubs/:id/members', requiresLogin, catchAsync(clubs.addMember));
    app.delete('/clubs/:id/members', requiresLogin, catchAsync(clubs.deleteMember));

    // events routes
    app.get('/events', catchAsync(events.index));
    app.post('/events', requiresLogin, catchAsync(events.createEvent));
    app.get('/events/new', requiresLogin, events.renderNewForm);
    app.get('/events/:id', catchAsync(events.showEvent));
    app.put('/events/:id', requiresLogin, catchAsync(events.updateEvent));
    app.delete('/events/:id', requiresLogin, catchAsync(events.deleteEvent));
    app.get('/events/:id/edit', requiresLogin, catchAsync(events.renderEditForm));

    // List routes
    app.get('/lists', requiresLogin, catchAsync(lists.showList));
    app.get('/lists/addRead', requiresLogin, catchAsync(lists.showList));

    app.get('*', (req, res) => {
        res.sendStatus(404);
    });
};
