/**
 * Quiz Module
 * Handles quiz state and logic
 */

import { quizData, getQuestionCount, getQuestion, isCorrectAnswer } from '../data/quizData.js';
import { createFilledArray, calculatePercentage, getResultMessage } from '../utils/helpers.js';
import * as UI from './ui.js';
import * as Timer from './timer.js';
import { renderReview } from './review.js';

// Quiz state
let state = {
    currentQuestionIndex: 0,
    score: 0,
    selectedAnswer: null,
    isQuizComplete: false,
    userAnswers: []
};

/**
 * Initialize the quiz state
 */
export function initQuizState() {
    state = {
        currentQuestionIndex: 0,
        score: 0,
        selectedAnswer: null,
        isQuizComplete: false,
        userAnswers: createFilledArray(getQuestionCount(), null)
    };
}

/**
 * Get current quiz state
 * @returns {Object} Current state
 */
export function getState() {
    return { ...state };
}

/**
 * Start the quiz
 */
export function startQuiz() {
    initQuizState();
    
    UI.hideStartScreen();
    UI.showQuizScreen();
    UI.hideResultsScreen();
    UI.hideReviewSection();
    
    Timer.startTimer(60);
    
    displayQuestion();
    loadQuestionPanel();
}

/**
 * Load the question panel
 */
export function loadQuestionPanel() {
    const elements = UI.getElements();
    const questionPanel = elements.questionPanel;
    
    if (!questionPanel) return;
    
    questionPanel.innerHTML = '';
    
    const header = document.createElement('h3');
    header.textContent = 'Question Index';
    header.addEventListener('click', () => {
        if (window.innerWidth <= 640) {
            UI.closeMobilePanel();
        }
    });
    questionPanel.appendChild(header);
    
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'question-panel-items';
    
    const totalQuestions = getQuestionCount();
    for (let i = 0; i < totalQuestions; i++) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-panel-item';
        questionDiv.id = `question-panel-item-${i}`;
        questionDiv.textContent = `Question ${i + 1}`;
        questionDiv.addEventListener('click', () => {
            navigateToQuestion(i);
            if (window.innerWidth <= 640) {
                UI.closeMobilePanel();
            }
        });
        itemsContainer.appendChild(questionDiv);
    }
    
    questionPanel.appendChild(itemsContainer);
    updateQuestionPanelStatus();
}

/**
 * Update question panel status indicators
 */
export function updateQuestionPanelStatus() {
    const totalQuestions = getQuestionCount();
    
    for (let i = 0; i < totalQuestions; i++) {
        const panelItem = document.getElementById(`question-panel-item-${i}`);
        if (panelItem) {
            panelItem.classList.remove('answered', 'current');
            
            if (state.userAnswers[i] !== null) {
                panelItem.classList.add('answered');
            }
            
            if (i === state.currentQuestionIndex) {
                panelItem.classList.add('current');
            }
        }
    }
}

/**
 * Display current question
 */
export function displayQuestion() {
    const question = getQuestion(state.currentQuestionIndex);
    if (!question) return;
    
    const totalQuestions = getQuestionCount();
    
    UI.displayQuestionText(question.question);
    UI.updateProgress(state.currentQuestionIndex + 1, totalQuestions);
    UI.updateNavButtons(state.currentQuestionIndex, totalQuestions);
    
    state.selectedAnswer = state.userAnswers[state.currentQuestionIndex];
    
    UI.renderOptions(question.options, state.selectedAnswer, selectAnswer);
    
    updateQuestionPanelStatus();
}

/**
 * Select an answer
 * @param {number} selectedIndex - Selected option index
 */
export function selectAnswer(selectedIndex) {
    if (state.selectedAnswer === selectedIndex) {
        // Deselect if clicking same answer
        state.selectedAnswer = null;
        state.userAnswers[state.currentQuestionIndex] = null;
    } else {
        state.selectedAnswer = selectedIndex;
        state.userAnswers[state.currentQuestionIndex] = selectedIndex;
    }
    
    UI.updateOptionSelection(state.selectedAnswer);
    updateQuestionPanelStatus();
}

/**
 * Navigate to a specific question
 * @param {number} index - Question index
 */
export function navigateToQuestion(index) {
    if (index >= 0 && index < getQuestionCount()) {
        state.currentQuestionIndex = index;
        displayQuestion();
    }
}

/**
 * Go to next question or submit quiz
 */
export function nextQuestion() {
    state.currentQuestionIndex++;
    
    if (state.currentQuestionIndex < getQuestionCount()) {
        displayQuestion();
    } else {
        showResults();
    }
}

/**
 * Go to previous question
 */
export function prevQuestion() {
    if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;
        displayQuestion();
    }
}

/**
 * Calculate and return the final score
 * @returns {number} Final score
 */
export function calculateScore() {
    let score = 0;
    const totalQuestions = getQuestionCount();
    
    for (let i = 0; i < totalQuestions; i++) {
        if (isCorrectAnswer(i, state.userAnswers[i])) {
            score++;
        }
    }
    
    return score;
}

/**
 * Show results screen
 */
export function showResults() {
    state.isQuizComplete = true;
    Timer.stopTimer();
    
    UI.hideQuizScreen();
    UI.showResultsScreen();
    
    state.score = calculateScore();
    const totalQuestions = getQuestionCount();
    const percentage = calculatePercentage(state.score, totalQuestions);
    
    UI.displayFinalScore(state.score, totalQuestions, percentage);
    UI.displayResultMessage(getResultMessage(percentage));
}

/**
 * Toggle review section
 */
export function toggleReview() {
    if (UI.isReviewSectionVisible()) {
        UI.hideReviewSection();
    } else {
        UI.showReviewSection();
        renderReview(quizData, state.userAnswers, UI.getReviewContainer());
    }
}

/**
 * Restart the quiz
 */
export function restartQuiz() {
    UI.hideResultsScreen();
    UI.hideReviewSection();
    startQuiz();
}

/**
 * Handle time up event
 */
export function handleTimeUp() {
    showResults();
}

// Export state for testing
export const _testExports = {
    setState: (newState) => { state = { ...state, ...newState }; },
    getInternalState: () => state
};
