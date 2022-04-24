# CSCE-310-Project

Original skeleton code from [here](https://github.com/DayOnePl/dos-server) and modified to work with Node v16. The original article with additional explanation can be found [here](https://reallifeprogramming.com/node-authentication-with-passport-postgres-ef93e2d520e7).

## Getting started
1. Ensure you have node v16 installed. Instructions can be found [here](https://nodejs.org/en/download/).
1. Clone the repo from [here](https://github.com/christophertran/CSCE-310-Project.git).
1. Go into the repo, once in the repo, run `npm i` to install all the `package.json` dependencies.
1. After installing, a `node_modules` folder should appear.
1. To run the node server, run `npm startDev`.

## Before submitting a commit
1. Ensure that you lint the files so that we keep some form of formatting consistency.
1. Do this by running `npx eslint --fix .` before every commit. This will fix any small formatting errors, but also let you know if you have any other egregious errors. Some errors can be ignored on a case by case basis.

## File structure
### `app/`
- `author/`
    - `index.js`
- `books/`
    - `index.js`
- `clubs/`
    - `index.js`
- `events/`
    - `index.js`
- `lists/`
    - `index.js`
- `users/`
    - `index.js`

### `config/`
- `env/`
    - `development.js`
    - `production.js`
    - `test.js`
- `middleware/`
    - `authorization.js`
- `express.ejs`
- `index.ejs`
- `passport.ejs`
- `routes.ejs`

### `db/`
- `index.js`

### `public/`
- `images/`
    - `logo.png`
- `stylesheets/`
    - `main.css`

### `views/`
- `partials/`
    - `flash.ejs`
    - `footer.ejs`
    - `header.ejs`
- `home.ejs`
- `landing.ejs`
- `login.ejs`
- `register.ejs`


## package.json packages
- bcryptjs -> https://github.com/dcodeIO/bcrypt.js - One of the most fundamental security concern is storing passwords in application. In DOS we're using bcypt to generate salt and hash passwords. bcrypt is a password hashing function. bcrypt uses salt to protect against rainbow table attacks. What is crucial, bcrypt is adaptive function -> over time the iteration time can be increased in order to make it slower to remain resistant to increasing computation power. NPM package is using native implementation of bcrypt. 

- connect-flash -> https://github.com/jaredhanson/connect-flash - The flash is a special area of the session used for storing messages. Messages are written to the flash and cleared after being displayed to the user. The flash is typically used in combination with redirects, ensuring that the message is available to the next page that is to be rendered.

- connect-pg-simple -> https://github.com/voxpelli/node-connect-pg-simple - express-session comes in bundled with in-memory session. However, in-memory session is not suitable for production apps. One of the most popular session storage is Redis.  We're using PostgreSQL in DOS and we're going to store session data inside our Postgres db. We're using connection pool (pg.Pool) for the underlying db module.

- cookie-parser -> https://github.com/expressjs/cookie-parser - Exposes cookies under `req.cookie` property

- ejs -> https://github.com/mde/ejs - Embedded JavaScript templates

- express -> https://github.com/expressjs/express - DOS choice for Node.js minimalistic web framework

- express-session -> https://github.com/expressjs/session - Session middleware for Express with build-in in-memory session storage. In DOS we're using connect-pg-simple to store session data in Postgres 

- method-override -> https://github.com/expressjs/method-override - Middleware for Express enabling HTTP verbs like PUT or DELETE in case where client doesn't support it. 

- passport -> https://github.com/jaredhanson/passport - Authentication middleware for Express. The main idea of Passport is extensible set of plugins known as strategies. There are variety of different strategies, which could authenticate users by username & password, OAuth like Facebook, Twitter or Google and many others. Passport maintains persistent login session, which requires both serialization and deserialization of `authenticated user`.

- passport-local -> https://github.com/jaredhanson/passport-local - Authentication strategy for Passport using username & password. In DOS, we're combining local strategy with Postgres to authenticate users with username and hashed password stored in db

- pg -> https://github.com/brianc/node-postgres - Non-blocking PostgreSQL client for Node.js