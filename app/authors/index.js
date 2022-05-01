const db = require('../../db');

module.exports = {
    index: async (req, res) => {
        const result = await db.queryAwait('SELECT * FROM authors;');
        return res.render('authors/index', { authors: result.rows });
    },

    createAuthor: async (req, res) => {
        const author = {
            ...req.body,
        };

        // Look for the author in the DB by first_name and last_name
        let result = await db.queryAwait('SELECT * FROM authors WHERE UPPER(first_name)=$1 AND UPPER(last_name)=$2;', [author.first_name.toUpperCase(), author.last_name.toUpperCase()]);

        // If the author already exists, redirect the user back to /authors/new
        if (result.rowCount !== 0) {
            req.flash('error', 'Author already exists!');
            return res.redirect('/authors/new');
        }

        // If the author doesn't already exist, then we insert the new author
        result = await db.queryAwait('INSERT INTO authors(first_name, last_name, birth_date, website, bio, user_id) VALUES ($1, $2, $3, $4, $5, $6);', [author.first_name, author.last_name, author.birth_date, author.website, author.bio, req.user.id]);

        // If the insert isn't successful, redirect the user back to /authors/new
        if (result.rowCount === 0) {
            req.flash('error', 'Error inserting author!');
            return res.redirect('/authors/new');
        }

        // If the insert is successsful, get the id of the new author
        result = await db.queryAwait('SELECT id FROM authors WHERE UPPER(first_name)=$1 AND UPPER(last_name)=$2;', [author.first_name.toUpperCase(), author.last_name.toUpperCase()]);

        const [newAuthor] = result.rows;

        // Redirect the user to the new author's page
        req.flash('success', 'Successfully created author!');
        return res.redirect(`/authors/${newAuthor.id}`);
    },

    renderNewForm: (req, res) => res.render('authors/new'),

    showAuthor: async (req, res) => {
        const { id } = req.params;

        // Look for the author by id
        const result = await db.queryAwait('SELECT * FROM authors WHERE id=$1;', [id]);

        // If the author doesn't exists, redirect the user back to /authors
        if (result.rowCount === 0) {
            req.flash('error', "The author requested doesn't exist!");
            return res.redirect('/authors');
        }

        // Render the show page
        const [author] = result.rows;
        return res.render('authors/show', { author });
    },

    updateAuthor: async (req, res) => {
        const { id } = req.params;
        const author = {
            ...req.body,
        };

        // Look for the author by id
        let result = await db.queryAwait('SELECT * FROM authors where id=$1;', [id]);

        // If the author doesn't exists, redirect the user back to /authors
        if (result.rowCount === 0) {
            req.flash('error', "The author requested doesn't exist!");
            return res.redirect('/authors');
        }

        // FIXME: You can change the first_name and last_name of the author to a non
        // unique combination it's not really important to fix that right now though...
        // As long as when creating the author the first_name and last_name is unique
        // is good enough.

        // If the author does exist, then update the author
        result = await db.queryAwait('UPDATE authors SET first_name=$1, last_name=$2, birth_date=$3, website=$4, bio=$5 WHERE id=$6;', [author.first_name, author.last_name, author.birth_date, author.website, author.bio, id]);

        // If the update isn't successful, redirect the user back to /authors/:id/edit
        if (result.rowCount === 0) {
            req.flash('error', 'Error updating author!');
            return res.redirect(`/authors/${id}/edit`);
        }

        // Redirect the user to the updated author's page
        req.flash('success', 'Successfully updated author!');
        return res.redirect(`/authors/${id}`);
    },

    deleteAuthor: async (req, res) => {
        const { id } = req.params;

        // Look for the author by id
        let result = await db.queryAwait('SELECT * FROM authors WHERE id=$1;', [id]);

        // If the author doesn't exists, redirect the user back to /authors
        if (result.rowCount === 0) {
            req.flash('error', "The author requested doesn't exist!");
            return res.redirect('/authors');
        }

        // If the author does exist, then delete the author
        result = await db.queryAwait('DELETE FROM authors WHERE id=$1;', [id]);

        // If the delete isn't successful, redirect the user back to /authors/:id/edit
        if (result.rowCount === 0) {
            req.flash('error', 'Error deleting author!');
            return res.redirect(`/authors/${id}/edit`);
        }

        // Redirect the user to the /authors index
        req.flash('success', 'Successfully deleted author!');
        return res.redirect('/authors');
    },

    renderEditForm: async (req, res) => {
        const { id } = req.params;

        // Look for the author by id
        const result = await db.queryAwait('SELECT * FROM authors WHERE id=$1;', [id]);

        // If the author doesn't exists, redirect the user back to /authors
        if (result.rowCount === 0) {
            req.flash('error', "The author requested doesn't exist!");
            return res.redirect('/authors');
        }

        // Render the edit form
        let [author] = result.rows;
        author = {
            ...author,
            birth_date: new Date(author.birth_date).toISOString().split('T')[0],
        };

        return res.render('authors/edit', { author });
    },

    renderSearchForm: (req, res) => res.render('authors/search'),

    /*
    Christopher He

    this function allows people to search for authors based on author first or last name
    */

    search: async (req, res) => {
        const { first_name, last_name } = req.query;

        query = 'SELECT * FROM authors WHERE ';

        // add title search value
        if (first_name == '')
            query += 'first_name IS NOT NULL and ';
        else
            query += 'UPPER(first_name) LIKE UPPER(\'%' + first_name + '%\') and ';

        if (last_name == '')
            query += 'last_name IS NOT NULL';
        else
            query += 'UPPER(last_name) LIKE UPPER(\'%' + last_name + '%\')';

        const result = await db.queryAwait(query);

        if (result.rowCount === 0) {
            req.flash('error', 'No authors found!');
            return res.redirect(`/authors/search`);
        }

        return res.render('authors/sresults', { authors: result.rows });
    },
};
