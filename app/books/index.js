const db = require('../../db');

module.exports = {
    index: async (req, res) => {
        const result = await db.queryAwait('SELECT * FROM books;');
        return res.render('books/index', { books: result.rows });
    },

    createBook: async (req, res) => {
        const book = {
            ...req.body,
        };

        // Search for the author based on first_name and last_name
        let result = await db.queryAwait('SELECT * FROM authors WHERE UPPER(first_name)=$1 AND UPPER(last_name)=$2;', [book.author_first_name.toUpperCase(), book.author_last_name.toUpperCase()]);

        // If the author doesn't already exist...
        if (result.rowCount === 0) {
            // Then create the author with the given first_name and last_name
            result = await db.queryAwait('INSERT INTO authors(first_name, last_name, birth_date, website, bio, user_id) VALUES ($1, $2, $3, $4, $5, $6);', [book.author_first_name, book.author_last_name, null, null, null, req.user.id]);

            // If the insert didn't work properly, redirect the user back to /books/new route
            if (result.rowCount === 0) {
                req.flash('error', 'Error inserting author!');
                return res.redirect('/books/new');
            }

            // If the insert worked properly, then query for the newly created author
            result = await db.queryAwait('SELECT * FROM authors WHERE UPPER(first_name)=$1 AND UPPER(last_name)=$2;', [book.author_first_name.toUpperCase(), book.author_last_name.toUpperCase()]);
        }

        // Get the author
        const [author] = result.rows;

        // Insert the book with the author_id field populated
        result = await db.queryAwait('INSERT INTO books(author_id, title, description, isbn, cover_url, country, language, genre, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);', [author.id, book.title, book.description, book.isbn, book.cover_url, book.country, book.language, book.genre, req.user.id]);

        // If the insert didn't work properly, redirect the user back to /books/new route
        if (result.rowCount === 0) {
            req.flash('error', 'Error inserting book!');
            return res.redirect('/books/new');
        }

        // If the insert worked properly, then query for the newly created book
        result = await db.queryAwait('SELECT id FROM books WHERE UPPER(title)=$1;', [book.title.toUpperCase()]);

        // Get the new book
        const [newBook] = result.rows;

        // Redirect the user to the show page of their newly created book
        req.flash('success', 'Successfully created book!');
        return res.redirect(`/books/${newBook.id}`);
    },

    renderNewForm: (req, res) => res.render('books/new'),

    showBook: async (req, res) => {
        const { id } = req.params;

        let result = await db.queryAwait('SELECT * FROM books WHERE id=$1;', [id]);

        if (result.rowCount === 0) {
            req.flash('error', "The book requested doesn't exist!");
            return res.redirect('/books');
        }

        const [book] = result.rows;

        result = await db.queryAwait('SELECT reviews.*, users.username FROM reviews INNER JOIN users ON reviews.user_id=users.id WHERE reviews.book_id=$1;', [id]);

        const reviews = result.rows;

        return res.render('books/show', { book, reviews });
    },

    updateBook: async (req, res) => {
        const { id } = req.params;
        const book = {
            ...req.body,
        };

        let result = await db.queryAwait('SELECT * FROM books WHERE UPPER(title)=$1 AND isbn=$2;', [book.title.toUpperCase(), book.isbn]);

        // If the book already exists, redirect the user back to /books/new
        if (result.rowCount !== 0) {
            req.flash('error', 'Book already exists!');
            return res.redirect('/books/new');
        }

        // Search for the author based on first_name and last_name
        result = await db.queryAwait('SELECT * FROM authors WHERE UPPER(first_name)=$1 AND UPPER(last_name)=$2;', [book.author_first_name.toUpperCase(), book.author_last_name.toUpperCase()]);

        // If the author doesn't already exist...
        if (result.rowCount === 0) {
            // Then create the author with the given first_name and last_name
            result = await db.queryAwait('INSERT INTO authors(first_name, last_name, birth_date, website, bio) VALUES ($1, $2, $3, $4, $5);', [book.author_first_name, book.author_last_name, null, null, null]);

            // If the insert didn't work properly, redirect the user back to /books/new route
            if (result.rowCount === 0) {
                req.flash('error', 'Error inserting author!');
                return res.redirect('/books/new');
            }

            // If the insert worked properly, then query for the newly created author
            result = await db.queryAwait('SELECT * FROM authors WHERE UPPER(first_name)=$1 AND UPPER(last_name)=$2;', [book.author_first_name.toUpperCase(), book.author_last_name.toUpperCase()]);
        }

        // Get the author
        const [author] = result.rows;

        // FIXME: You can change the title and isbn of the book to a non
        // unique combination it's not really important to fix that right now though...
        // As long as when creating the book the title and isbn is unique
        // is good enough.

        // Update the book with the author_id field populated
        result = await db.queryAwait('UPDATE books SET author_id=$1, title=$2, description=$3, isbn=$4, cover_url=$5, country=$6, language=$7, genre=$8 WHERE id=$9;', [author.id, book.title, book.description, book.isbn, book.cover_url, book.country, book.language, book.genre, id]);

        // If the update didn't work properly, redirect the user back to /books/new route
        if (result.rowCount === 0) {
            req.flash('error', 'Error updating book!');
            return res.redirect('/books/new');
        }

        // If the update worked properly, then query for the newly created book
        result = await db.queryAwait('SELECT id FROM books WHERE UPPER(title)=$1;', [book.title.toUpperCase()]);

        // Get the updated book
        const [updatedBook] = result.rows;

        // Redirect the user to the show page of their updated book
        req.flash('success', 'Successfully updated book!');
        return res.redirect(`/books/${updatedBook.id}`);
    },

    deleteBook: async (req, res) => {
        const { id } = req.params;

        const result = await db.queryAwait('DELETE FROM books WHERE id=$1;', [id]);

        if (result.rowCount === 0) {
            req.flash('error', 'Error deleting book!');
            return res.redirect(`/books/${id}/edit`);
        }

        req.flash('success', 'Successfully deleted book!');
        return res.redirect('/books');
    },

    renderEditForm: async (req, res) => {
        const { id } = req.params;
        let result = await db.queryAwait('SELECT * FROM books WHERE id=$1;', [id]);

        if (result.rowCount === 0) {
            req.flash('error', "The book requested doesn't exist!");
            return res.redirect('/books');
        }

        const [book] = result.rows;
        result = await db.queryAwait('SELECT * FROM authors WHERE id=$1;', [book.author_id]);

        const [author] = result.rows;
        return res.render('books/edit', { book, author });
    },

    createReview: async (req, res) => {
        const { id } = req.params;
        const review = {
            ...req.body,
        };

        let result = await db.queryAwait('SELECT * FROM books WHERE id=$1;', [id]);

        if (result.rowCount === 0) {
            req.flash('error', "The book requested doesn't exist!");
            return res.redirect('/books');
        }

        result = await db.queryAwait('INSERT INTO reviews(book_id, user_id, content, rating) VALUES ($1, $2, $3, $4);', [id, req.user.id, review.content, review.rating]);

        if (result.rowCount === 0) {
            req.flash('error', 'Error creating review!');
            return res.redirect(`/books/${id}`);
        }

        req.flash('success', 'Successfully created review!');
        return res.redirect(`/books/${id}`);
    },

    deleteReview: async (req, res) => {
        const { id, reviewid } = req.params;

        let result = await db.queryAwait('SELECT * FROM books WHERE id=$1;', [id]);

        if (result.rowCount === 0) {
            req.flash('error', "The book requested doesn't exist!");
            return res.redirect('/books');
        }

        result = await db.queryAwait('SELECT * FROM reviews WHERE id=$1', [reviewid]);

        if (result.rowCount === 0) {
            req.flash('error', "The review requested doesn't exist!");
            return res.redirect(`/books/${id}`);
        }

        result = await db.queryAwait('DELETE FROM reviews WHERE id=$1', [reviewid]);

        if (result.rowCount === 0) {
            req.flash('error', 'Error deleting review!');
            return res.redirect(`/books/${id}`);
        }

        req.flash('success', 'Successfully deleted review!');
        return res.redirect(`/books/${id}`);
    },
};
