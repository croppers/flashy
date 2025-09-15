# Gemini Code Assist Project: flashy

This document outlines the development plan for "flashy", an interactive flash card application, with the assistance of Gemini Code Assist.

## Project Overview

**Project Name:** flashy

**Objective:** To create an interactive flash card application that implements a spaced repetition system (SRS) to help users study and learn more effectively.

### Core Features

- **CSV Upload:** Users can upload their own flashcard decks in a `.csv` file format.
- **Interactive Flashcards:** The application will display one side of a flashcard (the "front" or "question") and wait for the user to reveal the other side (the "back" or "answer").
- **Spaced Repetition:** After revealing the answer, the user can rate their recall of the card. Based on this rating, the application will schedule the next time the card should be reviewed.
- **Optional Timer:** An optional 10-second timer will be implemented. If the timer expires before the user reveals the card, the card will automatically be categorized as "Again".

### User Interaction

When a card's answer is revealed, the user will be presented with the following options to rate their performance:

- **Easy:** The user recalled the answer effortlessly.
- **Medium:** The user recalled the answer with some effort.
- **Hard:** The user struggled to recall the answer.
- **Again:** The user did not know the answer. The card should be shown again soon in the current session.

## Progress

- **Initial Implementation:** The basic HTML, CSS, and JavaScript structure of the application has been created.
- **Core Functionality:** The application now includes:
    - A default flashcard deck.
    - Card flipping animation (fixed to prevent premature answer reveal).
    - A simplified SM-2 spaced repetition algorithm.
    - Light/dark mode theme switcher.
    - Deck selection, creation (via CSV upload), and deletion (with protection for the default deck).
    - Rating buttons reordered to Easy, Medium, Hard, Again, with color coding.
    - Display of next review interval for each rating option.
- **Testing:** The application is renderable and functional by opening the `index.html` file in a browser. A `test_deck.csv` file was created to verify CSV upload functionality.

## Next Steps

- **Implement Optional Timer (Revised Functionality):**
    - **Display:** A numerical countdown timer will be displayed in the bottom right corner of the screen.
    - **Control:** A toggle switch will be placed just below the timer in the bottom right corner to activate/deactivate it. The user's preference for the timer (on/off) will be saved in local storage.
    - **Timer Expiration Behavior:**
        1.  Immediately reveal the answer when the timer reaches zero.
        2.  Show a single "Next" button below the answer.
        3.  When the user clicks "Next", the challenging card (for which the timer expired) will be placed immediately after the next card in the deck.
        4.  If the challenging card was the last card in the deck, it will simply be shown again after the user clicks "Next".
    - **Reset:** The timer will reset and start counting down whenever a new card is presented.

## Clarifying Questions for Development
*This section has been updated with the project's technical decisions and new clarifying questions.*

### 1. Technology Stack
**Decision:** The project will be built using Python and the Flask framework for the backend. The frontend will use vanilla JavaScript, HTML, and CSS. Testing will be done with `pytest`.

**Suggested Libraries:**
- **Flask-CORS:** To handle Cross-Origin Resource Sharing, which is necessary if the frontend and backend are served separately.
- **pandas:** A powerful library for data manipulation that will make parsing the uploaded `.csv` files straightforward and robust.

### 2. CSV Format
**Decision:** The `.csv` file will have a simple two-column structure: `question,answer`. No headers are required.

### 3. Spaced Repetition Algorithm
**Decision:** We will implement a simplified version of the **SM-2 algorithm**, which was created for the SuperMemo application. This is a well-regarded algorithm for spaced repetition. We will adapt it to our "Again", "Hard", "Medium", and "Easy" ratings.

### 4. Data Persistence
**Decision:** All user data, including decks and review progress, will be stored in the browser's **Local Storage**. The application will come with a hard-coded default deck.

**Card Data Structure:** Each card object stored in Local Storage will contain the following fields: `question`, `answer`, `next_review_date`, `interval` (the number of days until the next review), and `ease_factor` (a float that determines how quickly the interval grows).

### 5. User Interface (UI)
**Decisions:** The UI will be minimal and clean, with the following features:
- Light/dark mode toggle.
- A dropdown menu to select from available decks.
- An option to upload a new deck (`.csv`) and delete existing decks.
- A default, pre-loaded deck.
- The main view will show a card's question. On user interaction (e.g., a click), the answer is revealed along with the four rating buttons ("Easy", "Medium", "Hard", "Again").
- The card "flip" will be a simple show/hide effect.
- Deck management will be handled via `+` (add) and `-` (remove) buttons.


### 6. User Accounts
**Decision:** This will be a single-user application. No server-side user authentication is needed.