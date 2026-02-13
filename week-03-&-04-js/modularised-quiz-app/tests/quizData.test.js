/**
 * Tests for quizData module
 */

import { 
    quizData, 
    getQuestionCount, 
    getQuestion, 
    isCorrectAnswer 
} from '../src/data/quizData.js';

describe('quizData module', () => {
    
    describe('quizData array', () => {
        test('should contain quiz questions', () => {
            expect(Array.isArray(quizData)).toBe(true);
            expect(quizData.length).toBeGreaterThan(0);
        });

        test('each question should have required properties', () => {
            quizData.forEach((question, index) => {
                expect(question).toHaveProperty('question');
                expect(question).toHaveProperty('options');
                expect(question).toHaveProperty('correctAnswer');
                expect(typeof question.question).toBe('string');
                expect(Array.isArray(question.options)).toBe(true);
                expect(typeof question.correctAnswer).toBe('number');
            });
        });

        test('each question should have 4 options', () => {
            quizData.forEach((question) => {
                expect(question.options.length).toBe(4);
            });
        });

        test('correctAnswer should be a valid index', () => {
            quizData.forEach((question) => {
                expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
                expect(question.correctAnswer).toBeLessThan(question.options.length);
            });
        });
    });

    describe('getQuestionCount', () => {
        test('should return the total number of questions', () => {
            expect(getQuestionCount()).toBe(quizData.length);
        });

        test('should return a positive number', () => {
            expect(getQuestionCount()).toBeGreaterThan(0);
        });
    });

    describe('getQuestion', () => {
        test('should return question at valid index', () => {
            const question = getQuestion(0);
            expect(question).toBe(quizData[0]);
        });

        test('should return null for negative index', () => {
            const question = getQuestion(-1);
            expect(question).toBeNull();
        });

        test('should return null for out of bounds index', () => {
            const question = getQuestion(quizData.length);
            expect(question).toBeNull();
        });

        test('should return correct question for each valid index', () => {
            for (let i = 0; i < quizData.length; i++) {
                expect(getQuestion(i)).toBe(quizData[i]);
            }
        });
    });

    describe('isCorrectAnswer', () => {
        test('should return true for correct answer', () => {
            quizData.forEach((question, qIndex) => {
                expect(isCorrectAnswer(qIndex, question.correctAnswer)).toBe(true);
            });
        });

        test('should return false for incorrect answer', () => {
            const firstQuestion = quizData[0];
            const wrongAnswer = (firstQuestion.correctAnswer + 1) % 4;
            expect(isCorrectAnswer(0, wrongAnswer)).toBe(false);
        });

        test('should return false for invalid question index', () => {
            expect(isCorrectAnswer(-1, 0)).toBe(false);
            expect(isCorrectAnswer(quizData.length, 0)).toBe(false);
        });

        test('should return false for null answer', () => {
            expect(isCorrectAnswer(0, null)).toBe(false);
        });
    });
});
