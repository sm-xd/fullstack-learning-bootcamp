/**
 * Quiz Data Module
 * Contains all quiz questions and answers
 */

export const quizData = [
    {
        question: "What does REST stand for in RESTful APIs?",
        options: [
            "Remote Execution Standard Transfer",
            "Representational State Transfer",
            "Reliable Service Transport",
            "Recursive State Technology"
        ],
        correctAnswer: 1
    },
    {
        question: "Which HTTP status code represents 'Unauthorized'?",
        options: ["200", "401", "403", "500"],
        correctAnswer: 1
    },
    {
        question: "In JavaScript, which method converts a JSON string into an object?",
        options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"],
        correctAnswer: 0
    },
    {
        question: "What is the time complexity of binary search on a sorted array?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correctAnswer: 1
    },
    {
        question: "Which Git command is used to combine changes from another branch into the current branch?",
        options: ["git push", "git merge", "git clone", "git init"],
        correctAnswer: 1
    },
    {
        question: "Which SQL clause is used to filter aggregated results?",
        options: ["WHERE", "GROUP BY", "HAVING", "ORDER BY"],
        correctAnswer: 2
    },
    {
        question: "In CSS Flexbox, which property controls alignment along the main axis?",
        options: ["align-items", "justify-content", "flex-wrap", "align-content"],
        correctAnswer: 1
    },
    {
        question: "Which data structure uses LIFO (Last In First Out)?",
        options: ["Queue", "Stack", "Heap", "Graph"],
        correctAnswer: 1
    },
    {
        question: "What is the default port for HTTPS?",
        options: ["21", "80", "443", "3306"],
        correctAnswer: 2
    },
    {
        question: "Which JavaScript feature allows handling asynchronous operations using cleaner syntax than promises?",
        options: ["Callbacks", "Generators", "Async/Await", "Closures"],
        correctAnswer: 2
    }
];

/**
 * Get the total number of questions
 * @returns {number} Total question count
 */
export function getQuestionCount() {
    return quizData.length;
}

/**
 * Get a specific question by index
 * @param {number} index - Question index
 * @returns {Object|null} Question object or null if not found
 */
export function getQuestion(index) {
    if (index >= 0 && index < quizData.length) {
        return quizData[index];
    }
    return null;
}

/**
 * Check if an answer is correct
 * @param {number} questionIndex - Question index
 * @param {number} answerIndex - Selected answer index
 * @returns {boolean} True if answer is correct
 */
export function isCorrectAnswer(questionIndex, answerIndex) {
    const question = getQuestion(questionIndex);
    if (question) {
        return question.correctAnswer === answerIndex;
    }
    return false;
}
