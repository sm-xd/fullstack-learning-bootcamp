/**
 * Helpers Module
 * Contains utility functions used across the application
 */

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Calculate percentage
 * @param {number} value - The value
 * @param {number} total - The total
 * @returns {number} Percentage rounded to nearest integer
 */
export function calculatePercentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

/**
 * Get result message based on percentage
 * @param {number} percentage - Score percentage
 * @returns {string} Result message
 */
export function getResultMessage(percentage) {
    if (percentage >= 80) {
        return 'Excellent! You are a quiz master!';
    } else if (percentage >= 60) {
        return 'Good job! Keep learning!';
    } else if (percentage >= 40) {
        return 'Not bad! Room for improvement.';
    } else {
        return 'Keep practicing! You can do better!';
    }
}

/**
 * Format time for display
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
    return `Time Left: ${seconds}s`;
}

/**
 * Create an array filled with a value
 * @param {number} length - Array length
 * @param {*} value - Value to fill
 * @returns {Array} Filled array
 */
export function createFilledArray(length, value) {
    return new Array(length).fill(value);
}
