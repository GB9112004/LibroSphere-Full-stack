const API_URL = 'http://localhost:5555/books';

// DOM Elements
const addBookForm = document.getElementById('addBookForm');
const updateBookForm = document.getElementById('updateBookForm');
const searchBookForm = document.getElementById('searchBookForm');
const loadBooksBtn = document.getElementById('loadBooks');
const booksContainer = document.getElementById('booksContainer');
const searchResult = document.getElementById('searchResult');

// Event Listeners
addBookForm.addEventListener('submit', addBook);
updateBookForm.addEventListener('submit', updateBook);
searchBookForm.addEventListener('submit', searchBookById);
loadBooksBtn.addEventListener('click', loadBooks);

// Add a new book
async function addBook(e) {
    e.preventDefault();
    
    const book = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        publishYear: document.getElementById('publishYear').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book)
        });

        if (response.ok) {
            alert('Book added successfully!');
            addBookForm.reset();
            loadBooks();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Search book by ID
async function searchBookById(e) {
    e.preventDefault();
    const id = document.getElementById('searchId').value;
    
    searchResult.innerHTML = '<p class="loading">Searching...</p>';
    
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        
        if (response.ok) {
            displaySearchResult(data);
        } else {
            searchResult.innerHTML = `<p class="error">${data.message || 'Book not found'}</p>`;
        }
    } catch (error) {
        searchResult.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

// Clear search results
function clearSearch() {
    document.getElementById('searchId').value = '';
    searchResult.innerHTML = '';
}

// Display search result
function displaySearchResult(book) {
    searchResult.innerHTML = `
        <div class="book-card">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Year:</strong> ${book.publishYear}</p>
            <p><strong>ID:</strong> ${book._id}</p>
            <button onclick="deleteBook('${book._id}')" class="delete-btn">Delete</button>
        </div>
    `;
}

// Update a book
async function updateBook(e) {
    e.preventDefault();
    
    const id = document.getElementById('updateId').value;
    const updates = {};
    
    if (document.getElementById('updateTitle').value) updates.title = document.getElementById('updateTitle').value;
    if (document.getElementById('updateAuthor').value) updates.author = document.getElementById('updateAuthor').value;
    if (document.getElementById('updateYear').value) updates.publishYear = document.getElementById('updateYear').value;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
        });

        if (response.ok) {
            alert('Book updated successfully!');
            updateBookForm.reset();
            loadBooks();
            clearSearch();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Load all books
async function loadBooks() {
    try {
        booksContainer.innerHTML = '<p class="loading">Loading books...</p>';
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (response.ok) {
            displayBooks(data.data);
        } else {
            booksContainer.innerHTML = `<p class="error">${data.message}</p>`;
        }
    } catch (error) {
        booksContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

// Delete a book
async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
        // Clear search results first
        clearSearch();
        
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message || 'Book deleted successfully!');
            loadBooks(); // Refresh the list
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to delete book');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Display books in the UI
function displayBooks(books) {
    booksContainer.innerHTML = '';
    
    if (books.length === 0) {
        booksContainer.innerHTML = '<p>No books found.</p>';
        return;
    }

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Year:</strong> ${book.publishYear}</p>
            <p><strong>ID:</strong> ${book._id}</p>
            <button onclick="deleteBook('${book._id}')" class="delete-btn">Delete</button>
        `;
        booksContainer.appendChild(bookCard);
    });
}

// Make functions available globally
window.deleteBook = deleteBook;
window.clearSearch = clearSearch;

// Load books when page loads
document.addEventListener('DOMContentLoaded', loadBooks);