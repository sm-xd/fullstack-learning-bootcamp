const quizData = [
    {
        question: "What does REST stand for in RESTful APIs?",
        options: [
            "Remote Execution Standard Transfer",
            "Representational State Transfer",
            "Reliable Service Transport",
            "Recursive State Technology"
        ],
        correctAnswer: 1
    },
    {
        question: "Which HTTP status code represents 'Unauthorized'?",
        options: ["200", "401", "403", "500"],
        correctAnswer: 1
    },
    {
        question: "In JavaScript, which method converts a JSON string into an object?",
        options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"],
        correctAnswer: 0
    },
    {
        question: "What is the time complexity of binary search on a sorted array?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correctAnswer: 1
    },
    {
        question: "Which Git command is used to combine changes from another branch into the current branch?",
        options: ["git push", "git merge", "git clone", "git init"],
        correctAnswer: 1
    },
    {
        question: "Which SQL clause is used to filter aggregated results?",
        options: ["WHERE", "GROUP BY", "HAVING", "ORDER BY"],
        correctAnswer: 2
    },
    {
        question: "In CSS Flexbox, which property controls alignment along the main axis?",
        options: ["align-items", "justify-content", "flex-wrap", "align-content"],
        correctAnswer: 1
    },
    {
        question: "Which data structure uses LIFO (Last In First Out)?",
        options: ["Queue", "Stack", "Heap", "Graph"],
        correctAnswer: 1
    },
    {
        question: "What is the default port for HTTPS?",
        options: ["21", "80", "443", "3306"],
        correctAnswer: 2
    },
    {
        question: "Which JavaScript feature allows handling asynchronous operations using cleaner syntax than promises?",
        options: ["Callbacks", "Generators", "Async/Await", "Closures"],
        correctAnswer: 2
    }
];


let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let isQuizComplete = false;
let timeLeft = 60;
let timerInterval = null;
let userAnswers = [];

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
const progressText = document.getElementById('progress-text');
const questionPanel = document.getElementById('questions-panel');
const quizScreen = document.getElementById('quiz-screen');
const questionPanelToggle = document.getElementById('question-panel-toggle');
const mobileOverlay = document.getElementById('mobile-overlay');

function openMobilePanel() {
    if (questionPanel && mobileOverlay) {
        mobileOverlay.classList.add('active');
        questionPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobilePanel() {
    if (questionPanel && mobileOverlay) {
        questionPanel.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

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

    quizScreen.removeAttribute('hidden');
    quizScreen.classList.remove('hidden');
    quizScreen.classList.add('active');

    resultsScreen.setAttribute('hidden', '');
    resultsScreen.classList.add('hidden');
    resultsScreen.classList.remove('active');

    startTimer();

    displayQuestion();
    loadQuestionPanel();
}

function loadQuestionPanel() {
    questionPanel.innerHTML = '';

    const header = document.createElement('h3');
    header.textContent = 'Question Index';
    header.addEventListener('click', () => {
        if (window.innerWidth <= 640) {
            closeMobilePanel();
        }
    });
    questionPanel.appendChild(header);

    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'question-panel-items';

    quizData.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-panel-item';
        questionDiv.id = `question-panel-item-${index}`;
        questionDiv.textContent = `Question ${index + 1}`;
        questionDiv.addEventListener('click', () => {
            currentQuestionIndex = index;
            displayQuestion();
            if (window.innerWidth <= 640) {
                closeMobilePanel();
            }
        });
        itemsContainer.appendChild(questionDiv);
    });

    questionPanel.appendChild(itemsContainer);
    document.getElementById(`question-panel-item-0`).classList.add('current');
}

function updateQuestionPanelStatus() {
    quizData.forEach((question, index) => {
        const panelItem = document.getElementById(`question-panel-item-${index}`);
        if (panelItem) {
            panelItem.classList.remove('answered', 'current');
            if (userAnswers[index] !== null) {
                panelItem.classList.add('answered');
            }

            if (index === currentQuestionIndex) {
                panelItem.classList.add('current');
            }
        }
    });
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

    if (progressText) {
        progressText.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    }

    updateQuestionPanelStatus();
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

    updateQuestionPanelStatus();
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

    quizScreen.setAttribute('hidden', '');
    quizScreen.classList.add('hidden');
    quizScreen.classList.remove('active');

    resultsScreen.removeAttribute('hidden');
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
    resultsScreen.setAttribute('hidden', '');
    resultsScreen.classList.add('hidden');

    if (reviewSection) {
        reviewSection.classList.add('hidden');
    }
    if (reviewButton) {
        reviewButton.textContent = 'Review';
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
        reviewButton.textContent = 'Hide Review';

        reviewContainer.innerHTML = '';

        quizData.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            const isUnanswered = userAnswer === null;

            const reviewItem = document.createElement('div');
            reviewItem.className = `review-item ${isUnanswered ? 'unanswered' : (isCorrect ? 'correct-answer' : 'wrong-answer')}`;

            const questionHeader = document.createElement('div');
            questionHeader.className = 'review-question';
            const statusClass = isUnanswered ? 'skipped' : (isCorrect ? 'correct' : 'wrong');
            const statusText = isUnanswered ? 'Skipped' : (isCorrect ? '✓ Correct' : '✗ Wrong');
            questionHeader.innerHTML = `<span class="review-question-number">Q${index + 1}.</span> ${question.question} <span class="review-status ${statusClass}">${statusText}</span>`;
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

        timerDisplay.classList.remove('warning', 'danger');

        if (timeLeft <= 10 && timeLeft > 5) {
            timerDisplay.classList.add('warning');
        } else if (timeLeft <= 5) {
            timerDisplay.classList.add('danger');
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

if (questionPanelToggle) {
    questionPanelToggle.addEventListener('click', openMobilePanel);
}

if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobilePanel);
}
