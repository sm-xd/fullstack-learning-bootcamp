# Tests Documentation - Modularised Quiz App

## Folder Structure

```
modularised quiz app/
├── index.html                  # Main HTML file
├── script.js                   # Entry point - initializes app
├── style.css                   # Styles
├── package.json                # NPM configuration with Jest
├── jest.config.js              # Jest test configuration
├── README.md                   # Project documentation
├── src/
│   ├── data/
│   │   └── quizData.js         # Quiz questions and data functions
│   ├── modules/
│   │   ├── quiz.js             # Quiz state and logic
│   │   ├── timer.js            # Timer functionality
│   │   ├── ui.js               # DOM manipulation
│   │   └── review.js           # Review section rendering
│   └── utils/
│       └── helpers.js          # Utility functions
└── tests/
    ├── quizData.test.js        # Tests for quiz data module
    ├── helpers.test.js         # Tests for helper functions
    ├── timer.test.js           # Tests for timer module
    ├── review.test.js          # Tests for review module
    └── quiz.test.js            # Tests for quiz logic
```

---

## Test Suites Overview

| Test File | Module Tested | Total Tests |
|-----------|---------------|-------------|
| quizData.test.js | src/data/quizData.js | 14 |
| helpers.test.js | src/utils/helpers.js | 21 |
| timer.test.js | src/modules/timer.js | 14 |
| review.test.js | src/modules/review.js | 17 |
| quiz.test.js | Quiz logic (integration) | 12 |
| **Total** | | **78** |

---

## Detailed Test List

### 1. quizData.test.js

Tests for the quiz data module (`src/data/quizData.js`)

#### quizData array
| # | Test Name | Description |
|---|-----------|-------------|
| 1 | should contain quiz questions | Verifies quizData is a non-empty array |
| 2 | each question should have required properties | Checks question, options, correctAnswer exist |
| 3 | each question should have 4 options | Validates all questions have exactly 4 options |
| 4 | correctAnswer should be a valid index | Ensures correctAnswer is within options bounds |

#### getQuestionCount()
| # | Test Name | Description |
|---|-----------|-------------|
| 5 | should return the total number of questions | Returns correct count |
| 6 | should return a positive number | Count is greater than 0 |

#### getQuestion()
| # | Test Name | Description |
|---|-----------|-------------|
| 7 | should return question at valid index | Returns correct question object |
| 8 | should return null for negative index | Handles -1 gracefully |
| 9 | should return null for out of bounds index | Handles index >= length |
| 10 | should return correct question for each valid index | All indices return correct questions |

#### isCorrectAnswer()
| # | Test Name | Description |
|---|-----------|-------------|
| 11 | should return true for correct answer | Validates correct answers |
| 12 | should return false for incorrect answer | Rejects wrong answers |
| 13 | should return false for invalid question index | Handles invalid indices |
| 14 | should return false for null answer | Handles null input |

---

### 2. helpers.test.js

Tests for the helpers module (`src/utils/helpers.js`)

#### shuffleArray()
| # | Test Name | Description |
|---|-----------|-------------|
| 1 | should return an array of the same length | Length preserved |
| 2 | should contain the same elements | All elements present |
| 3 | should not modify the original array | Original unchanged |
| 4 | should return a new array | Returns different reference |
| 5 | should handle empty array | Empty array returns empty |
| 6 | should handle single element array | Single element unchanged |

#### calculatePercentage()
| # | Test Name | Description |
|---|-----------|-------------|
| 7 | should calculate percentage correctly | 50/100 = 50%, 1/4 = 25% |
| 8 | should return 100 for full score | 10/10 = 100% |
| 9 | should return 0 for zero score | 0/10 = 0% |
| 10 | should return 0 when total is 0 | Handles division by zero |
| 11 | should round to nearest integer | 1/3 = 33%, 2/3 = 67% |

#### getResultMessage()
| # | Test Name | Description |
|---|-----------|-------------|
| 12 | should return excellent message for 80% or higher | 80, 90, 100 |
| 13 | should return good message for 60-79% | 60, 70, 79 |
| 14 | should return not bad message for 40-59% | 40, 50, 59 |
| 15 | should return keep practicing message for below 40% | 0, 20, 39 |

#### formatTime()
| # | Test Name | Description |
|---|-----------|-------------|
| 16 | should format time correctly | "Time Left: 60s" |
| 17 | should handle single digit seconds | "Time Left: 5s" |

#### createFilledArray()
| # | Test Name | Description |
|---|-----------|-------------|
| 18 | should create array with specified length | Length = 5 |
| 19 | should fill array with specified value | [null, null, null] |
| 20 | should work with different values | [0, 0], ['test', 'test', 'test'] |
| 21 | should handle zero length | Returns [] |

---

### 3. timer.test.js

Tests for the timer module (`src/modules/timer.js`)

#### initTimer()
| # | Test Name | Description |
|---|-----------|-------------|
| 1 | should initialize timer with display element and callback | No errors thrown |

#### startTimer()
| # | Test Name | Description |
|---|-----------|-------------|
| 2 | should set initial time | timeLeft = 60 |
| 3 | should use default time when no argument provided | Default 60 seconds |
| 4 | should decrement time every second | 60 -> 59 -> 58 |
| 5 | should call onTimeUp when time reaches 0 | Callback invoked |
| 6 | should stop timer when time reaches 0 | Doesn't go negative |

#### stopTimer()
| # | Test Name | Description |
|---|-----------|-------------|
| 7 | should stop the countdown | Time stops changing |

#### getTimeLeft()
| # | Test Name | Description |
|---|-----------|-------------|
| 8 | should return remaining time | Returns current timeLeft |

#### resetTimer()
| # | Test Name | Description |
|---|-----------|-------------|
| 9 | should reset time to default | Resets to 60 |
| 10 | should stop the timer | Timer stops running |

#### updateTimerDisplay()
| # | Test Name | Description |
|---|-----------|-------------|
| 11 | should update display text | "Time Left: 45s" |
| 12 | should add warning class when time is low | <= 10 seconds |
| 13 | should add danger class when time is very low | <= 5 seconds |

#### threshold constants
| # | Test Name | Description |
|---|-----------|-------------|
| 14 | should have correct threshold values | DEFAULT=60, WARNING=10, DANGER=5 |

---

### 4. review.test.js

Tests for the review module (`src/modules/review.js`)

#### getReviewStatus()
| # | Test Name | Description |
|---|-----------|-------------|
| 1 | should return correct status for correct answer | isCorrect=true, statusClass='correct' |
| 2 | should return wrong status for incorrect answer | isCorrect=false, statusClass='wrong' |
| 3 | should return skipped status for unanswered | isUnanswered=true, statusClass='skipped' |

#### createReviewItem()
| # | Test Name | Description |
|---|-----------|-------------|
| 4 | should create review item for correct answer | Has 'correct-answer' class |
| 5 | should create review item for wrong answer | Has 'wrong-answer' class |
| 6 | should create review item for unanswered | Has 'unanswered' class |
| 7 | should contain question header | Contains Q1, question text |
| 8 | should contain all options | 4 review-option elements |
| 9 | should mark correct option | Has 'correct' class |
| 10 | should mark user wrong answer | Has 'user-wrong' class |
| 11 | should mark user correct answer | Has 'user-correct' class |

#### renderReview()
| # | Test Name | Description |
|---|-----------|-------------|
| 12 | should render all questions | Creates 2 review items |
| 13 | should clear container before rendering | Old content removed |
| 14 | should handle null container | No error thrown |
| 15 | should handle empty quiz data | 0 items created |
| 16 | should render mixed results correctly | Correct + wrong items |

---

### 5. quiz.test.js

Tests for quiz logic (integration tests)

#### quiz state management
| # | Test Name | Description |
|---|-----------|-------------|
| 1 | should create initial state with null answers | All answers null |
| 2 | should track answer selection | userAnswers[0] = 2 |
| 3 | should allow deselecting answer | Can set back to null |

#### score calculation
| # | Test Name | Description |
|---|-----------|-------------|
| 4 | should return 0 when no answers given | Score = 0 |
| 5 | should count correct answers | 3 correct = score 3 |
| 6 | should not count wrong answers | Wrong answers = 0 |
| 7 | should calculate full score | All correct = max score |

#### results calculation
| # | Test Name | Description |
|---|-----------|-------------|
| 8 | should calculate percentage correctly | 7/10 = 70% |
| 9 | should return appropriate message for score | Message matches percentage |

#### navigation logic
| # | Test Name | Description |
|---|-----------|-------------|
| 10 | should track current question index | Index updates correctly |
| 11 | should identify last question | isLast = true |
| 12 | should identify first question | isFirst = true |
| 13 | should validate question bounds | Valid/invalid indices |

---

## Running Tests

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Configuration

Jest is configured in `jest.config.js`:
- Test environment: jsdom (for DOM testing)
- Test location: `tests/**/*.test.js`
- ES modules support enabled via `--experimental-vm-modules`
