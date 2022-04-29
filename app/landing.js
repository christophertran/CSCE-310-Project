/* Daniel Ortiz-Chaves
    This is a query for the homepage to get the number of books within the database.
    Then it will generate 4 random possible book ids, then it will query for those random books.
    Finally it will send the query results to the homepage to display the books.

    This is done to show the user a range of books the website holds, to entice them to read more
    books and different types of books they otherwise wouldn't read.

*/

const db = require('../db');

function getRandNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    renderLanding: async (req, res) => {
        let result = await db.queryAwait('SELECT COUNT (*) FROM books;', []);

        if (result.rowCount === 0) {
            req.flash('error', 'Error fetching book count.');
            res.redirect('/');
        }

        const max = result.rows[0].count;
        const ids = [
            getRandNum(0, max),
            getRandNum(0, max),
            getRandNum(0, max),
            getRandNum(0, max),
        ];

        result = await db.queryAwait('SELECT * FROM books WHERE id IN ($1, $2, $3, $4);', [ids[0], ids[1], ids[2], ids[3]]);
        return res.render('landing', { books: result.rows });
    },
};
