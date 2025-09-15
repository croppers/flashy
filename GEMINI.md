# Gemini Code Assist Project: flashy

This document outlines the development plan for "flashy", an interactive flash card application, with the assistance of Gemini Code Assist.

## Project Overview

**Project Name:** flashy

**Objective:** To create an interactive flash card application that implements a spaced repetition system (SRS) to help users study and learn more effectively.

### Core Features

- **CSV Upload:** Users can upload their own flashcard decks in a `.csv` file format.
- **Interactive Flashcards:** The application will display one side of a flashcard (the "front" or "question") and wait for the user to reveal the other side (the "back" or "answer").
- **Spaced Repetition:** After revealing the answer, the user can rate their recall of the card. Based on this rating, the application will schedule the next time the card should be reviewed.

### User Interaction

When a card's answer is revealed, the user will be presented with the following options to rate their performance:

- **Again:** The user did not know the answer. The card should be shown again soon in the current session.
- **Hard:** The user struggled to recall the answer.
- **Medium:** The user recalled the answer with some effort.
- **Easy:** The user recalled the answer effortlessly.

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
- The main view will show a card's question. On user interaction (e.g., a click), the answer is revealed along with the four rating buttons ("Again", "Hard", "Medium", "Easy").

- The main view will show a card's question. On user interaction (e.g., a click), the answer is revealed along with the four rating buttons ("Again", "Hard", "Medium", "Easy").
- The card "flip" will be a simple show/hide effect.
- Deck management will be handled via `+` (add) and `-` (remove) buttons.


### 6. User Accounts
**Decision:** This will be a single-user application. No server-side user authentication is needed.

I'm ready to move on to the next phase. Let me know how you'd like to proceed!
