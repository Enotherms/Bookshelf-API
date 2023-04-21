const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');

const addBooksHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    if (!name) {
        const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const newBook = {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        id,
        finished,
        insertedAt,
        updatedAt,
    };
    bookshelf.push(newBook);

    const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;
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
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
    };

    const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    if (name) {
        const booksByName = bookshelf.filter(
        (book) => book.name.toLowerCase().includes(name.toLowerCase()),
        );

        const response = h.response({
        status: 'success',
        data: {
            books: booksByName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
            })),
        },
        });
        response.code(200);
        return response;
    }

    if (reading) {
        const booksByReading = reading === '1'
        ? bookshelf.filter((book) => book.reading === true)
        : bookshelf.filter((book) => book.reading === false);

        const response = h.response({
        status: 'success',
        data: {
            books: booksByReading.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
            })),
        },
        });
        response.code(200);
        return response;
    }

    if (finished) {
        const booksByFinished = finished === '1'
        ? bookshelf.filter((book) => book.finished === true)
        : bookshelf.filter((book) => book.finished === false);

        const response = h.response({
        status: 'success',
        data: {
            books: booksByFinished.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
            })),
        },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'success',
        data: {
        books: bookshelf.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        })),
        },
    });
    response.code(200);
    return response;
    };

    const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = bookshelf.filter((n) => n.id === bookId)[0];

    if (book !== undefined) {
        const response = h.response({
        status: 'success',
        data: {
            book,
        },
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
    };

    const editBooksByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const {
        name, year, author, summary, publisher,
        pageCount, readPage, reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;

    if (!name) {
        const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const index = bookshelf.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        bookshelf[index] = {
        ...bookshelf[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
        };
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

    const deleteBooksByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = bookshelf.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        bookshelf.splice(index, 1);
        const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
    };

    module.exports = {
    addBooksHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBooksByIdHandler,
    deleteBooksByIdHandler,
};
