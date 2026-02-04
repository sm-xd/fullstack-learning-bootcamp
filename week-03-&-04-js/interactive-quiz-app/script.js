const quizData = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],    
        correctAnswer: 1
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],   
        correctAnswer: 3
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
        correctAnswer: 1
    },
    {
        question: "What is the chemical symbol for water?",
        options: ["O2", "H2O", "CO2", "NaCl"],
        correctAnswer: 1
    },
    {
        question: "Is Rushi chakla?",
        options: ["yes", "very much", "definitely", "all of the above"],
        correctAnswer: 3
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let isQuizComplete = false;
let timeLeft = 60;
let timerInterval = null;
let userAnswers = []; // Store user's answers for each question

const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-quiz-btn');
const quizArea = document.getElementById('quiz-area');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-question-btn');
const prevButton = document.getElementById('prev-question-btn');
const resultsScreen = document.getElementById('results-screen');
const finalScoreText = document.getElementById('final-score');
const restartButton = document.getElementById('restart-quiz-btn');
const reviewButton = document.getElementById('review-btn');
const reviewSection = document.getElementById('review-section');
const reviewContainer = document.getElementById('review-container');
const timerDisplay = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

function startQuiz() {

    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    isQuizComplete = false;
    timeLeft = 60;
    userAnswers = new Array(quizData.length).fill(null);
    
    if (startScreen) {
        startScreen.classList.add('hidden');
    }
    
    quizArea.hidden = false;
    quizArea.classList.remove('hidden');
    
    resultsScreen.hidden = true;
    resultsScreen.classList.add('hidden');
    
    startTimer();
    
    displayQuestion();
}

function displayQuestion() {

    const currentQuestion = quizData[currentQuestionIndex];
    
    questionText.textContent = currentQuestion.question;
    
    optionsContainer.innerHTML = '';
    
    selectedAnswer = userAnswers[currentQuestionIndex];
    
    nextButton.disabled = false;
    prevButton.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === quizData.length - 1) {
        nextButton.textContent = 'Submit Quiz';
    } else {
        nextButton.textContent = 'Next Question';
    }
    
    currentQuestion.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.classList.add('option-btn');
        optionButton.textContent = option;
        
        if (userAnswers[currentQuestionIndex] === index) {
            optionButton.classList.add('selected');
        }
        
        optionButton.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(optionButton);
    });
    
    const progressPercent = ((currentQuestionIndex) / quizData.length) * 100;
    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
    }
    if (progressBar) {
        progressBar.setAttribute('aria-valuenow', progressPercent);
    }
    if (progressText) {
        progressText.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    }
}

function selectAnswer(selectedIndex) {
    const optionButtons = optionsContainer.querySelectorAll('.option-btn');
    
    if (selectedAnswer === selectedIndex) {
        selectedAnswer = null;
        userAnswers[currentQuestionIndex] = null;
        optionButtons[selectedIndex].classList.remove('selected');
    } else {
        selectedAnswer = selectedIndex;
        userAnswers[currentQuestionIndex] = selectedIndex;
        optionButtons.forEach(btn => btn.classList.remove('selected'));
        optionButtons[selectedIndex].classList.add('selected');
    }
}

function checkAnswer() {
    const currentQuestion = quizData[currentQuestionIndex];
    const optionButtons = optionsContainer.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => btn.disabled = true);

    if (selectedAnswer === currentQuestion.correctAnswer) {
        score++;
        optionButtons[selectedAnswer].classList.add('correct');
        return true;
    } else {
        if (selectedAnswer !== null) {
            optionButtons[selectedAnswer].classList.add('incorrect');
        }
        optionButtons[currentQuestion.correctAnswer].classList.add('correct');
        return false;
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function showResults() {

    isQuizComplete = true;
    stopTimer();
    quizArea.hidden = true;
    quizArea.classList.add('hidden');
    resultsScreen.hidden = false;
    resultsScreen.classList.remove('hidden');
    
    score = 0;
    quizData.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
            score++;
        }
    });
    
    const percentage = Math.round((score / quizData.length) * 100);
    finalScoreText.textContent = `You scored ${score} out of ${quizData.length}! (${percentage}%)`;
    let message = '';
    if (percentage >= 80) {
        message = 'Excellent! You are a quiz master!';
    } else if (percentage >= 60) {
        message = 'Good job! Keep learning!';
    } else if (percentage >= 40) {
        message = 'Not bad! Room for improvement.';
    } else {
        message = 'Keep practicing! You can do better!';
    }
    
    let messageElement = document.getElementById('result-message');
    if (!messageElement) {
        messageElement = document.createElement('p');
        messageElement.id = 'result-message';
        finalScoreText.after(messageElement);
    }
    messageElement.textContent = message;
}

function restartQuiz() {
    resultsScreen.hidden = true;
    resultsScreen.classList.add('hidden');
    
    if (reviewSection) {
        reviewSection.classList.add('hidden');
    }
    
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    isQuizComplete = false;

    startQuiz();
}

function showReview() {
    if (!reviewSection || !reviewContainer) return;
    
    if (reviewSection.classList.contains('hidden')) {
        reviewSection.classList.remove('hidden');
        reviewButton.textContent = 'Review';
        
        reviewContainer.innerHTML = '';
        
        quizData.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            const isUnanswered = userAnswer === null;
            
            const reviewItem = document.createElement('div');
            reviewItem.className = `review-item ${isUnanswered ? 'unanswered' : (isCorrect ? 'correct-answer' : 'wrong-answer')}`;
            
            const questionHeader = document.createElement('div');
            questionHeader.className = 'review-question';
            questionHeader.innerHTML = `
                <span class="review-question-number">Q${index + 1}.</span> ${question.question}
                <span class="review-status ${isUnanswered ? 'skipped' : (isCorrect ? 'correct' : 'wrong')}">
                    ${isUnanswered ? 'Skipped' : (isCorrect ? '✓ Correct' : '✗ Wrong')}
                </span>
            `;
            reviewItem.appendChild(questionHeader);
            
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'review-options';
            
            question.options.forEach((option, optIndex) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'review-option';
                
                let icon = '';
                if (optIndex === question.correctAnswer) {
                    optionDiv.classList.add('correct');
                    icon = '✓ ';
                }
                if (userAnswer === optIndex && !isCorrect) {
                    optionDiv.classList.add('user-wrong');
                    icon = '✗ ';
                }
                if (userAnswer === optIndex && isCorrect) {
                    optionDiv.classList.add('user-correct');
                }
                
                optionDiv.textContent = `${icon}${option}`;
                optionsDiv.appendChild(optionDiv);
            });
            
            reviewItem.appendChild(optionsDiv);
            reviewContainer.appendChild(reviewItem);
        });
    } else {
        reviewSection.classList.add('hidden');
        reviewButton.textContent = 'Review';
    }
}

function startTimer() {
    updateTimer();
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            handleTimeUp();
        }
    }, 1000);
}

function updateTimer() {    
    if (timerDisplay) {
        timerDisplay.textContent = `Time Left: ${timeLeft}s`;
        
        if (timeLeft <= 10) {
            timerDisplay.classList.add('warning');
        } else {
            timerDisplay.classList.remove('warning');
        }
        
        if (timeLeft <= 5) {
            timerDisplay.classList.add('danger');
        } else {
            timerDisplay.classList.remove('danger');
        }
    }
}

function stopTimer() {    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function handleTimeUp() {
    stopTimer();
    showResults();
}

function shuffleArray(array) {    
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

if (startButton) {
    startButton.addEventListener('click', startQuiz);
}

if (nextButton) {
    nextButton.addEventListener('click', nextQuestion);
}

if (prevButton) {
    prevButton.addEventListener('click', prevQuestion);
}

if (restartButton) {
    restartButton.addEventListener('click', restartQuiz);
}

if (reviewButton) {
    reviewButton.addEventListener('click', showReview);
}
