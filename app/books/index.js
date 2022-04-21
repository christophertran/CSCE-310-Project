const db = require('../../db');

module.exports = {
    index: (req, res) => {
        res.render('books/index');
    },

    showBook: (req, res) => {
        const { id } = req.params;

        db.query('SELECT * FROM books where id = $1;', [id], (err, result) => {
            if (err) {
                req.flash('error', `Error fetching book. Error Code: ${err.code}`);
            }

            const [book] = result.rows;

            return res.render('books/show', { book });
        });
    },

    renderNewForm: (req, res) => res.render('books/new'),

    renderEditForm: (req, res) => res.render('books/edit'),

    createBook: (req, res) => res.sendStatus(200),

    updateBook: (req, res) => res.sendStatus(200),

    deleteBook: (req, res) => res.sendStatus(200),
};
