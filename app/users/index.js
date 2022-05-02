const bcrypt = require('bcryptjs');
const db = require('../../db');

module.exports = {
    renderRegister: (req, res) => res.render('register'),

    register: (req, res) => {
        const { username, password } = req.body;
        const user = 'user';
        const saltRounds = 10;
        const hash = bcrypt.hashSync(password, saltRounds);

        db.queryCallback('INSERT INTO users(username, password, type) VALUES ($1, $2, $3);', [username, hash, user], (err, result) => {
            if (err || result.rowCount !== 1) {
                req.flash('error', `Error Registering User. Error Code: ${err.code}`);
                return res.redirect('/register');
            }

            req.flash('success', `Successfully registered ${username}! Please login with your new credentials.`);
            return res.redirect('/login');
        });
    },

    renderLogin: (req, res) => res.render('login'),

    login: (req, res) => {
        req.flash('success', 'Welcome!');

        const redirectUrl = req.session.returnTo || '/';
        delete req.session.returnTo;

        res.redirect(redirectUrl);
    },

    logout: (req, res) => {
        req.logout();
        req.flash('success', 'Successfully logged out!');
        return res.redirect('/login');
    },

    showUser: async (req, res) => {
        const { id } = req.params;

        const result = await db.queryAwait('SELECT * FROM users WHERE id=$1', [id]);

        if (result.rowCount === 0) {
            req.flash('error', "The user requested doesn't exist!");
            return res.redirect('/');
        }

        const [user] = result.rows;
        return res.render('users/show', { user });
    },

    updateUser: async (req, res) => {
        const { id } = req.params;
        const user = {
            ...req.body,
        };

        if (parseInt(req.user.id, 10) !== parseInt(id, 10) && req.user.type !== 'admin') {
            req.flash('error', "You don't have permission to do that!");
            return res.redirect('/');
        }

        let result = await db.queryAwait('SELECT * FROM users WHERE id=$1', [id]);

        if (result.rowCount === 0) {
            req.flash('error', "The user requested doesn't exist!");
            return res.redirect('/');
        }

        result = await db.queryAwait('UPDATE public.users SET username=$1, email=$2, language=$3, country=$4, favorite_genre=$5, type=$6 WHERE id=$7;', [user.username, user.email, user.language, user.country, user.favorite_genre, user.type, id]);

        if (result.rowCount === 0) {
            req.flash('error', 'Error updating user information!');
            return res.redirect(`/users/${id}/edit`);
        }

        req.flash('success', 'Successfully updated user information!');
        return res.redirect(`/users/${id}`);
    },

    deleteUser: (req, res) => res.sendStatus(403),

    renderEditForm: async (req, res) => {
        const { id } = req.params;

        if (parseInt(req.user.id, 10) !== parseInt(id, 10) && req.user.type !== 'admin') {
            req.flash('error', "You don't have permission to do that!");
            return res.redirect('/');
        }

        const result = await db.queryAwait('SELECT * FROM users WHERE id=$1', [id]);

        if (result.rowCount === 0) {
            req.flash('error', "The user requested doesn't exist!");
            return res.redirect('/');
        }

        const [user] = result.rows;
        return res.render('users/edit', { user });
    },
};
