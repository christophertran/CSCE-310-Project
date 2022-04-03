module.exports = {
    health: (db) => (req, res, next) => {
        db.query('SELECT 1', (err) => {
            if (err) {
                console.error('Error running health check query on DB', err);
                return next(err);
            }

            return res.sendStatus(200);
        });
    },
};
