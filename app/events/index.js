const db = require('../../db');

/*
Jubey Garza created this file
*/

module.exports = {

    // this is the function that give the event data to the even index page
    index: async (req, res) => {
        const result = await db.queryAwait('SELECT * FROM events;');
        return res.render('events/index', { events: result.rows });
    },

    // this function takes information from a form in the new event page and inserts it into the database
    createEvent: async (req, res) => {
        const event = { ...req.body };

        // Look for the event in the DB by name
        let result = await db.queryAwait('SELECT * FROM events WHERE UPPER(name)=$1;', [event.name.toUpperCase()]);

        // If the event already exists, redirect the user back to /events/new
        if (result.rowCount !== 0) {
            req.flash('error', 'Event already exists!');
            return res.redirect('/Events/new');
        }

        // Search for the author based on firstName and lastName
        result = await db.queryAwait('SELECT * FROM authors WHERE UPPER(first_name)=$1 AND UPPER(last_name)=$2;', [event.author_f.toUpperCase(), event.author_l.toUpperCase()]);

        // If the author doesn't already exist...
        if (result.rowCount === 0) {
            // Then create the author with the given firstName and lastName
            result = await db.queryAwait('INSERT INTO authors(first_name, last_name, birth_date, website, bio) VALUES ($1, $2, $3, $4, $5);', [event.author_f, event.author_l, null, null, null]);

            // If the insert didn't work properly, redirect the user back to /books/new route
            if (result.rowCount === 0) {
                req.flash('error', 'Error inserting author!');
                return res.redirect('/events/new');
            }

            // If the insert worked properly, then query for the newly created author
            result = await db.queryAwait('SELECT * FROM authors WHERE UPPER(first_name)=$1 AND UPPER(last_name)=$2;', [event.author_f.toUpperCase(), event.author_l.toUpperCase()]);
        }

        // Get the author
        const [author] = result.rows;

        // If the event doesn't already exist, then we insert the new event
        result = await db.queryAwait('INSERT INTO Events(user_id, name, description, date, category, author_id, admission_link) VALUES ($1, $2, $3, $4, $5, $6, $7);', [req.user.id, event.name, event.description, event.date, event.category, author.id, event.admission_link]);

        // If the insert isn't successful, redirect the user back to /events/new
        if (result.rowCount === 0) {
            req.flash('error', 'Error inserting new Event!');
            return res.redirect('/Events/new');
        }

        // If the insert is successful, get the id of the new event
        result = await db.queryAwait('SELECT id FROM Events WHERE UPPER(name)=$1;', [event.name.toUpperCase()]);

        const [newEvent] = result.rows;

        // Redirect the user to the new event's page
        req.flash('success', 'Successfully created new event!');
        return res.redirect(`/events/${newEvent.id}`);
    },

    renderNewForm: (req, res) => res.render('events/new'),

    // this function gets data abouta specific event to the show events page
    showEvent: async (req, res) => {
        const { id } = req.params;

        // Look for Event by id
        let result = await db.queryAwait('SELECT * FROM events WHERE id=$1', [id]);

        // If the event doesn't exist, redirect the user back to /Events
        if (result.rowCount === 0) {
            req.flash('error', "The event requested doesn't exist!");
            return res.redirect('/events');
        }

        const [event] = result.rows;

        result = await db.queryAwait('SELECT * FROM authors WHERE id=$1', [event.author_id]);

        // If the event doesn't exist, redirect the user back to /Events
        if (result.rowCount === 0) {
            req.flash('error', "The author requested doesn't exist!");
            return res.redirect('/events');
        }

        const [author] = result.rows;

        return res.render('events/show', { event, author });
    },

    // this function gets updates data for an event instance
    updateEvent: async (req, res) => {
        const { id } = req.params;
        const event = {
            ...req.body,
        };

        // Look for event by id
        let result = await db.queryAwait('SELECT * FROM events WHERE id=$1', [id]);

        // If the event doesn't exist, redirect the user back to /events
        if (result.rowCount === 0) {
            req.flash('error', "The event requested doesn't exist!");
            return res.redirect('/events');
        }

        // Search for the author based on firstName and lastName
        result = await db.queryAwait('SELECT * FROM authors WHERE UPPER(first_name)=$1 AND UPPER(last_name)=$2;', [event.author_f.toUpperCase(), event.author_l.toUpperCase()]);

        // If the author doesn't already exist...
        if (result.rowCount === 0) {
            // Then create the author with the given firstName and lastName
            result = await db.queryAwait('INSERT INTO authors(first_name, last_name, birth_date, website, bio) VALUES ($1, $2, $3, $4, $5);', [event.author_f, event.author_l, null, null, null]);

            // If the insert didn't work properly, redirect the user back to /books/new route
            if (result.rowCount === 0) {
                req.flash('error', 'Error inserting author!');
                return res.redirect('/events/new');
            }

            // If the insert worked properly, then query for the newly created author
            result = await db.queryAwait('SELECT * FROM authors WHERE UPPER(first_name)=$1 AND UPPER(last_name)=$2;', [event.author_f.toUpperCase(), event.author_l.toUpperCase()]);
        }

        // Get the author
        const [author] = result.rows;

        // If the event does exist, then we update the event
        result = await db.queryAwait('UPDATE events SET name=$1, description=$2, date=$3, category=$4, author_id=$5, admission_link=$6 WHERE id=$7;', [event.name, event.description, event.date, event.category, author.id, event.admission_link, id]);

        // If the update isn't successful, redirect the user back to /events/:id/edit
        if (result.rowCount === 0) {
            req.flash('error', 'Error updating event!');
            return res.redirect('/events/new');
        }

        // Redirect the user to the updated event's page
        req.flash('success', 'Successfully updated event!');
        return res.redirect(`/events/${id}`);
    },

    // this ducntion removes a specific event from the database
    deleteEvent: async (req, res) => {
        const { id } = req.params;

        // Look for event by id
        let result = await db.queryAwait('SELECT * FROM events WHERE id=$1', [id]);

        // If the event doesn't exist, redirect the user back to /events
        if (result.rowCount === 0) {
            req.flash('error', "The event requested doesn't exist!");
            return res.redirect('/events');
        }

        // If the event does exist, then delete the event
        result = await db.queryAwait('DELETE FROM events WHERE id=$1', [id]);

        // If the delete isn't successful, redirect the user back to /events/:id/edit
        if (result.rowCount === 0) {
            req.flash('error', 'Error deleting event!');
            return res.redirect(`/events/${id}/edit`);
        }

        // Redirect the user to the /events index
        req.flash('success', 'Successfully deleted event!');
        return res.redirect('/events');
    },

    // this function gets data about a specific event for the edit page
    renderEditForm: async (req, res) => {
        const { id } = req.params;

        // Look for event by id
        let result = await db.queryAwait('SELECT * FROM events WHERE id=$1', [id]);

        // If the event doesn't exist, redirect the user back to /events
        if (result.rowCount === 0) {
            req.flash('error', "The event requested doesn't exist!");
            return res.redirect('/events');
        }

        const [event] = result.rows;
        result = await db.queryAwait('SELECT * FROM authors WHERE id=$1', [event.author_id]);

        // If the event doesn't exist, redirect the user back to /Events
        if (result.rowCount === 0) {
            req.flash('error', "The author requested doesn't exist!");
            return res.redirect('/events');
        }

        const [author] = result.rows;

        // Render the edit page
        return res.render('events/edit', { event, author });
    },

};
