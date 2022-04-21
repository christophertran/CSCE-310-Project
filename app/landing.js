const db = require('../db');

function getRandNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    renderLanding: (req, res) => {
        db.query('SELECT COUNT (*) FROM books;', (err1, result1) => {
            if (err1) {
                req.flash('error', `Error fetching book count. Error Code: ${err1.code}`);
            }

            const max = result1.rows[0].count;
            const ids = [
                getRandNum(0, max),
                getRandNum(0, max),
                getRandNum(0, max),
                getRandNum(0, max),
            ];

            db.query(
                'SELECT id, cover FROM books WHERE id IN ($1, $2, $3, $4);',
                [ids[0], ids[1], ids[2], ids[3]],
                (err2, result2) => {
                    if (err2) {
                        req.flash('error', `Error fetching books. Error Code: ${err2.code}`);
                    }

                    // Debugging tool: return res.json(result);

                    return res.render('landing', { data: result2.rows });
                },
            );
        });
    },
};
