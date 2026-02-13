/**
 * Review Module
 * Handles rendering of quiz answer review
 */

/**
 * Render the review section
 * @param {Array} quizData - Quiz questions data
 * @param {Array} userAnswers - User's answers
 * @param {HTMLElement} container - Container element for review
 */
export function renderReview(quizData, userAnswers, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    quizData.forEach((question, index) => {
        const reviewItem = createReviewItem(question, index, userAnswers[index]);
        container.appendChild(reviewItem);
    });
}

/**
 * Create a review item element
 * @param {Object} question - Question object
 * @param {number} index - Question index
 * @param {number|null} userAnswer - User's answer
 * @returns {HTMLElement} Review item element
 */
export function createReviewItem(question, index, userAnswer) {
    const isCorrect = userAnswer === question.correctAnswer;
    const isUnanswered = userAnswer === null;
    
    const reviewItem = document.createElement('div');
    const statusClass = isUnanswered ? 'unanswered' : (isCorrect ? 'correct-answer' : 'wrong-answer');
    reviewItem.className = `review-item ${statusClass}`;
    
    // Create question header
    const questionHeader = createQuestionHeader(question.question, index, isUnanswered, isCorrect);
    reviewItem.appendChild(questionHeader);
    
    // Create options list
    const optionsDiv = createOptionsReview(question.options, question.correctAnswer, userAnswer, isCorrect);
    reviewItem.appendChild(optionsDiv);
    
    return reviewItem;
}

/**
 * Create question header element
 * @param {string} questionText - Question text
 * @param {number} index - Question index
 * @param {boolean} isUnanswered - Whether question was unanswered
 * @param {boolean} isCorrect - Whether answer was correct
 * @returns {HTMLElement} Question header element
 */
function createQuestionHeader(questionText, index, isUnanswered, isCorrect) {
    const questionHeader = document.createElement('div');
    questionHeader.className = 'review-question';
    
    const statusClass = isUnanswered ? 'skipped' : (isCorrect ? 'correct' : 'wrong');
    const statusText = isUnanswered ? 'Skipped' : (isCorrect ? 'Correct' : 'Wrong');
    const statusIcon = isUnanswered ? '' : (isCorrect ? '[OK] ' : '[X] ');
    
    questionHeader.innerHTML = `
        <span class="review-question-number">Q${index + 1}.</span> 
        ${questionText} 
        <span class="review-status ${statusClass}">${statusIcon}${statusText}</span>
    `;
    
    return questionHeader;
}

/**
 * Create options review element
 * @param {Array} options - Array of option strings
 * @param {number} correctAnswer - Correct answer index
 * @param {number|null} userAnswer - User's answer
 * @param {boolean} isCorrect - Whether user's answer was correct
 * @returns {HTMLElement} Options review element
 */
function createOptionsReview(options, correctAnswer, userAnswer, isCorrect) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'review-options';
    
    options.forEach((option, optIndex) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'review-option';
        
        let icon = '';
        
        if (optIndex === correctAnswer) {
            optionDiv.classList.add('correct');
            icon = '[OK] ';
        }
        
        if (userAnswer === optIndex && !isCorrect) {
            optionDiv.classList.add('user-wrong');
            icon = '[X] ';
        }
        
        if (userAnswer === optIndex && isCorrect) {
            optionDiv.classList.add('user-correct');
        }
        
        optionDiv.textContent = `${icon}${option}`;
        optionsDiv.appendChild(optionDiv);
    });
    
    return optionsDiv;
}

/**
 * Get review status info
 * @param {number|null} userAnswer - User's answer
 * @param {number} correctAnswer - Correct answer
 * @returns {Object} Status information
 */
export function getReviewStatus(userAnswer, correctAnswer) {
    const isUnanswered = userAnswer === null;
    const isCorrect = userAnswer === correctAnswer;
    
    return {
        isUnanswered,
        isCorrect,
        statusClass: isUnanswered ? 'skipped' : (isCorrect ? 'correct' : 'wrong'),
        statusText: isUnanswered ? 'Skipped' : (isCorrect ? 'Correct' : 'Wrong')
    };
}
