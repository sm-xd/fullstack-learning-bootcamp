# Interactive Quiz App

A simple, clean quiz application built with vanilla HTML, CSS, and JavaScript. This project was created as part of a learning bootcamp to practice core web development skills.

## About the Project

This quiz app takes design inspiration from Google Forms. The goal was to create something that feels familiar and intuitive - the kind of interface users already know how to navigate without needing instructions. The clean cards, radio-button style options, and straightforward layout all borrow from that Google Forms aesthetic.

## Features

- **Timed Quiz**: 60 seconds for the entire quiz, displayed prominently at the top
- **Question Navigation**: Previous and Next buttons let you move freely between questions
- **Skip and Return**: No need to answer in order - skip questions and come back later
- **Deselect Answers**: Changed your mind? Click a selected option again to deselect it
- **Progress Tracking**: Visual progress bar shows how far along you are
- **Results Summary**: Score displayed with percentage at the end
- **Answer Review**: Review all questions with correct answers highlighted after submission
- **Responsive Design**: Works on desktop and mobile screens

## Learning Methodology

This project was built step by step, starting with a basic HTML structure and progressively adding features. The approach was:

1. **Start with structure**: Get the HTML semantics right before worrying about styling
2. **Add styling incrementally**: Build the CSS in layers, starting with layout and adding polish
3. **JavaScript last**: Once the interface existed, add interactivity piece by piece
4. **Iterate based on feedback**: Features like the previous button, skip functionality, and answer review were added based on what felt missing during testing

The code includes comments explaining the logic, making it easier to understand what each section does and why.

## Tech Stack

- HTML5 (semantic elements, ARIA attributes for accessibility)
- CSS3 (CSS custom properties, flexbox, responsive design)
- Vanilla JavaScript (DOM manipulation, event handling, timers)

No frameworks or libraries. Just the fundamentals.

## Project Structure

```
interactive-quiz-app/
    index.html      # Main HTML structure
    style.css       # All styling (Google Forms inspired)
    script.js       # Quiz logic and interactivity
    README.md       # This file
```

## How to Run

1. Clone or download the project
2. Open `index.html` in any modern browser
3. Click "Start Quiz" and answer the questions

No build step, no dependencies, no server required.

## Customization

To add your own questions, edit the `quizData` array in `script.js`:

```javascript
const quizData = [
    {
        question: "Your question here?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0  // Index of correct option (0-3)
    },
    // Add more questions...
];
```

To change the timer duration, modify the `timeLeft` variable in `script.js`.

## What I Learned

- How to structure a multi-screen single-page application
- Managing state with JavaScript variables and arrays
- Working with timers using setInterval and clearInterval
- Building accessible interfaces with proper ARIA attributes
- Creating a cohesive design system with CSS custom properties
- The importance of user experience details like navigation and answer review

---

Made by SM
