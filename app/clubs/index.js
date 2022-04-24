const db = require('../../db');

async function getMembers(id) {
    let result = await db.queryAwait('SELECT user_id FROM book_club_members WHERE book_club_id=$1', [id]);

    if (result.rowCount === 0) {
        return result.rows;
    }

    const users = result.rows.map((row) => parseInt(row.user_id, 10));

    result = await db.queryAwait(`SELECT id, username FROM users WHERE id IN (${users.join()})`, []);

    return result.rows;
}

module.exports = {
    index: async (req, res) => {
        const result = await db.queryAwait('SELECT * FROM book_clubs;');
        return res.render('clubs/index', { clubs: result.rows });
    },

    createClub: async (req, res) => {
        const club = {
            ...req.body,
        };

        // Look for the club in the DB by name
        let result = await db.queryAwait('SELECT * FROM book_clubs WHERE UPPER(name)=$1;', [club.name.toUpperCase()]);

        // If the club already exists, redirect the user back to /clubs/new
        if (result.rowCount !== 0) {
            req.flash('error', 'Club already exists!');
            return res.redirect('/clubs/new');
        }

        // If the club doesn't already exist, then we insert the new club
        result = await db.queryAwait('INSERT INTO book_clubs(name, description) VALUES ($1, $2);', [club.name, club.description]);

        // If the insert isn't successful, redirect the user back to /clubs/new
        if (result.rowCount === 0) {
            req.flash('error', 'Error inserting club!');
            return res.redirect('/clubs/new');
        }

        // If the insert is successful, get the id of the new club
        result = await db.queryAwait('SELECT id FROM book_clubs WHERE UPPER(name)=$1;', [club.name.toUpperCase()]);

        const [newClub] = result.rows;

        // Redirect the user to the new club's page
        req.flash('success', 'Successfully created club!');
        return res.redirect(`/clubs/${newClub.id}`);
    },

    renderNewForm: (req, res) => res.render('clubs/new'),

    showClub: async (req, res) => {
        const { id } = req.params;

        // Look for club by id
        let result = await db.queryAwait('SELECT * FROM book_clubs WHERE id=$1', [id]);

        // If the book doesn't exist, redirect the user back to /clubs
        if (result.rowCount === 0) {
            req.flash('error', "The club requested doesn't exist!");
            return res.redirect('/clubs');
        }

        const [club] = result.rows;
        const members = await getMembers(id);

        if (req.user) {
            result = await db.queryAwait('SELECT * FROM book_club_members WHERE user_id=$1 AND book_club_id=$2', [req.user.id, id]);

            if (result.rowCount !== 0) {
                return res.render('clubs/show', { club, members, isMember: true });
            }
        }

        // Render the show page
        return res.render('clubs/show', { club, members, isMember: false });
    },

    updateClub: async (req, res) => {
        const { id } = req.params;
        const club = {
            ...req.body,
        };

        // Look for club by id
        let result = await db.queryAwait('SELECT * FROM book_clubs WHERE id=$1', [id]);

        // If the book doesn't exist, redirect the user back to /clubs
        if (result.rowCount === 0) {
            req.flash('error', "The club requested doesn't exist!");
            return res.redirect('/clubs');
        }

        // FIXME: You can change the first_name and last_name of the author to a non
        // unique combination it's not really important to fix that right now though...
        // As long as when creating the author the first_name and last_name is unique
        // is good enough.

        // If the club does exist, then we update the club
        result = await db.queryAwait('UPDATE book_clubs SET name=$1, description=$2 WHERE id=$3;', [club.name, club.description, id]);

        // If the update isn't successful, redirect the user back to /clubs/:id/edit
        if (result.rowCount === 0) {
            req.flash('error', 'Error updating club!');
            return res.redirect('/clubs/new');
        }

        // Redirect the user to the updated club's page
        req.flash('success', 'Successfully updated club!');
        return res.redirect(`/clubs/${id}`);
    },

    deleteClub: async (req, res) => {
        const { id } = req.params;

        // Look for club by id
        let result = await db.queryAwait('SELECT * FROM book_clubs WHERE id=$1', [id]);

        // If the book doesn't exist, redirect the user back to /clubs
        if (result.rowCount === 0) {
            req.flash('error', "The club requested doesn't exist!");
            return res.redirect('/clubs');
        }

        // If the club does exist, then delete the club
        result = await db.queryAwait('DELETE FROM book_clubs WHERE id=$1', [id]);

        // If the delete isn't successful, redirect the user back to /clubs/:id/edit
        if (result.rowCount === 0) {
            req.flash('error', 'Error deleting club!');
            return res.redirect(`/clubs/${id}/edit`);
        }

        // Redirect the user to the /clubs index
        req.flash('success', 'Successfully deleted club!');
        return res.redirect('/clubs');
    },

    renderEditForm: async (req, res) => {
        const { id } = req.params;

        // Look for club by id
        const result = await db.queryAwait('SELECT * FROM book_clubs WHERE id=$1', [id]);

        // If the club doesn't exist, redirect the user back to /clubs
        if (result.rowCount === 0) {
            req.flash('error', "The club requested doesn't exist!");
            return res.redirect('/clubs');
        }

        // Render the edit page
        const [club] = result.rows;
        return res.render('clubs/edit', { club });
    },

    getMembers: async (req, res) => {
        const { id } = req.params;

        // Look for club by id
        const result = await db.queryAwait('SELECT * FROM book_clubs WHERE id=$1', [id]);

        // If the club doesn't exist, redirect the user back to /clubs
        if (result.rowCount === 0) {
            req.flash('error', "The club requested doesn't exist!");
            return res.redirect('/clubs');
        }

        return res.json(await getMembers(id));
    },

    addMember: async (req, res) => {
        const { id } = req.params;

        // Look for club by id
        let result = await db.queryAwait('SELECT * FROM book_clubs WHERE id=$1', [id]);

        // If the club doesn't exist, redirect the user back to /clubs
        if (result.rowCount === 0) {
            req.flash('error', "The club requested doesn't exist!");
            return res.redirect('/clubs');
        }

        // If the club does exist, then check if the current user is already a member
        result = await db.queryAwait('SELECT * FROM book_club_members WHERE user_id=$1 AND book_club_id=$2', [req.user.id, id]);

        // If the user is already a member, redirect the user back to /clubs/:id
        if (result.rowCount !== 0) {
            req.flash('error', "You're already a member of this club!");
            return res.redirect(`/clubs/${id}`);
        }

        // If the user isn't already a member, then insert them
        result = await db.queryAwait('INSERT INTO book_club_members(user_id, book_club_id) VALUES($1, $2)', [req.user.id, id]);

        // If the insert failed, redirect the user back to /clubs/:id
        if (result.rowCount === 0) {
            req.flash('error', 'Error inserting member into club!');
            return res.redirect(`/clubs/${id}`);
        }

        req.flash('success', 'Successfully added member into club!');
        return res.redirect(`/clubs/${id}`);
    },

    deleteMember: async (req, res) => {
        const { id } = req.params;

        // Look for club by id
        let result = await db.queryAwait('SELECT * FROM book_clubs WHERE id=$1', [id]);

        // If the club doesn't exist, redirect the user back to /clubs
        if (result.rowCount === 0) {
            req.flash('error', "The club requested doesn't exist!");
            return res.redirect('/clubs');
        }

        // If the club does exist, then check if the current user is already a member
        result = await db.queryAwait('SELECT * FROM book_club_members WHERE user_id=$1 AND book_club_id=$2', [req.user.id, id]);

        // If the user is not a member, redirect the user back to /clubs/:id
        if (result.rowCount === 0) {
            req.flash('error', "You're not a member of this club!");
            return res.redirect(`/clubs/${id}`);
        }

        // If the user is a member, then delete them
        result = await db.queryAwait('DELETE FROM book_club_members WHERE user_id=$1 AND book_club_id=$2', [req.user.id, id]);

        // If the delete failed, redirect the user back to /clubs/:id
        if (result.rowCount === 0) {
            req.flash('error', 'Error deleting member from club!');
            return res.redirect(`/clubs/${id}`);
        }

        req.flash('success', 'Successfully deleted member from club!');
        return res.redirect(`/clubs/${id}`);
    },
};
