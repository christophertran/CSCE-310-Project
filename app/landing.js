const db = require('../db');

module.exports = {

    display: (req, res) => {
        let max = 0;
        db.query('SELECT COUNT (*) FROM books;', (err, result) => {
            if (err) {
                req.flash('error', `Error fetching book count. Error Code: ${err.code}`);
            }
            max = result.rows[0].count;

            console.log(max);
            const ids = getRandNums(0, max);
            console.log(ids);

            db.query('SELECT id, cover FROM books WHERE id IN ($1, $2, $3, $4);', [ids[0], ids[1], ids[2], ids[3]], (err, result) => {
                if (err) {
                    req.flash('error', `Error fetching books. Error Code: ${err.code}`);
                }
                // Debugging tool: return res.json(result);

                return res.render('landing', { data: result.rows });
            });
            // return res.render('landing', { data: result });
        });
    },

};

function getRandNums(min, max) {
    return [Math.floor(Math.random() * (max - min + 1)) + min,
        Math.floor(Math.random() * (max - min + 1)) + min,
        Math.floor(Math.random() * (max - min + 1)) + min,
        Math.floor(Math.random() * (max - min + 1)) + min];
}
