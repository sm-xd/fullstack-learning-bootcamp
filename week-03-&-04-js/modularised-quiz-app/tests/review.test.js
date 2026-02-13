/**
 * Tests for review module
 */

import { 
    renderReview, 
    createReviewItem, 
    getReviewStatus 
} from '../src/modules/review.js';

describe('review module', () => {
    
    const mockQuizData = [
        {
            question: "Test Question 1",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 1
        },
        {
            question: "Test Question 2",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: 2
        }
    ];

    describe('getReviewStatus', () => {
        test('should return correct status for correct answer', () => {
            const status = getReviewStatus(1, 1);
            expect(status.isCorrect).toBe(true);
            expect(status.isUnanswered).toBe(false);
            expect(status.statusClass).toBe('correct');
            expect(status.statusText).toBe('Correct');
        });

        test('should return wrong status for incorrect answer', () => {
            const status = getReviewStatus(0, 1);
            expect(status.isCorrect).toBe(false);
            expect(status.isUnanswered).toBe(false);
            expect(status.statusClass).toBe('wrong');
            expect(status.statusText).toBe('Wrong');
        });

        test('should return skipped status for unanswered', () => {
            const status = getReviewStatus(null, 1);
            expect(status.isCorrect).toBe(false);
            expect(status.isUnanswered).toBe(true);
            expect(status.statusClass).toBe('skipped');
            expect(status.statusText).toBe('Skipped');
        });
    });

    describe('createReviewItem', () => {
        test('should create review item for correct answer', () => {
            const item = createReviewItem(mockQuizData[0], 0, 1);
            
            expect(item.classList.contains('review-item')).toBe(true);
            expect(item.classList.contains('correct-answer')).toBe(true);
        });

        test('should create review item for wrong answer', () => {
            const item = createReviewItem(mockQuizData[0], 0, 0);
            
            expect(item.classList.contains('review-item')).toBe(true);
            expect(item.classList.contains('wrong-answer')).toBe(true);
        });

        test('should create review item for unanswered', () => {
            const item = createReviewItem(mockQuizData[0], 0, null);
            
            expect(item.classList.contains('review-item')).toBe(true);
            expect(item.classList.contains('unanswered')).toBe(true);
        });

        test('should contain question header', () => {
            const item = createReviewItem(mockQuizData[0], 0, 1);
            const header = item.querySelector('.review-question');
            
            expect(header).not.toBeNull();
            expect(header.textContent).toContain('Q1');
            expect(header.textContent).toContain('Test Question 1');
        });

        test('should contain all options', () => {
            const item = createReviewItem(mockQuizData[0], 0, 1);
            const options = item.querySelectorAll('.review-option');
            
            expect(options.length).toBe(4);
        });

        test('should mark correct option', () => {
            const item = createReviewItem(mockQuizData[0], 0, 0);
            const options = item.querySelectorAll('.review-option');
            
            expect(options[1].classList.contains('correct')).toBe(true);
        });

        test('should mark user wrong answer', () => {
            const item = createReviewItem(mockQuizData[0], 0, 0);
            const options = item.querySelectorAll('.review-option');
            
            expect(options[0].classList.contains('user-wrong')).toBe(true);
        });

        test('should mark user correct answer', () => {
            const item = createReviewItem(mockQuizData[0], 0, 1);
            const options = item.querySelectorAll('.review-option');
            
            expect(options[1].classList.contains('user-correct')).toBe(true);
        });
    });

    describe('renderReview', () => {
        let container;

        beforeEach(() => {
            container = document.createElement('div');
        });

        test('should render all questions', () => {
            const userAnswers = [1, 2];
            renderReview(mockQuizData, userAnswers, container);
            
            const items = container.querySelectorAll('.review-item');
            expect(items.length).toBe(2);
        });

        test('should clear container before rendering', () => {
            container.innerHTML = '<div>Old content</div>';
            const userAnswers = [1, 2];
            
            renderReview(mockQuizData, userAnswers, container);
            
            expect(container.textContent).not.toContain('Old content');
        });

        test('should handle null container', () => {
            const userAnswers = [1, 2];
            
            // Should not throw
            expect(() => renderReview(mockQuizData, userAnswers, null)).not.toThrow();
        });

        test('should handle empty quiz data', () => {
            renderReview([], [], container);
            
            const items = container.querySelectorAll('.review-item');
            expect(items.length).toBe(0);
        });

        test('should render mixed results correctly', () => {
            const userAnswers = [1, 0]; // First correct, second wrong
            renderReview(mockQuizData, userAnswers, container);
            
            const items = container.querySelectorAll('.review-item');
            expect(items[0].classList.contains('correct-answer')).toBe(true);
            expect(items[1].classList.contains('wrong-answer')).toBe(true);
        });
    });
});
