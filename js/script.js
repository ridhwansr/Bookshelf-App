document.addEventListener('DOMContentLoaded', function () {
    const inputBook = document.getElementById('inputBook');
    inputBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
});

function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookIsComplete = document.getElementById('inputBookIsComplete').checked;

    const generateID = generatedID();
    const booksobject = generateBookObject(generateID, bookTitle, bookAuthor, parseInt(bookYear), bookIsComplete);
    books.push(booksobject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function generatedID() {
    return +new Date();
};

function generateBookObject(id, title, author, yaer, isComplete) {
    return {
        id,
        title,
        author,
        yaer,
        isComplete
    }
};

const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerHTML = '';

    for (let bookItem of books) {
        let bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) {
            uncompletedBOOKList.append(bookElement);
        } else {
            completedBOOKList.append(bookElement);
        }
    }
});

function makeBook(bookObject) {
    const articleBook = document.createElement('article');
    articleBook.classList.add('book_item');
    articleBook.setAttribute('id', `book-${bookObject.id}`);

    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.yaer;

    const containerAction = document.createElement('div');
    containerAction.classList.add('action');

    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText = "Hapus Buku";
    trashButton.addEventListener('click', function () {
        removeTaskFromCompleted(bookObject.id);
    });

    if (bookObject.isComplete) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = "Belum selesai dibaca";

        undoButton.addEventListener('click', function () {
            undoTaskFromComplete(bookObject.id);
        });

        containerAction.append(undoButton, trashButton);
    } else {
        const finishButton = document.createElement('button');
        finishButton.classList.add('green');
        finishButton.innerText = "Selesai dibaca"

        finishButton.addEventListener('click', function () {
            addTaskToCompleted(bookObject.id)
        });

        containerAction.append(finishButton, trashButton);
    }

    articleBook.append(textTitle, textAuthor, textYear, containerAction);

    return articleBook;
};

function addTaskToCompleted(bookId) {
    const bookTarget = getBookById(bookId)

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function getBookById(bookId) {
    for (const bookIndex of books) {
        if (bookIndex.id === bookId) {
            return bookIndex;
        }
    }
    return null;
};

function undoTaskFromComplete(bookId) {
    const bookTarget = getBookById(bookId)

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function removeTaskFromCompleted(bookId) {
    const bookTarget = getBook(bookId);

    if (bookTarget == -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function getBook(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
};

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'TBookshelf Apps';

function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
};

if (isStorageExist()) {
    loadDataFromStorage();
};

document.getElementById('searchSubmit').addEventListener('click', function (event) {
    event.preventDefault();
    const bookSearch = document.getElementById('searchBookTitle').value.toLowerCase();
    const listBook = document.querySelectorAll('.book_item > h3');
    for (let bookData of listBook) {
        if (bookData.innerText.toLowerCase().includes(bookSearch)) {
            bookData.parentElement.style.display = "block";
        } else {
            bookData.parentElement.style.display = "none";
        }
    }
});