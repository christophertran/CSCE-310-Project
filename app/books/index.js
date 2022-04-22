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

    createBook: (req, res) => {
        const book = {
            ...req.body,
        };

        /**
        const book = {
            title: 'potato',
            author: 'potato',
            publish_date: '2022-04-21',
            isbn: '3',
            cover: 'potato',
            country: 'potato',
            language: 'potato',
            pages: '3',
            genre: 'potato',
            edition: 'potato',
            description: 'potato'
        }
         */
        // TODO: Code to insert new book into database here...
        // Remove the console.log below and the comment above when complete
        // The author field will be provided as a string and should be replaced
        // with the primary key or id of the actual author given a query from the db...
        // If the author doesn't exist then we create one by inserting them into the db...
        console.log(book);

        res.redirect('books/new');
    },

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

    updateBook: (req, res) => {
        const { id } = req.params;
        const book = {
            ...req.body,
        };

        /**
        const book = {
            title: 'potato',
            author: 'potato',
            publish_date: '2022-04-21',
            isbn: '3',
            cover: 'potato',
            country: 'potato',
            language: 'potato',
            pages: '3',
            genre: 'potato',
            edition: 'potato',
            description: 'potato'
        }
         */
        // TODO: Code to update book into database here...
        // Remove the console.log below and the comment above when complete
        // The author field will be provided as a string and should be replaced
        // with the primary key or id of the actual author given a query from the db...
        // If the author doesn't exist then we create one by inserting them into the db...
        console.log(id, book);

        res.redirect('books/new');
    },

    deleteBook: (req, res) => res.sendStatus(403),

    renderEditForm: (req, res) => {
        const { id } = req.params;

        db.query('SELECT * FROM books where id = $1;', [id], (err1, result1) => {
            if (err1) {
                req.flash('error', `Error fetching book. Error Code: ${err1.code}`);
            }

            const [book] = result1.rows;

            db.query('SELECT * FROM authors where id = $1;', [book.author_id], (err2, result2) => {
                if (err2) {
                    req.flash('error', `Error fetching book. Error Code: ${err2.code}`);
                }

                const [author] = result2.rows;

                return res.render('books/edit', { book, author });
            });
        });
    },
};
