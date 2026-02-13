/**
 * UI Module
 * Handles all DOM manipulation and UI updates
 */

// DOM Elements cache
let elements = {};

/**
 * Initialize UI module with DOM elements
 */
export function initUI() {
    elements = {
        startScreen: document.getElementById('start-screen'),
        quizScreen: document.getElementById('quiz-screen'),
        resultsScreen: document.getElementById('results-screen'),
        startButton: document.getElementById('start-quiz-btn'),
        questionText: document.getElementById('question-text'),
        optionsContainer: document.getElementById('options-container'),
        nextButton: document.getElementById('next-question-btn'),
        prevButton: document.getElementById('prev-question-btn'),
        restartButton: document.getElementById('restart-quiz-btn'),
        reviewButton: document.getElementById('review-btn'),
        reviewSection: document.getElementById('review-section'),
        reviewContainer: document.getElementById('review-container'),
        timerDisplay: document.getElementById('timer'),
        progressText: document.getElementById('progress-text'),
        questionPanel: document.getElementById('questions-panel'),
        questionPanelToggle: document.getElementById('question-panel-toggle'),
        mobileOverlay: document.getElementById('mobile-overlay'),
        finalScoreText: document.getElementById('final-score')
    };
    
    return elements;
}

/**
 * Get DOM elements
 * @returns {Object} DOM elements object
 */
export function getElements() {
    return elements;
}

/**
 * Show start screen
 */
export function showStartScreen() {
    if (elements.startScreen) {
        elements.startScreen.classList.remove('hidden');
    }
    hideQuizScreen();
    hideResultsScreen();
}

/**
 * Hide start screen
 */
export function hideStartScreen() {
    if (elements.startScreen) {
        elements.startScreen.classList.add('hidden');
    }
}

/**
 * Show quiz screen
 */
export function showQuizScreen() {
    if (elements.quizScreen) {
        elements.quizScreen.removeAttribute('hidden');
        elements.quizScreen.classList.remove('hidden');
        elements.quizScreen.classList.add('active');
    }
}

/**
 * Hide quiz screen
 */
export function hideQuizScreen() {
    if (elements.quizScreen) {
        elements.quizScreen.setAttribute('hidden', '');
        elements.quizScreen.classList.add('hidden');
        elements.quizScreen.classList.remove('active');
    }
}

/**
 * Show results screen
 */
export function showResultsScreen() {
    if (elements.resultsScreen) {
        elements.resultsScreen.removeAttribute('hidden');
        elements.resultsScreen.classList.remove('hidden');
    }
}

/**
 * Hide results screen
 */
export function hideResultsScreen() {
    if (elements.resultsScreen) {
        elements.resultsScreen.setAttribute('hidden', '');
        elements.resultsScreen.classList.add('hidden');
    }
}

/**
 * Update progress text
 * @param {number} current - Current question number
 * @param {number} total - Total questions
 */
export function updateProgress(current, total) {
    if (elements.progressText) {
        elements.progressText.textContent = `Question ${current} of ${total}`;
    }
}

/**
 * Display question text
 * @param {string} text - Question text
 */
export function displayQuestionText(text) {
    if (elements.questionText) {
        elements.questionText.textContent = text;
    }
}

/**
 * Render options
 * @param {Array} options - Array of option strings
 * @param {number|null} selectedIndex - Currently selected option index
 * @param {Function} onSelect - Callback when option is selected
 */
export function renderOptions(options, selectedIndex, onSelect) {
    if (!elements.optionsContainer) return;
    
    elements.optionsContainer.innerHTML = '';
    
    options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.classList.add('option-btn');
        optionButton.textContent = option;
        
        if (selectedIndex === index) {
            optionButton.classList.add('selected');
        }
        
        optionButton.addEventListener('click', () => onSelect(index));
        elements.optionsContainer.appendChild(optionButton);
    });
}

/**
 * Update option selection
 * @param {number} selectedIndex - Selected option index
 */
export function updateOptionSelection(selectedIndex) {
    const optionButtons = elements.optionsContainer?.querySelectorAll('.option-btn') || [];
    optionButtons.forEach((btn, index) => {
        btn.classList.toggle('selected', index === selectedIndex);
    });
}

/**
 * Update navigation buttons
 * @param {number} currentIndex - Current question index
 * @param {number} totalQuestions - Total number of questions
 */
export function updateNavButtons(currentIndex, totalQuestions) {
    if (elements.prevButton) {
        elements.prevButton.disabled = currentIndex === 0;
    }
    
    if (elements.nextButton) {
        elements.nextButton.disabled = false;
        elements.nextButton.textContent = currentIndex === totalQuestions - 1 
            ? 'Submit Quiz' 
            : 'Next Question';
    }
}

/**
 * Display final score
 * @param {number} score - User's score
 * @param {number} total - Total questions
 * @param {number} percentage - Score percentage
 */
export function displayFinalScore(score, total, percentage) {
    if (elements.finalScoreText) {
        elements.finalScoreText.textContent = `You scored ${score} out of ${total}! (${percentage}%)`;
    }
}

/**
 * Display result message
 * @param {string} message - Result message
 */
export function displayResultMessage(message) {
    let messageElement = document.getElementById('result-message');
    if (!messageElement && elements.finalScoreText) {
        messageElement = document.createElement('p');
        messageElement.id = 'result-message';
        elements.finalScoreText.after(messageElement);
    }
    if (messageElement) {
        messageElement.textContent = message;
    }
}

/**
 * Open mobile question panel
 */
export function openMobilePanel() {
    if (elements.questionPanel && elements.mobileOverlay) {
        elements.mobileOverlay.classList.add('active');
        elements.questionPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close mobile question panel
 */
export function closeMobilePanel() {
    if (elements.questionPanel && elements.mobileOverlay) {
        elements.questionPanel.classList.remove('active');
        elements.mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Show review section
 */
export function showReviewSection() {
    if (elements.reviewSection) {
        elements.reviewSection.classList.remove('hidden');
    }
    if (elements.reviewButton) {
        elements.reviewButton.textContent = 'Hide Review';
    }
}

/**
 * Hide review section
 */
export function hideReviewSection() {
    if (elements.reviewSection) {
        elements.reviewSection.classList.add('hidden');
    }
    if (elements.reviewButton) {
        elements.reviewButton.textContent = 'Review';
    }
}

/**
 * Check if review section is visible
 * @returns {boolean} True if review section is visible
 */
export function isReviewSectionVisible() {
    return elements.reviewSection && !elements.reviewSection.classList.contains('hidden');
}

/**
 * Get review container element
 * @returns {HTMLElement|null} Review container element
 */
export function getReviewContainer() {
    return elements.reviewContainer;
}
