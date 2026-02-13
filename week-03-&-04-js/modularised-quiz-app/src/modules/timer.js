/**
 * Timer Module
 * Handles quiz timer functionality
 */

import { formatTime } from '../utils/helpers.js';

let timeLeft = 60;
let timerInterval = null;
let timerDisplay = null;
let onTimeUpCallback = null;

const DEFAULT_TIME = 60;
const WARNING_THRESHOLD = 10;
const DANGER_THRESHOLD = 5;

/**
 * Initialize the timer module
 * @param {HTMLElement} displayElement - Timer display element
 * @param {Function} onTimeUp - Callback when time runs out
 */
export function initTimer(displayElement, onTimeUp) {
    timerDisplay = displayElement;
    onTimeUpCallback = onTimeUp;
}

/**
 * Start the timer
 * @param {number} initialTime - Starting time in seconds (default: 60)
 */
export function startTimer(initialTime = DEFAULT_TIME) {
    timeLeft = initialTime;
    updateTimerDisplay();
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            handleTimeUp();
        }
    }, 1000);
}

/**
 * Update the timer display
 */
export function updateTimerDisplay() {
    if (timerDisplay) {
        timerDisplay.textContent = formatTime(timeLeft);
        
        timerDisplay.classList.remove('warning', 'danger');
        
        if (timeLeft <= DANGER_THRESHOLD) {
            timerDisplay.classList.add('danger');
        } else if (timeLeft <= WARNING_THRESHOLD) {
            timerDisplay.classList.add('warning');
        }
    }
}

/**
 * Stop the timer
 */
export function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/**
 * Handle time up event
 */
function handleTimeUp() {
    stopTimer();
    if (onTimeUpCallback) {
        onTimeUpCallback();
    }
}

/**
 * Get remaining time
 * @returns {number} Time left in seconds
 */
export function getTimeLeft() {
    return timeLeft;
}

/**
 * Reset timer to initial state
 */
export function resetTimer() {
    stopTimer();
    timeLeft = DEFAULT_TIME;
}

// For testing purposes
export const _testExports = {
    DEFAULT_TIME,
    WARNING_THRESHOLD,
    DANGER_THRESHOLD,
    handleTimeUp
};
