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
            toReads = await db.queryAwait(`SELECT * FROM book WHERE id IN (${toReads.join()})`, []);
            toReads = toReads.rows;
        }

        if (favorites.rowCount === 0) {
            favorites = [];
        } else {
            favorites = favorites.rows.map((row) => parseInt(row.book_id, 10));
            favorites = await db.queryAwait(`SELECT * FROM book WHERE id IN (${favorites.join()})`, []);
            favorites = favorites.rows;
        }

        return res.render('lists/list', { toReads, favorites });
    },

};
