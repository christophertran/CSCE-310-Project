module.exports = {
    renderBooks: (req, res) => {
        res.render('books/index');
    },

    renderBook: (req, res) => {
        const id = req.params.id;
        let bookInfo = "Query result from DB here pls";

        res.render('books/show', {book: bookInfo});
    },
};
