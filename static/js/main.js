document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const flashcard = document.querySelector('.flashcard');
    const revealAnswerBtn = document.getElementById('reveal-answer');
    const ratingButtons = document.getElementById('rating-buttons');
    const questionEl = document.getElementById('question');
    const answerEl = document.getElementById('answer');
    const deckSelect = document.getElementById('deck-select');
    const addDeckBtn = document.getElementById('add-deck');
    const deleteDeckBtn = document.getElementById('delete-deck');
    const csvUpload = document.getElementById('csv-upload');

    let currentCardIndex = 0;
    let decks = {};
    let currentDeck;

    // --- Theme Switcher ---
    themeToggle.addEventListener('change', () => {
        body.classList.toggle('dark-mode');
    });

    // --- Card Flip ---
    flashcard.addEventListener('click', () => {
        flashcard.classList.toggle('is-flipped');
    });

    revealAnswerBtn.addEventListener('click', () => {
        flashcard.classList.add('is-flipped');
        revealAnswerBtn.style.display = 'none';
        ratingButtons.style.display = 'block';
        updateIntervalDisplays();
    });

    // --- Deck Management ---
    const defaultDeck = {
        "name": "Default",
        "cards": [
            { "question": "What is the capital of France?", "answer": "Paris" },
            { "question": "What is 2 + 2?", "answer": "4" },
            { "question": "What is the powerhouse of the cell?", "answer": "Mitochondria" }
        ]
    };

    function initializeDecks() {
        const storedDecks = localStorage.getItem('flashyDecks');
        if (storedDecks) {
            decks = JSON.parse(storedDecks);
        } else {
            decks = { "Default": defaultDeck };
        }

        // Initialize SRS fields for all cards
        for (const deckName in decks) {
            decks[deckName].cards.forEach(card => {
                if (card.next_review_date === undefined) {
                    card.next_review_date = new Date().toISOString();
                    card.interval = 0;
                    card.ease_factor = 2.5;
                }
            });
        }
        localStorage.setItem('flashyDecks', JSON.stringify(decks));
        updateDeckSelector();
        loadDeck(Object.keys(decks)[0]);
    }

    function updateDeckSelector() {
        deckSelect.innerHTML = '';
        for (const deckName in decks) {
            const option = document.createElement('option');
            option.value = deckName;
            option.textContent = deckName;
            deckSelect.appendChild(option);
        }
    }

    function loadDeck(deckName) {
        if (decks[deckName]) {
            currentDeck = decks[deckName];
            currentCardIndex = getNextCard();
            displayCard();
        }
    }

    function displayCard() {
        if (flashcard.classList.contains('is-flipped')) {
            flashcard.classList.remove('is-flipped');
        }
        setTimeout(() => {
            if (currentCardIndex !== -1) {
                const card = currentDeck.cards[currentCardIndex];
                questionEl.textContent = card.question;
                answerEl.textContent = card.answer;
                revealAnswerBtn.style.display = 'block';
                ratingButtons.style.display = 'none';
            } else {
                questionEl.textContent = "No cards due for review in this deck!";
                answerEl.textContent = "";
                revealAnswerBtn.style.display = 'none';
                ratingButtons.style.display = 'none';
            }
        }, 250); // Wait for the flip animation to finish
    }

    deckSelect.addEventListener('change', () => {
        loadDeck(deckSelect.value);
    });

    addDeckBtn.addEventListener('click', () => {
        csvUpload.click();
    });

    csvUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const csv = event.target.result;
                const deckName = file.name.replace(/\.csv$/, '');
                const newDeck = parseCSV(csv, deckName);
                if (newDeck) {
                    decks[newDeck.name] = newDeck;
                    localStorage.setItem('flashyDecks', JSON.stringify(decks));
                    updateDeckSelector();
                    deckSelect.value = newDeck.name;
                    loadDeck(newDeck.name);
                }
            };
            reader.readAsText(file);
        }
    });

    function parseCSV(csv, deckName) {
        const lines = csv.split('\n');
        const cards = [];
        lines.forEach(line => {
            const parts = line.split(',');
            if (parts.length === 2) {
                cards.push({
                    question: parts[0].trim(),
                    answer: parts[1].trim(),
                    next_review_date: new Date().toISOString(),
                    interval: 0,
                    ease_factor: 2.5
                });
            }
        });
        return { name: deckName, cards: cards };
    }

    deleteDeckBtn.addEventListener('click', () => {
        const selectedDeck = deckSelect.value;
        if (selectedDeck === 'Default') {
            alert('The default deck cannot be deleted.');
            return;
        }
        if (selectedDeck) {
            if (confirm(`Are you sure you want to delete the "${selectedDeck}" deck?`)) {
                delete decks[selectedDeck];
                localStorage.setItem('flashyDecks', JSON.stringify(decks));
                updateDeckSelector();
                loadDeck(Object.keys(decks)[0]);
            }
        }
    });

    function getNextCard() {
        const now = new Date().toISOString();
        if (!currentDeck) return -1;
        const dueCards = currentDeck.cards.filter(card => card.next_review_date <= now);
        if (dueCards.length > 0) {
            // find the index of the first due card in the original array
            return currentDeck.cards.indexOf(dueCards[0]);
        } else {
            return -1; // No cards due
        }
    }

    function calculateNextInterval(card, rating) {
        let newInterval = card.interval;
        let newEaseFactor = card.ease_factor;

        let quality = 0;
        switch (rating) {
            case 'again': quality = 0; break;
            case 'hard': quality = 1; break;
            case 'medium': quality = 2; break;
            case 'easy': quality = 3; break;
        }

        if (quality < 2) { // Again or Hard
            newInterval = 0;
        } else { // Medium or Easy
            if (newInterval === 0) {
                newInterval = 1;
            } else if (newInterval === 1) {
                newInterval = 6;
            } else {
                newInterval = Math.round(newInterval * newEaseFactor);
            }
        }

        newEaseFactor = newEaseFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
        if (newEaseFactor < 1.3) {
            newEaseFactor = 1.3;
        }
        return newInterval;
    }

    function formatInterval(days) {
        if (days === 0) return "<1m";
        if (days < 1) return `${Math.round(days * 24 * 60)}m`;
        if (days < 30) return `${Math.round(days)}d`;
        return `${Math.round(days / 30)}mo`;
    }

    function updateIntervalDisplays() {
        if (currentCardIndex === -1) return;
        const card = currentDeck.cards[currentCardIndex];
        ratingButtons.querySelectorAll('button').forEach(button => {
            const rating = button.dataset.rating;
            const intervalSpan = button.querySelector('.interval');
            if (intervalSpan) {
                const nextInterval = calculateNextInterval(card, rating);
                intervalSpan.textContent = ` (${formatInterval(nextInterval)})`;
            }
        });
    }

    function updateCard(rating) {
        const card = currentDeck.cards[currentCardIndex];
        let quality = 0;
        switch (rating) {
            case 'again':
                quality = 0;
                break;
            case 'hard':
                quality = 1;
                break;
            case 'medium':
                quality = 2;
                break;
            case 'easy':
                quality = 3;
                break;
        }

        if (quality < 2) { // Again or Hard
            card.interval = 0;
        } else { // Medium or Easy
            if (card.interval === 0) {
                card.interval = 1;
            } else if (card.interval === 1) {
                card.interval = 6;
            } else {
                card.interval = Math.round(card.interval * card.ease_factor);
            }
        }

        card.ease_factor = card.ease_factor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
        if (card.ease_factor < 1.3) {
            card.ease_factor = 1.3;
        }

        const now = new Date();
        now.setDate(now.getDate() + card.interval);
        card.next_review_date = now.toISOString();

        localStorage.setItem('flashyDecks', JSON.stringify(decks));
    }

    ratingButtons.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const rating = e.target.dataset.rating;
            updateCard(rating);
            currentCardIndex = getNextCard();
            displayCard();
        }
    });

    initializeDecks();
});