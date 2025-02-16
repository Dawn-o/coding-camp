const STORAGE_KEY = 'BOOKSHELF_APPS';

const elements = {
    bookForm: document.getElementById('bookForm'),
    searchForm: document.getElementById('searchBook'),
    incompleteBookList: document.getElementById('incompleteBookList'),
    completeBookList: document.getElementById('completeBookList'),
    bookSubmitButton: document.getElementById('bookFormSubmit'),
    formInputs: {
        title: document.getElementById('bookFormTitle'),
        author: document.getElementById('bookFormAuthor'),
        year: document.getElementById('bookFormYear'),
        isComplete: document.getElementById('bookFormIsComplete')
    }
};

let books = [];
let editingBookId = null;

const loadBooksFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(serializedData) || [];
};

const saveBooksToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
};

const createBookElement = (book) => {
    const bookItem = document.createElement('div');
    bookItem.setAttribute('data-bookid', book.id);
    bookItem.setAttribute('data-testid', 'bookItem');

    bookItem.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
            <button data-testid="bookItemIsCompleteButton">
                ${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
            </button>
            <button data-testid="bookItemDeleteButton">Hapus Buku</button>
            <button data-testid="bookItemEditButton">Edit Buku</button>
        </div>
    `;

    return bookItem;
};

const setFormMode = (isEditing) => {
    const { bookSubmitButton } = elements;
    const submitSpan = bookSubmitButton.querySelector('span');
    const sectionTitle = elements.bookForm.closest('section').querySelector('h2');

    if (isEditing) {
        bookSubmitButton.textContent = 'Edit Buku';
        sectionTitle.textContent = 'Edit Buku';
    } else {
        bookSubmitButton.textContent = 'Masukkan Buku ke rak ';
        bookSubmitButton.appendChild(submitSpan);
        submitSpan.textContent = elements.formInputs.isComplete.checked ? 'Selesai dibaca' : 'Belum selesai dibaca';
        sectionTitle.textContent = 'Tambah Buku Baru';
    }
};

const updateBookDisplay = () => {
    const { incompleteBookList, completeBookList } = elements;
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    books.forEach(book => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookList.appendChild(bookElement);
        } else {
            incompleteBookList.appendChild(bookElement);
        }
    });
};

const addBook = (bookData) => {
    const newBook = {
        id: +new Date(),
        ...bookData
    };
    books.push(newBook);
    saveBooksToStorage();
};

const updateBook = (id, bookData) => {
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
        books[index] = { ...books[index], ...bookData };
        saveBooksToStorage();
    }
};

const deleteBook = (id) => {
    const index = books.findIndex(book => book.id === Number(id));
    if (index !== -1) {
        books.splice(index, 1);
        saveBooksToStorage();
        updateBookDisplay();
    }
};

const toggleBookCompletion = (id) => {
    const book = books.find(book => book.id === Number(id));
    if (book) {
        book.isComplete = !book.isComplete;
        saveBooksToStorage();
    }
};

const handleSubmit = (e) => {
    e.preventDefault();
    const { title, author, year, isComplete } = elements.formInputs;

    const bookData = {
        title: title.value,
        author: author.value,
        year: parseInt(year.value),
        isComplete: isComplete.checked
    };

    if (editingBookId) {
        updateBook(editingBookId, bookData);
        editingBookId = null;
    } else {
        addBook(bookData);
    }

    updateBookDisplay();
    elements.bookForm.reset();
    setFormMode(false);
};

const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = document.getElementById('searchBookTitle').value.toLowerCase();
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm)
    );

    elements.incompleteBookList.innerHTML = '';
    elements.completeBookList.innerHTML = '';

    filteredBooks.forEach(book => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            elements.completeBookList.appendChild(bookElement);
        } else {
            elements.incompleteBookList.appendChild(bookElement);
        }
    });
};

elements.bookForm.addEventListener('submit', handleSubmit);
elements.searchForm.addEventListener('submit', handleSearch);

elements.formInputs.isComplete.addEventListener('change', () => {
    if (!editingBookId) {
        const submitSpan = elements.bookSubmitButton.querySelector('span');
        submitSpan.textContent = elements.formInputs.isComplete.checked ? 'Selesai dibaca' : 'Belum selesai dibaca';
    }
});

document.addEventListener('click', (e) => {
    const bookItem = e.target.closest('[data-bookid]');
    if (!bookItem) return;

    const bookId = Number(bookItem.dataset.bookid);

    if (e.target.matches('[data-testid="bookItemDeleteButton"]')) {
        if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
            deleteBook(bookId);
        }
    }

    if (e.target.matches('[data-testid="bookItemIsCompleteButton"]')) {
        toggleBookCompletion(bookId);
        updateBookDisplay();
    }

    if (e.target.matches('[data-testid="bookItemEditButton"]')) {
        const book = books.find(book => book.id === bookId);
        if (book) {
            editingBookId = book.id;
            const { title, author, year, isComplete } = elements.formInputs;
            title.value = book.title;
            author.value = book.author;
            year.value = book.year;
            isComplete.checked = book.isComplete;
            setFormMode(true);
            title.focus();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    books = loadBooksFromStorage();
    updateBookDisplay();
});