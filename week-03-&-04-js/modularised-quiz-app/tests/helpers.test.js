/**
 * Tests for helpers module
 */

import { 
    shuffleArray, 
    calculatePercentage, 
    getResultMessage, 
    formatTime, 
    createFilledArray 
} from '../src/utils/helpers.js';

describe('helpers module', () => {

    describe('shuffleArray', () => {
        test('should return an array of the same length', () => {
            const original = [1, 2, 3, 4, 5];
            const shuffled = shuffleArray(original);
            expect(shuffled.length).toBe(original.length);
        });

        test('should contain the same elements', () => {
            const original = [1, 2, 3, 4, 5];
            const shuffled = shuffleArray(original);
            original.forEach(item => {
                expect(shuffled).toContain(item);
            });
        });

        test('should not modify the original array', () => {
            const original = [1, 2, 3, 4, 5];
            const originalCopy = [...original];
            shuffleArray(original);
            expect(original).toEqual(originalCopy);
        });

        test('should return a new array', () => {
            const original = [1, 2, 3, 4, 5];
            const shuffled = shuffleArray(original);
            expect(shuffled).not.toBe(original);
        });

        test('should handle empty array', () => {
            const result = shuffleArray([]);
            expect(result).toEqual([]);
        });

        test('should handle single element array', () => {
            const result = shuffleArray([1]);
            expect(result).toEqual([1]);
        });
    });

    describe('calculatePercentage', () => {
        test('should calculate percentage correctly', () => {
            expect(calculatePercentage(50, 100)).toBe(50);
            expect(calculatePercentage(1, 4)).toBe(25);
            expect(calculatePercentage(3, 4)).toBe(75);
        });

        test('should return 100 for full score', () => {
            expect(calculatePercentage(10, 10)).toBe(100);
        });

        test('should return 0 for zero score', () => {
            expect(calculatePercentage(0, 10)).toBe(0);
        });

        test('should return 0 when total is 0', () => {
            expect(calculatePercentage(5, 0)).toBe(0);
        });

        test('should round to nearest integer', () => {
            expect(calculatePercentage(1, 3)).toBe(33);
            expect(calculatePercentage(2, 3)).toBe(67);
        });
    });

    describe('getResultMessage', () => {
        test('should return excellent message for 80% or higher', () => {
            expect(getResultMessage(80)).toBe('Excellent! You are a quiz master!');
            expect(getResultMessage(90)).toBe('Excellent! You are a quiz master!');
            expect(getResultMessage(100)).toBe('Excellent! You are a quiz master!');
        });

        test('should return good message for 60-79%', () => {
            expect(getResultMessage(60)).toBe('Good job! Keep learning!');
            expect(getResultMessage(70)).toBe('Good job! Keep learning!');
            expect(getResultMessage(79)).toBe('Good job! Keep learning!');
        });

        test('should return not bad message for 40-59%', () => {
            expect(getResultMessage(40)).toBe('Not bad! Room for improvement.');
            expect(getResultMessage(50)).toBe('Not bad! Room for improvement.');
            expect(getResultMessage(59)).toBe('Not bad! Room for improvement.');
        });

        test('should return keep practicing message for below 40%', () => {
            expect(getResultMessage(0)).toBe('Keep practicing! You can do better!');
            expect(getResultMessage(20)).toBe('Keep practicing! You can do better!');
            expect(getResultMessage(39)).toBe('Keep practicing! You can do better!');
        });
    });

    describe('formatTime', () => {
        test('should format time correctly', () => {
            expect(formatTime(60)).toBe('Time Left: 60s');
            expect(formatTime(30)).toBe('Time Left: 30s');
            expect(formatTime(0)).toBe('Time Left: 0s');
        });

        test('should handle single digit seconds', () => {
            expect(formatTime(5)).toBe('Time Left: 5s');
        });
    });

    describe('createFilledArray', () => {
        test('should create array with specified length', () => {
            const arr = createFilledArray(5, null);
            expect(arr.length).toBe(5);
        });

        test('should fill array with specified value', () => {
            const arr = createFilledArray(3, null);
            expect(arr).toEqual([null, null, null]);
        });

        test('should work with different values', () => {
            expect(createFilledArray(2, 0)).toEqual([0, 0]);
            expect(createFilledArray(3, 'test')).toEqual(['test', 'test', 'test']);
        });

        test('should handle zero length', () => {
            expect(createFilledArray(0, null)).toEqual([]);
        });
    });
});
