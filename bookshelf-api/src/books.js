const { nanoid } = require('nanoid');

let books = [];

const addBook = (book) => {
    const newBook = {
        id: nanoid(),
        ...book,
        finished: book.pageCount === book.readPage,
        insertedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    books.push(newBook);
    return newBook;
};

const getAllBooks = () => {
    return books.map(({ id, name, publisher }) => ({ id, name, publisher }));
};

const getBookById = (id) => {
    return books.find(book => book.id === id);
};

const updateBookById = (id, updatedData) => {
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
        const updatedBook = {
            ...books[index],
            ...updatedData,
            finished: updatedData.pageCount === updatedData.readPage,
            updatedAt: new Date().toISOString(),
        };
        books[index] = updatedBook;
        return updatedBook;
    }
    return null;
};

const deleteBookById = (id) => {
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
        books.splice(index, 1);
        return true;
    }
    return false;
};

module.exports = {
    addBook,
    getAllBooks,
    getBookById,
    updateBookById,
    deleteBookById,
};