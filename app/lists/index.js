/* Daniel Ortiz-Chaves
    This will query the list page and populate the list page with the user's books

*/

const db = require('../../db');

module.exports = {
    showList: async (req, res) => {
        const username = req.user.id;

        let toReads = await db.queryAwait('SELECT book_id FROM to_reads where user_id = $1;', [username]);
        let favorites = await db.queryAwait('SELECT book_id FROM favorites where user_id = $1;', [username]);

        if (toReads.rowCount === 0) {
            toReads = [];
        } else {
            toReads = toReads.rows.map((row) => parseInt(row.book_id, 10));
            toReads = await db.queryAwait(`SELECT * FROM books WHERE id IN (${toReads.join()})`, []);
            toReads = toReads.rows;
        }

        if (favorites.rowCount === 0) {
            favorites = [];
        } else {
            favorites = favorites.rows.map((row) => parseInt(row.book_id, 10));
            favorites = await db.queryAwait(`SELECT * FROM books WHERE id IN (${favorites.join()})`, []);
            favorites = favorites.rows;
        }

        return res.render('lists/list', { toReads, favorites });
    },

    searchRead: async (req, res) => {
        const {
            title, firstName, lastName, genre,
        } = req.query;

        let query = 'SELECT * FROM books WHERE ';

        // add title search value
        if (title === '') query += 'title IS NOT NULL and ';
        else query += `UPPER(title) LIKE UPPER('%${title}%') and `;

        // add author search value
        if (firstName !== undefined || lastName !== undefined) {
            const authors = await db.queryAwait('SELECT * FROM authors WHERE UPPER(firstName)=$1 AND UPPER(lastName)=$2;', [firstName.toUpperCase(), lastName.toUpperCase()]);
            const [author] = authors.rows;

            if (authors.rowCount === 0) {
                req.flash('error', 'Author could not be found');
                return res.redirect('/lists');
            }

            query += `author_id='${author.id}' and `;
        } else query += 'author_id IS NOT NULL and ';

        // add query search value
        if (genre === undefined || genre === '') query += 'genre IS NOT NULL';
        else query += `UPPER(genre) LIKE UPPER('%${genre}%')`;

        // make query to database for books that meet the search parameters
        const result = await db.queryAwait(query);

        if (result.rowCount === 0) {
            req.flash('error', 'No books found!');
            return res.redirect('/lists');
        }

        return res.render('lists/addReading', { books: result.rows });
    },

    searchFav: async (req, res) => {
        const {
            title, firstName, lastName, genre,
        } = req.query;

        let query = 'SELECT * FROM books WHERE ';

        // add title search value
        if (title === '') query += 'title IS NOT NULL and ';
        else query += `UPPER(title) LIKE UPPER('%${title}%') and `;

        // add author search value
        if (firstName !== undefined || lastName !== undefined) {
            const authors = await db.queryAwait('SELECT * FROM authors WHERE UPPER(firstName)=$1 AND UPPER(lastName)=$2;', [firstName.toUpperCase(), lastName.toUpperCase()]);
            const [author] = authors.rows;

            if (authors.rowCount === 0) {
                req.flash('error', 'Author could not be found');
                return res.redirect('/lists');
            }

            query += `author_id='${author.id}' and `;
        } else query += 'author_id IS NOT NULL and ';

        // add query search value
        if (genre === undefined || genre === '') query += 'genre IS NOT NULL';
        else query += `UPPER(genre) LIKE UPPER('%${genre}%')`;

        // make query to database for books that meet the search parameters
        const result = await db.queryAwait(query);

        if (result.rowCount === 0) {
            req.flash('error', 'No books found!');
            return res.redirect('/lists');
        }

        return res.render('lists/addFavorite', { books: result.rows });
    },

    addRead: async (req, res) => {
        const { id } = req.params;
        let result = await db.queryAwait('SELECT * FROM books WHERE id=$1;', [id]);

        if (result.rowCount === 0) {
            req.flash('error', "The book requested doesn't exist!");
            return res.redirect('/lists');
        }

        result = await db.queryAwait('INSERT INTO to_reads(user_id, book_id) VALUES ($1, $2);', [req.user.id, id]);

        if (result.rowCount === 0) {
            req.flash('error', 'Error adding book to your reading list!');
            return res.redirect('/lists');
        }

        req.flash('success', 'Successfully added to you reading list!');
        return res.redirect('/lists');
    },

    addFav: async (req, res) => {
        const { id } = req.params;

        let result = await db.queryAwait('SELECT * FROM books WHERE id=$1;', [id]);

        if (result.rowCount === 0) {
            req.flash('error', "The book requested doesn't exist!");
            return res.redirect('/lists');
        }

        result = await db.queryAwait('INSERT INTO favorites(user_id, book_id) VALUES ($1, $2);', [req.user.id, id]);

        if (result.rowCount === 0) {
            req.flash('error', 'Error adding book to your favorites list!');
            return res.redirect('/lists');
        }

        req.flash('success', 'Successfully added to you favorites list!');
        return res.redirect('/lists');
    },

    deleteRead: async (req, res) => {
        const { id } = req.params;

        let result = await db.queryAwait('SELECT * FROM to_reads WHERE user_id=$1 and book_id=$2;', [req.user.id, id]);

        if (result.rowCount === 0) {
            req.flash('error', "The book requested isn't in your reading list!");
            return res.redirect('/lists');
        }

        result = await db.queryAwait('DELETE FROM to_reads WHERE user_id=$1 and book_id=$2;', [req.user.id, id]);

        if (result.rowCount === 0) {
            req.flash('error', 'Error deleting reading list item!');
            return res.redirect('/lists');
        }

        req.flash('success', 'Successfully removed book from your reading list!');
        return res.redirect('/lists');
    },

    deleteFav: async (req, res) => {
        const { id } = req.params;

        let result = await db.queryAwait('SELECT * FROM favorites WHERE user_id=$1 and book_id=$2;', [req.user.id, id]);

        if (result.rowCount === 0) {
            req.flash('error', "The book requested isn't in your favorites list!");
            return res.redirect('/lists');
        }

        result = await db.queryAwait('DELETE FROM favorites WHERE user_id=$1 and book_id=$2;', [req.user.id, id]);

        if (result.rowCount === 0) {
            req.flash('error', 'Error deleting favorites list item!');
            return res.redirect('/lists');
        }

        req.flash('success', 'Successfully removed book from your favorites list!');
        return res.redirect('/lists');
    },
};
