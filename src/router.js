const {
    addBookHandler,
    getAllBooksHandler,
    getBookById,
    editBookById,
    deleteBookById,
} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getBookById,
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: editBookById,
    },
    {
        method: 'DELETE',
        path: '/notes/{id}',
        handler: deleteBookById,
    },
];

module.exports = routes;
