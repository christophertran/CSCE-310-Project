const db = require('../../db');

module.exports = {
    renderBooks: (req, res) => {
        res.render('books/index');
    },

    renderBook: (req, res) => {
        const { id } = req.params;
        let bookInfo = 'Query result from DB here pls';

        db.query('SELECT * FROM books where id = $1;', [id], (err, result) => {
            if (err) {
                req.flash('error', `Error fetching book. Error Code: ${err.code}`);
            }

            bookInfo = result.rows[0];

            return res.render('books/show', { book: bookInfo });
        });
    },
};
