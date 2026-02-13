# Modularised Quiz App

A modular interactive quiz application built with vanilla JavaScript using ES6 modules.

## Project Structure

```
modularised quiz app/
├── index.html              # Main HTML file
├── script.js               # Entry point - initializes app
├── style.css               # Styles
├── package.json            # NPM configuration
├── jest.config.js          # Jest test configuration
├── src/
│   ├── data/
│   │   └── quizData.js     # Quiz questions and data functions
│   ├── modules/
│   │   ├── quiz.js         # Quiz state and logic
│   │   ├── timer.js        # Timer functionality
│   │   ├── ui.js           # DOM manipulation
│   │   └── review.js       # Review section rendering
│   └── utils/
│       └── helpers.js      # Utility functions
└── tests/
    ├── quizData.test.js    # Tests for quiz data module
    ├── helpers.test.js     # Tests for helper functions
    ├── timer.test.js       # Tests for timer module
    ├── review.test.js      # Tests for review module
    └── quiz.test.js        # Tests for quiz logic
```

## Modules Overview

### src/data/quizData.js
Contains quiz questions and helper functions:
- `quizData` - Array of quiz questions
- `getQuestionCount()` - Returns total number of questions
- `getQuestion(index)` - Returns question by index
- `isCorrectAnswer(questionIndex, answerIndex)` - Checks if answer is correct

### src/modules/quiz.js
Manages quiz state and main logic:
- `initQuizState()` - Initialize/reset quiz state
- `startQuiz()` - Start the quiz
- `displayQuestion()` - Display current question
- `selectAnswer(index)` - Handle answer selection
- `nextQuestion()` / `prevQuestion()` - Navigation
- `calculateScore()` - Calculate final score
- `showResults()` - Display results screen

### src/modules/timer.js
Handles quiz timer:
- `initTimer(displayElement, onTimeUp)` - Initialize timer
- `startTimer(initialTime)` - Start countdown
- `stopTimer()` - Stop countdown
- `getTimeLeft()` - Get remaining time
- `resetTimer()` - Reset to default

### src/modules/ui.js
Handles all DOM manipulation:
- `initUI()` - Initialize and cache DOM elements
- Screen visibility functions (show/hide screens)
- `renderOptions()` - Render question options
- `updateProgress()` - Update progress indicator
- Mobile panel controls

### src/modules/review.js
Renders answer review:
- `renderReview(quizData, userAnswers, container)` - Render full review
- `createReviewItem(question, index, userAnswer)` - Create single review item
- `getReviewStatus(userAnswer, correctAnswer)` - Get status info

### src/utils/helpers.js
Utility functions:
- `shuffleArray(array)` - Fisher-Yates shuffle
- `calculatePercentage(value, total)` - Calculate percentage
- `getResultMessage(percentage)` - Get result message
- `formatTime(seconds)` - Format time for display
- `createFilledArray(length, value)` - Create filled array

## Installation

```bash
npm install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Usage

Open `index.html` in a browser to run the quiz application. Since the app uses ES6 modules, you need to serve it via a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve

# Using VS Code Live Server extension
# Right-click index.html -> Open with Live Server
```

## Features

- 10 quiz questions on various tech topics
- 60-second timer with visual warnings
- Question navigation panel
- Mobile-responsive design
- Answer review with correct/incorrect indicators
- Score percentage and feedback messages
