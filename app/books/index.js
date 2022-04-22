const db = require('../../db');

module.exports = {
    index: (req, res) => {
        db.query(
            'SELECT * FROM books LIMIT 20',
            (err, result) => {
                if (err) {
                    req.flash('error', `Error fetching books. Error Code: ${err.code}`);
                }

                return res.render('books/index', { books: result.rows });
            },
        );
    },

    createBook: (req, res) => res.sendStatus(200),

    renderNewForm: (req, res) => res.render('books/new'),

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

    updateBook: (req, res) => res.sendStatus(200),

    deleteBook: (req, res) => res.sendStatus(200),

    renderEditForm: (req, res) => res.render('books/edit'),
};
