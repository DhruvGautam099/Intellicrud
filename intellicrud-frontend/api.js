const API_BASE = 'http://localhost:8081/api';

const api = {
    // --- Book CRUD ---
    async getBooks() {
        try {
            const res = await fetch(`${API_BASE}/books`);
            if(!res.ok) throw new Error('Network response was not ok');
            return await res.json();
        } catch (e) {
            console.error('Error fetching books:', e);
            return [];
        }
    },

    async getBook(id) {
        try {
            const res = await fetch(`${API_BASE}/books/${id}`);
            return await res.json();
        } catch (e) {
            console.error('Error fetching book:', e);
            return null;
        }
    },

    async createBook(book) {
        try {
            const res = await fetch(`${API_BASE}/books`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book)
            });
            return await res.json();
        } catch (e) {
            console.error('Error creating book:', e);
        }
    },

    async updateBook(id, book) {
        try {
            const res = await fetch(`${API_BASE}/books/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book)
            });
            return await res.json();
        } catch (e) {
            console.error('Error updating book:', e);
        }
    },

    async deleteBook(id) {
        try {
            await fetch(`${API_BASE}/books/${id}`, { method: 'DELETE' });
            return true;
        } catch (e) {
            console.error('Error deleting book:', e);
            return false;
        }
    },

    // --- AI Endpoints ---
    async askAiAboutBook(id) {
        try {
            const res = await fetch(`${API_BASE}/ai/ask/${id}`);
            if(!res.ok) throw new Error('API request failed');
            return await res.json();
        } catch (e) {
            console.error('Error asking AI:', e);
            return { insight: 'Sorry, the AI service is currently unavailable or missing an API key.' };
        }
    },

    async getAiRecommendations() {
        try {
            const res = await fetch(`${API_BASE}/ai/recommendations`);
            if(!res.ok) throw new Error('API request failed');
            return await res.json();
        } catch (e) {
            console.error('Error fetching recommendations:', e);
            return { recommendations: 'Sorry, the AI service is currently unavailable or missing an API key.' };
        }
    }
};
