const bcrypt = require('bcryptjs');
const db = require('../../db');

module.exports = {
    renderRegister: (req, res) => {
        res.render('register');
    },

    register: (req, res) => {
        const { username, password } = req.body;
        const user = 'user';
        const saltRounds = 10;
        const hash = bcrypt.hashSync(password, saltRounds);

        db.query('INSERT INTO users(username, password, type) VALUES ($1, $2, $3);', [username, hash, user], (err, result) => {
            if (err || result.rowCount !== 1) {
                console.error('Error inserting new user.', err);
                res.redirect('/register');
            }

            res.redirect('/login');
        });
    },

    renderLogin: (req, res) => {
        res.render('login');
    },

    login: (req, res) => {
        res.redirect('/panel');
    },

    logout: (req, res, next) => {
        req.session.destroy((err) => {
            if (err) return next(err);

            req.logout();

            return res.sendStatus(200);
        });
    },

    renderPanel: (req, res) => {
        res.render('user-panel');
    },
};
