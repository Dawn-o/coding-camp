import { nanoid } from 'nanoid';

const books = [];

const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }

    const id = nanoid();
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

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
        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        }).code(201);
    }

    return h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan'
    }).code(500);
};

const getAllBooksHandler = (request) => {
    const { name, reading, finished } = request.query;

    let filteredBooks = [...books];

    if (name) {
        filteredBooks = filteredBooks.filter((book) => 
            book.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    if (reading !== undefined) {
        const isReading = reading === '1';
        filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
    }

    if (finished !== undefined) {
        const isFinished = finished === '1';
        filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
    }

    return {
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    };
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const book = books.find((b) => b.id === id);

    if (book) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    }).code(404);
};

const updateBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }

    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        }).code(404);
    }

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
        finished: pageCount === readPage,
        updatedAt: new Date().toISOString(),
    };

    return {
        status: 'success',
        message: 'Buku berhasil diperbarui'
    };
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        }).code(404);
    }

    books.splice(index, 1);

    return {
        status: 'success',
        message: 'Buku berhasil dihapus'
    };
};

export {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookByIdHandler,
    deleteBookByIdHandler,
};