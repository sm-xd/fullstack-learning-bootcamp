/**
 * Tests for timer module
 */

import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { 
    initTimer, 
    startTimer, 
    stopTimer, 
    getTimeLeft, 
    resetTimer,
    updateTimerDisplay,
    _testExports 
} from '../src/modules/timer.js';

describe('timer module', () => {
    let mockTimerDisplay;
    let mockOnTimeUp;

    beforeEach(() => {
        // Create mock DOM element
        mockTimerDisplay = document.createElement('div');
        mockOnTimeUp = jest.fn();
        
        // Reset timer state
        resetTimer();
        
        // Use fake timers
        jest.useFakeTimers();
    });

    afterEach(() => {
        stopTimer();
        jest.useRealTimers();
    });

    describe('initTimer', () => {
        test('should initialize timer with display element and callback', () => {
            initTimer(mockTimerDisplay, mockOnTimeUp);
            // initTimer should not throw
            expect(true).toBe(true);
        });
    });

    describe('startTimer', () => {
        beforeEach(() => {
            initTimer(mockTimerDisplay, mockOnTimeUp);
        });

        test('should set initial time', () => {
            startTimer(60);
            expect(getTimeLeft()).toBe(60);
        });

        test('should use default time when no argument provided', () => {
            startTimer();
            expect(getTimeLeft()).toBe(_testExports.DEFAULT_TIME);
        });

        test('should decrement time every second', () => {
            startTimer(60);
            
            jest.advanceTimersByTime(1000);
            expect(getTimeLeft()).toBe(59);
            
            jest.advanceTimersByTime(1000);
            expect(getTimeLeft()).toBe(58);
        });

        test('should call onTimeUp when time reaches 0', () => {
            startTimer(3);
            
            jest.advanceTimersByTime(3000);
            
            expect(mockOnTimeUp).toHaveBeenCalled();
        });

        test('should stop timer when time reaches 0', () => {
            startTimer(2);
            
            jest.advanceTimersByTime(2000);
            jest.advanceTimersByTime(1000);
            
            // Time should not go negative
            expect(getTimeLeft()).toBeLessThanOrEqual(0);
        });
    });

    describe('stopTimer', () => {
        beforeEach(() => {
            initTimer(mockTimerDisplay, mockOnTimeUp);
        });

        test('should stop the countdown', () => {
            startTimer(60);
            
            jest.advanceTimersByTime(2000);
            expect(getTimeLeft()).toBe(58);
            
            stopTimer();
            
            jest.advanceTimersByTime(2000);
            expect(getTimeLeft()).toBe(58);
        });
    });

    describe('getTimeLeft', () => {
        beforeEach(() => {
            initTimer(mockTimerDisplay, mockOnTimeUp);
        });

        test('should return remaining time', () => {
            startTimer(30);
            expect(getTimeLeft()).toBe(30);
            
            jest.advanceTimersByTime(5000);
            expect(getTimeLeft()).toBe(25);
        });
    });

    describe('resetTimer', () => {
        beforeEach(() => {
            initTimer(mockTimerDisplay, mockOnTimeUp);
        });

        test('should reset time to default', () => {
            startTimer(30);
            jest.advanceTimersByTime(10000);
            
            resetTimer();
            
            expect(getTimeLeft()).toBe(_testExports.DEFAULT_TIME);
        });

        test('should stop the timer', () => {
            startTimer(60);
            jest.advanceTimersByTime(5000);
            
            resetTimer();
            
            const timeAfterReset = getTimeLeft();
            jest.advanceTimersByTime(5000);
            
            expect(getTimeLeft()).toBe(timeAfterReset);
        });
    });

    describe('updateTimerDisplay', () => {
        test('should update display text', () => {
            initTimer(mockTimerDisplay, mockOnTimeUp);
            startTimer(45);
            
            updateTimerDisplay();
            
            expect(mockTimerDisplay.textContent).toBe('Time Left: 45s');
        });

        test('should add warning class when time is low', () => {
            initTimer(mockTimerDisplay, mockOnTimeUp);
            startTimer(10);
            
            jest.advanceTimersByTime(1000);
            
            expect(mockTimerDisplay.classList.contains('warning')).toBe(true);
        });

        test('should add danger class when time is very low', () => {
            initTimer(mockTimerDisplay, mockOnTimeUp);
            startTimer(5);
            
            updateTimerDisplay();
            
            expect(mockTimerDisplay.classList.contains('danger')).toBe(true);
        });
    });

    describe('threshold constants', () => {
        test('should have correct threshold values', () => {
            expect(_testExports.DEFAULT_TIME).toBe(60);
            expect(_testExports.WARNING_THRESHOLD).toBe(10);
            expect(_testExports.DANGER_THRESHOLD).toBe(5);
        });
    });
});
