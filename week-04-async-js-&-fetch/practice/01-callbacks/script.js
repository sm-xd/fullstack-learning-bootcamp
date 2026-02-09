// Practice 01: Callbacks

const output = document.getElementById('output');

function log(message) {
    output.textContent += message + '\n';
    console.log(message);
}

function clearOutput() {
    output.textContent = '';
}

// simple callback
function runExercise1() {
    clearOutput();
    log('Simple Callback\n');

    function greet(name, callback) {
        const message = `Hello, ${name}!`;
        callback(message);
    }

    greet('Sumit', function (result) {
        log('Greeting received: ' + result);
    });
    log('\n');
    greet('Developer', (result) => {
        log('Arrow callback: ' + result);
    });
}

// async with timeout
function runExercise2() {
    clearOutput();
    log('async with timeout\n');
    log('Start');

    // setTimeout is async - it doesn't block
    setTimeout(function () {
        log('This runs after 2 seconds');
    }, 2000);

    setTimeout(() => {
        log('This runs after 1 second');
    }, 1000);

    log('End (but this prints before the timeouts!)\n');
    log('This is because JavaScript is non-blocking.');
}

// Callback with Parameters
function runExercise3() {
    clearOutput();
    log('Callback with Parameters\n');

    function fetchUser(userId, callback) {
        log(`Fetching user ${userId}...`);

        setTimeout(() => {
            const user = {
                id: userId,
                name: 'John Doe',
                email: 'john@example.com'
            };
            callback(user);
        }, 1500);
    }

    fetchUser(123, function (user) {
        log('\nUser: ');
        log(`   ID: ${user.id}`);
        log(`   Name: ${user.name}`);
        log(`   Email: ${user.email}`);
    });
}

// Callback Hell (The Problem)
function runExercise4() {
    clearOutput();
    log('Callback Hell (The Problem)\n');

    function step1(callback) {
        setTimeout(() => {
            log('Step 1: Get user');
            callback('user_123');
        }, 500);
    }

    function step2(userId, callback) {
        setTimeout(() => {
            log('Step 2: Get user orders');
            callback(['order_1', 'order_2']);
        }, 500);
    }

    function step3(orders, callback) {
        setTimeout(() => {
            log('Step 3: Get order details');
            callback({ total: 99.99, items: 3 });
        }, 500);
    }

    function step4(details, callback) {
        setTimeout(() => {
            log('Step 4: Process payment');
            callback('Payment successful!');
        }, 500);
    }

    // This is CALLBACK HELL - hard to read and maintain!
    step1(function (userId) {
        step2(userId, function (orders) {
            step3(orders, function (details) {
                step4(details, function (result) {
                    log('\n' + result);
                    // This nested structure is called "Callback Hell
                    // Promises and async/await solve this problem!
                });
            });
        });
    });
}

// Error-First Callback Pattern
function runExercise5() {
    clearOutput();
    log('Error-First Callback Pattern\n');

    function fetchData(shouldFail, callback) {
        setTimeout(() => {
            if (shouldFail) {
                callback(new Error('Failed to fetch data!'), null);
            } else {
                callback(null, { data: 'Success!' });
            }
        }, 1000);
    }

    log('Attempting successful request...');
    fetchData(false, function (error, result) {
        if (error) {
            log('Error: ' + error.message);
        } else {
            log('Success: ' + JSON.stringify(result));
        }

        //error
        log('\nAttempting failing request...');
        fetchData(true, function (error, result) {
            if (error) {
                log('Error: ' + error.message);
            } else {
                log('Success: ' + JSON.stringify(result));
            }

            // This pattern: callback(error, result) is the Node.js convention for async callbacks.');
        });
    });
}

// 1. Create a function `delayedAdd(a, b, callback)` that:
//    - Waits 2 seconds
//    - Adds a + b
//    - Passes the result to the callback
function delayedAdd(a, b, callback) {
    setTimeout(() => {
        const result = a + b;
        callback(result);
    }, 2000);
}

function printResult(result) {
    console.log("Result: " + result);
}

delayedAdd(10, 20, printResult);

// 2. Create a function `fetchMultipleUsers(ids, callback)` that:
//    - Takes an array of user IDs
//    - Simulates fetching each user (use setTimeout)
//    - Returns all users via callback when done

function fetchMultipleUsers(ids, callback) {
    setTimeout(() => {
        const users = ids.map(id => ({
            id: id,
            name: "john doe",
            email: `user${id}@example.com`
        }));
        callback(users);
    }, 500);
}

function printUser(users) {
    users.forEach(element => {
        console.log(element);
    });
}

fetchMultipleUsers([1, 2, 3, 4, 5], printUser);


// 3. Rewrite the callback hell example to be more readable
//    by extracting each callback into a named function.



function runExercise4Solved() {
    clearOutput();
    log('Callback Hell (The Problem)\n');

    function step1(callback) {
        setTimeout(() => {
            log('Step 1: Get user');
            callback('user_123');
        }, 500);
    }

    function step2(userId, callback) {
        setTimeout(() => {
            log('Step 2: Get user orders');
            callback(['order_1', 'order_2']);
        }, 500);
    }

    function step3(orders, callback) {
        setTimeout(() => {
            log('Step 3: Get order details');
            callback({ total: 99.99, items: 3 });
        }, 500);
    }

    function step4(details, callback) {
        setTimeout(() => {
            log('Step 4: Process payment');
            callback('Payment successful!');
        }, 500);
    }

    function handlePaymentResult(result) {
        log('\n' + result);
        log('\nThis is much cleaner than nested callbacks!');
    }

    function handleOrderDetails(details) {
        step4(details, handlePaymentResult);
    }

    function handleUserOrders(orders) {
        step3(orders, handleOrderDetails);
    }

    function handleUserId(userId) {
        step2(userId, handleUserOrders);
    }

    step1(handleUserId);
}
// runExercise4Solved()