# CSCE-310-Project

Original skeleton code from [here](https://github.com/DayOnePl/dos-server) and modified to work with Node v16.

##

## How to get setup
1. Ensure you have node v16 installed. Instructions can be found [here](https://nodejs.org/en/download/).
1. Clone the repo from [here](https://github.com/christophertran/CSCE-310-Project.git).
1. Go into the repo, once in the repo, run `npm i` to install all the `package.json` dependencies.
1. After installing, a `node_modules` folder should appear.
1. To run the node server, run `npm start`.

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