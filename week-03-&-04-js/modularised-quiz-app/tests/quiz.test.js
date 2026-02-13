/**
 * Tests for quiz module - Unit tests for pure functions
 * Note: This tests the quiz logic functions in isolation
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { 
    quizData,
    getQuestionCount, 
    isCorrectAnswer 
} from '../src/data/quizData.js';
import {
    calculatePercentage,
    getResultMessage,
    createFilledArray
} from '../src/utils/helpers.js';

describe('quiz logic tests', () => {
    
    describe('quiz state management', () => {
        test('should create initial state with null answers', () => {
            const userAnswers = createFilledArray(getQuestionCount(), null);
            
            expect(userAnswers.length).toBe(getQuestionCount());
            userAnswers.forEach(answer => {
                expect(answer).toBeNull();
            });
        });

        test('should track answer selection', () => {
            const userAnswers = createFilledArray(getQuestionCount(), null);
            const questionIndex = 0;
            const selectedAnswer = 2;
            
            userAnswers[questionIndex] = selectedAnswer;
            
            expect(userAnswers[questionIndex]).toBe(selectedAnswer);
        });

        test('should allow deselecting answer', () => {
            const userAnswers = createFilledArray(getQuestionCount(), null);
            userAnswers[0] = 2;
            
            // Deselect
            userAnswers[0] = null;
            
            expect(userAnswers[0]).toBeNull();
        });
    });

    describe('score calculation', () => {
        test('should return 0 when no answers given', () => {
            const userAnswers = createFilledArray(getQuestionCount(), null);
            let score = 0;
            
            for (let i = 0; i < getQuestionCount(); i++) {
                if (isCorrectAnswer(i, userAnswers[i])) {
                    score++;
                }
            }
            
            expect(score).toBe(0);
        });

        test('should count correct answers', () => {
            const userAnswers = createFilledArray(getQuestionCount(), null);
            // Set correct answers for first 3 questions
            userAnswers[0] = quizData[0].correctAnswer;
            userAnswers[1] = quizData[1].correctAnswer;
            userAnswers[2] = quizData[2].correctAnswer;
            
            let score = 0;
            for (let i = 0; i < getQuestionCount(); i++) {
                if (isCorrectAnswer(i, userAnswers[i])) {
                    score++;
                }
            }
            
            expect(score).toBe(3);
        });

        test('should not count wrong answers', () => {
            const userAnswers = createFilledArray(getQuestionCount(), null);
            // Set wrong answers
            userAnswers[0] = (quizData[0].correctAnswer + 1) % 4;
            userAnswers[1] = (quizData[1].correctAnswer + 1) % 4;
            
            let score = 0;
            for (let i = 0; i < getQuestionCount(); i++) {
                if (isCorrectAnswer(i, userAnswers[i])) {
                    score++;
                }
            }
            
            expect(score).toBe(0);
        });

        test('should calculate full score', () => {
            const userAnswers = quizData.map(q => q.correctAnswer);
            
            let score = 0;
            for (let i = 0; i < getQuestionCount(); i++) {
                if (isCorrectAnswer(i, userAnswers[i])) {
                    score++;
                }
            }
            
            expect(score).toBe(getQuestionCount());
        });
    });

    describe('results calculation', () => {
        test('should calculate percentage correctly', () => {
            const score = 7;
            const total = 10;
            const percentage = calculatePercentage(score, total);
            
            expect(percentage).toBe(70);
        });

        test('should return appropriate message for score', () => {
            expect(getResultMessage(90)).toBe('Excellent! You are a quiz master!');
            expect(getResultMessage(70)).toBe('Good job! Keep learning!');
            expect(getResultMessage(50)).toBe('Not bad! Room for improvement.');
            expect(getResultMessage(30)).toBe('Keep practicing! You can do better!');
        });
    });

    describe('navigation logic', () => {
        test('should track current question index', () => {
            let currentQuestionIndex = 0;
            const totalQuestions = getQuestionCount();
            
            // Navigate forward
            currentQuestionIndex++;
            expect(currentQuestionIndex).toBe(1);
            
            // Navigate to last question
            currentQuestionIndex = totalQuestions - 1;
            expect(currentQuestionIndex).toBe(totalQuestions - 1);
        });

        test('should identify last question', () => {
            const totalQuestions = getQuestionCount();
            let currentQuestionIndex = totalQuestions - 1;
            
            const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
            expect(isLastQuestion).toBe(true);
        });

        test('should identify first question', () => {
            let currentQuestionIndex = 0;
            
            const isFirstQuestion = currentQuestionIndex === 0;
            expect(isFirstQuestion).toBe(true);
        });

        test('should validate question bounds', () => {
            const totalQuestions = getQuestionCount();
            
            const isValidIndex = (index) => index >= 0 && index < totalQuestions;
            
            expect(isValidIndex(0)).toBe(true);
            expect(isValidIndex(5)).toBe(true);
            expect(isValidIndex(-1)).toBe(false);
            expect(isValidIndex(totalQuestions)).toBe(false);
        });
    });
});
