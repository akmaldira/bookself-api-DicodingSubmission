const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = async (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = await request.payload;

    if (name === undefined) {
        const response = await h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = await h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    let finished = false;

    if (pageCount === readPage) {
        finished = true;
    }

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };
    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = async (request, h) => {
    const { name, reading, finished } = request.query;
    if (name !== undefined) {
        const book = books.filter((n) => n.name.toUpperCase() === name.toUpperCase());
        if (book.length < 1) {
            const response = await h.response({
                status: 'fail',
                message: `Buku dengan nama ${name} tidak ditemukan`,
            });
            response.code(404);
            return response;
        }
        const response = await h.response({
            status: 'success',
            data: book,
        });
        response.code(200);
        return response;
    }
    if (reading !== undefined) {
        if (reading === '0') {
            const book = books.filter((n) => n.reading === false);
            const response = await h.response({
                status: 'success',
                data: book,
            });
            response.code(200);
            return response;
        }
        if (reading === '1') {
            const book = books.filter((n) => n.reading === true);
            const response = await h.response({
                status: 'success',
                data: book,
            });
            response.code(200);
            return response;
        }
        const response = await h.response({
            status: 'success',
            data: books,
        });
        response.code(200);
        return response;
    }
    if (finished !== undefined) {
        if (finished === '0') {
            const book = books.filter((n) => n.finished === false);
            const response = await h.response({
                status: 'success',
                data: book,
            });
            response.code(200);
            return response;
        }
        if (finished === '1') {
            const book = books.filter((n) => n.finished === true);
            const response = await h.response({
                status: 'success',
                data: book,
            });
            response.code(200);
            return response;
        }
        const response = await h.response({
            status: 'success',
            data: books,
        });
        response.code(200);
        return response;
    }
    const response = await h.response({
        status: 'success',
        data: books.map((book) => {
            return {
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            };
        }),
    });
    response.code(200);
    return response;
};

const getBookById = async (request, h) => {
    const { id } = await request.params;
    const book = books.filter((n) => n.id === id)[0];
    if (book === undefined) {
        const response = await h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    }
    const response = await h.response({
        status: 'success',
        data: book,
    });
    response.code(200);
    return response;
};

const editBookById = async (request, h) => {
    const { id } = await request.params;
    if (id === undefined) {
        const response = await h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = await request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        if (name === undefined) {
            const response = await h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        }
        if (readPage > pageCount) {
            const response = await h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookById = async (request, h) => {
    const { id } = await request.params;
    const index = books.findIndex((note) => note.id === id);
    if (index !== -1) {
        books.splice(index, 1);
        const response = await h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = await h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookById,
    editBookById,
    deleteBookById,
};
