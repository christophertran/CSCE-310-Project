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

        // Insert the book with the author_id field populated
        result = await db.queryAwait('INSERT INTO books(author_id, title, description, isbn, cover_url, country, language, genre) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);', [author.id, book.title, book.description, book.isbn, book.cover_url, book.country, book.language, book.genre]);

        // If the insert didn't work properly, redirect the user back to /books/new route
        if (result.rowCount === 0) {
            req.flash('error', 'Error inserting book!');
            return res.redirect('/books/new');
        }

        // If the insert worked properly, then query for the newly created book
        result = await db.queryAwait('SELECT id FROM books where UPPER(title) = $1;', [book.title.toUpperCase()]);

        // Get the new book
        const [newBook] = result.rows;

        // Redirect the user to the show page of their newly created book
        req.flash('success', 'Successfully created book!');
        return res.redirect(`/books/${newBook.id}`);
    },

    renderNewForm: (req, res) => res.render('books/new'),

    showBook: async (req, res) => {
        const { id } = req.params;
        const result = await db.queryAwait('SELECT * FROM books where id = $1;', [id]);

        if (result.rowCount === 0) {
            req.flash('error', "The book requested doesn't exist!");
            return res.redirect('/books');
        }

        const [book] = result.rows;
        return res.render('books/show', { book });
    },

    updateBook: async (req, res) => {
        const { id } = req.params;
        const book = {
            ...req.body,
        };

        // Search for the author based on first_name and last_name
        let result = await db.queryAwait('SELECT * FROM authors WHERE UPPER(first_name)=$1 AND UPPER(last_name)=$2;', [book.author_first_name.toUpperCase(), book.author_last_name.toUpperCase()]);

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

        // TODO: Fix the time format issue, it breaks when you insert the DATE 
        // that gets returned. We need to format it before UPDATE for both this and authors
        // Update the book with the author_id field populated
        result = await db.queryAwait('UPDATE books SET author_id=$1, title=$2, description=$3, isbn=$4, cover_url=$5, country=$6, language=$7, genre=$8 WHERE id=$9;', [author.id, book.title, book.description, book.isbn, book.cover_url, book.country, book.language, book.genre, id]);

        // If the update didn't work properly, redirect the user back to /books/new route
        if (result.rowCount === 0) {
            req.flash('error', 'Error updating book!');
            return res.redirect('/books/new');
        }

        // If the update worked properly, then query for the newly created book
        result = await db.queryAwait('SELECT id FROM books where UPPER(title) = $1;', [book.title.toUpperCase()]);

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
        let result = await db.queryAwait('SELECT * FROM books where id=$1;', [id]);

        if (result.rowCount === 0) {
            req.flash('error', "The book requested doesn't exist!");
            return res.redirect('/books');
        }

        const [book] = result.rows;
        result = await db.queryAwait('SELECT * FROM authors where id=$1;', [book.author_id]);

        const [author] = result.rows;
        return res.render('books/edit', { book, author });
    },
};
