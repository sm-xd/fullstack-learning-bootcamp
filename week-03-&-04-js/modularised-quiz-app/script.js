/**
 * Main Entry Point
 * Initializes the quiz application and sets up event listeners
 */

import * as UI from './src/modules/ui.js';
import * as Quiz from './src/modules/quiz.js';
import * as Timer from './src/modules/timer.js';

/**
 * Initialize the application
 */
function initApp() {
    // Initialize UI module and get DOM elements
    const elements = UI.initUI();
    
    // Initialize timer with callback
    Timer.initTimer(elements.timerDisplay, Quiz.handleTimeUp);
    
    // Set up event listeners
    setupEventListeners(elements);
}

/**
 * Set up all event listeners
 * @param {Object} elements - DOM elements
 */
function setupEventListeners(elements) {
    // Start button
    if (elements.startButton) {
        elements.startButton.addEventListener('click', Quiz.startQuiz);
    }
    
    // Navigation buttons
    if (elements.nextButton) {
        elements.nextButton.addEventListener('click', Quiz.nextQuestion);
    }
    
    if (elements.prevButton) {
        elements.prevButton.addEventListener('click', Quiz.prevQuestion);
    }
    
    // Results buttons
    if (elements.restartButton) {
        elements.restartButton.addEventListener('click', Quiz.restartQuiz);
    }
    
    if (elements.reviewButton) {
        elements.reviewButton.addEventListener('click', Quiz.toggleReview);
    }
    
    // Mobile panel controls
    if (elements.questionPanelToggle) {
        elements.questionPanelToggle.addEventListener('click', UI.openMobilePanel);
    }
    
    if (elements.mobileOverlay) {
        elements.mobileOverlay.addEventListener('click', UI.closeMobilePanel);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
