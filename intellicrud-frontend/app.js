document.addEventListener('DOMContentLoaded', () => {

    // DOM Elements
    const booksTbody = document.getElementById('books-tbody');
    const totalBooksCount = document.getElementById('total-books-count');
    
    // Modal Elements
    const bookModal = document.getElementById('book-modal');
    const bookForm = document.getElementById('book-form');
    const modalTitle = document.getElementById('modal-title');
    const closeBookModalBtn = document.getElementById('close-modal-btn');
    
    // AI Modal Elements
    const aiModal = document.getElementById('ai-modal');
    const aiBookTitle = document.getElementById('ai-book-title');
    const aiInsightContent = document.getElementById('ai-insight-content');
    const closeAiModalBtn = document.getElementById('close-ai-modal-btn');
    
    // AI Dashboard Elements
    const getRecommendationsBtn = document.getElementById('get-recommendations-btn');
    const aiRecommendationsContent = document.getElementById('ai-recommendations-content');

    // State
    let currentBooks = [];

    // --- Core UI Logic ---

    const loadDashboard = async () => {
        currentBooks = await api.getBooks();
        totalBooksCount.textContent = currentBooks.length;
        renderTable();
    };

    const renderTable = () => {
        booksTbody.innerHTML = '';
        if(currentBooks.length === 0) {
            booksTbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No books found. Please add a book.</td></tr>';
            return;
        }

        currentBooks.forEach(book => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${book.title}</strong></td>
                <td>${book.author}</td>
                <td>${book.genre}</td>
                <td>
                    <button class="btn btn-sm btn-ai ask-ai-btn" data-id="${book.id}">✨ Ask AI</button>
                    <button class="btn btn-sm btn-secondary edit-btn" data-id="${book.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${book.id}">Remove</button>
                </td>
            `;
            booksTbody.appendChild(tr);
        });

        attachTableEventListeners();
    };

    const attachTableEventListeners = () => {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => openEditModal(e.target.dataset.id));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => deleteBook(e.target.dataset.id));
        });
        document.querySelectorAll('.ask-ai-btn').forEach(btn => {
            btn.addEventListener('click', (e) => openAiModal(e.target.dataset.id));
        });
    };

    // --- Book CRUD Operations ---

    document.getElementById('add-book-btn').addEventListener('click', () => {
        bookForm.reset();
        document.getElementById('book-id').value = '';
        modalTitle.textContent = 'Add New Book';
        bookModal.classList.remove('hidden');
    });

    closeBookModalBtn.addEventListener('click', () => {
        bookModal.classList.add('hidden');
    });

    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('book-id').value;
        const bookData = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            genre: document.getElementById('genre').value,
            description: document.getElementById('description').value
        };

        const saveBtn = document.getElementById('save-book-btn');
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;

        if (id) {
            await api.updateBook(id, bookData);
        } else {
            await api.createBook(bookData);
        }

        saveBtn.textContent = 'Save Book';
        saveBtn.disabled = false;
        bookModal.classList.add('hidden');
        loadDashboard();
    });

    const openEditModal = async (id) => {
        const book = await api.getBook(id);
        if(book) {
            document.getElementById('book-id').value = book.id;
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;
            document.getElementById('genre').value = book.genre;
            document.getElementById('description').value = book.description;
            modalTitle.textContent = 'Edit Book';
            bookModal.classList.remove('hidden');
        }
    };

    const deleteBook = async (id) => {
        if(confirm('Are you sure you want to remove this book from the library?')) {
            await api.deleteBook(id);
            loadDashboard();
        }
    };

    // --- AI Integration ---

    closeAiModalBtn.addEventListener('click', () => {
        aiModal.classList.add('hidden');
    });

    const openAiModal = async (id) => {
        const book = currentBooks.find(b => b.id === id);
        if(!book) return;

        aiBookTitle.textContent = `Insights on "${book.title}"`;
        aiInsightContent.innerHTML = '<div class="loader"></div>';
        aiModal.classList.remove('hidden');

        const response = await api.askAiAboutBook(id);
        // Simple markdown replacement for bold text just in case Gemini sends it
        const formattedText = response.insight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        aiInsightContent.innerHTML = `<p>${formattedText}</p>`;
    };

    getRecommendationsBtn.addEventListener('click', async () => {
        getRecommendationsBtn.textContent = 'Fetching...';
        getRecommendationsBtn.disabled = true;
        aiRecommendationsContent.innerHTML = '<div class="loader" style="margin: 1rem auto; width: 20px; height: 20px;"></div>';

        const response = await api.getAiRecommendations();
        // Convert newlines to breaks and asterisks to bold
        let formattedRecs = response.recommendations
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
            
        aiRecommendationsContent.innerHTML = `<p>${formattedRecs}</p>`;

        getRecommendationsBtn.textContent = 'Refresh Picks';
        getRecommendationsBtn.disabled = false;
    });

    // Init
    loadDashboard();
});
