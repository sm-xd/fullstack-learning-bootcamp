// Practice 02: Promises
// Open index.html in browser and check console for more details

const output = document.getElementById('output');

function log(message) {
    output.textContent += message + '\n';
    console.log(message);
}

function clearOutput() {
    output.textContent = '';
}

// Creating a Promise
function runExercise1() {
    clearOutput();
    log('Creating a Promise\n');
    
    // A Promise takes a function with (resolve, reject) parameters
    const myPromise = new Promise((resolve, reject) => {
        log('Promise started (pending) ');
        
        setTimeout(() => {
            const success = true; //false to see rejection
            
            if (success) {
                resolve('Data loaded successfully!');
            } else {
                reject(new Error('Failed to load data'));
            }
        }, 1500);
    });
    
    log('Promise created, waiting for result...\n');
    
    // Handle the promise
    myPromise
        .then(result => {
            log('Resolved: ' + result);
        })
        .catch(error => {
            log('Rejected: ' + error.message);
        });
}

// then, catch, finally
function runExercise2() {
    clearOutput();
    log('then, catch, finally\n');
    
    function fetchData(shouldSucceed) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldSucceed) {
                    resolve({ id: 1, name: 'Product A', price: 29.99 });
                } else {
                    reject(new Error('Network error'));
                }
            }, 1000);
        });
    }
    
    log('Fetching data (success scenario)...');
    
    fetchData(true)
        .then(data => {
            log('\n.then() - Data received:');
            log('   ' + JSON.stringify(data));
            return data.price * 1.1; 
        })
        .then(priceWithTax => {
            log('   Price with tax: $' + priceWithTax.toFixed(2));
        })
        .catch(error => {
            log('\n.catch() - Error: ' + error.message);
        })
        .finally(() => {
            log('\n.finally() - This ALWAYS runs!');
            log('   (Good for cleanup, hiding loaders, etc.)');
        });
}

// Promise Chaining
function runExercise3() {
    clearOutput();
    log('Promise Chaining\n');
    log('Watch how we chain operations in sequence:\n');
    
    function getUser(id) {
        return new Promise(resolve => {
            setTimeout(() => {
                log('Got user');
                resolve({ id, name: 'John' });
            }, 500);
        });
    }
    
    function getOrders(user) {
        return new Promise(resolve => {
            setTimeout(() => {
                log('Got orders for ' + user.name);
                resolve([{ orderId: 101 }, { orderId: 102 }]);
            }, 500);
        });
    }
    
    function getOrderDetails(orders) {
        return new Promise(resolve => {
            setTimeout(() => {
                log('Got order details');
                resolve({ 
                    orderCount: orders.length, 
                    total: 149.99 
                });
            }, 500);
        });
    }
    
    // Clean promise chain - no callback hell!
    getUser(123)
        .then(user => getOrders(user))
        .then(orders => getOrderDetails(orders))
        .then(details => {
            log('\n✅ Final result:');
            log('   Orders: ' + details.orderCount);
            log('   Total: $' + details.total);
            log('\n👆 Much cleaner than nested callbacks!');
        });
}

// Promise.all()
function runExercise4() {
    clearOutput();
    log('Promise.all()\n');
    log('Running 3 API calls in PARALLEL:\n');
    
    const startTime = Date.now();
    
    function fetchUser() {
        return new Promise(resolve => {
            setTimeout(() => {
                log('User fetched');
                resolve({ name: 'John' });
            }, 1000);
        });
    }
    
    function fetchPosts() {
        return new Promise(resolve => {
            setTimeout(() => {
                log('Posts fetched');
                resolve([{ title: 'Post 1' }, { title: 'Post 2' }]);
            }, 1500);
        });
    }
    
    function fetchComments() {
        return new Promise(resolve => {
            setTimeout(() => {
                log('Comments fetched');
                resolve([{ text: 'Great!' }]);
            }, 800);
        });
    }
    
    log('Starting all requests...\n');
    
    // Promise.all waits for ALL promises to resolve
    Promise.all([fetchUser(), fetchPosts(), fetchComments()])
        .then(([user, posts, comments]) => {
            const elapsed = Date.now() - startTime;
            log('\nAll done in ' + elapsed + 'ms');
            log('   (Not 3.3s because they ran in parallel!)');
            log('\nResults:');
            log('   User: ' + user.name);
            log('   Posts: ' + posts.length);
            log('   Comments: ' + comments.length);
        });
}

// Promise.race() & Promise.any()
function runExercise5() {
    clearOutput();
    log('Promise.race() & Promise.any()\n');
    
    function fast() {
        return new Promise(resolve => {
            setTimeout(() => resolve('Fast server (500ms)'), 500);
        });
    }
    
    function medium() {
        return new Promise(resolve => {
            setTimeout(() => resolve('Medium server (1000ms)'), 1000);
        });
    }
    
    function slow() {
        return new Promise(resolve => {
            setTimeout(() => resolve('Slow server (2000ms)'), 2000);
        });
    }
    
    log('Racing 3 servers...\n');
    
    // Promise.race - first to settle (fulfill OR reject) wins
    Promise.race([fast(), medium(), slow()])
        .then(winner => {
            log('Promise.race winner: ' + winner);
        });
    
    // Promise.any - first to FULFILL wins (ignores rejections)
    function failFast() {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Fast failure')), 100);
        });
    }
    
    setTimeout(() => {
        log('\n--- Promise.any example ---');
        log('One fails fast, but we get first success:\n');
        
        Promise.any([failFast(), fast(), medium()])
            .then(winner => {
                log('Promise.any winner: ' + winner);
                log('\n(Ignored the fast failure!)');
            });
    }, 2500);
}

// Error Handling
function runExercise6() {
    clearOutput();
    log('Error Handling\n');
    
    function riskyOperation(shouldFail) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldFail) {
                    reject(new Error('Something went wrong!'));
                } else {
                    resolve('Operation successful');
                }
            }, 500);
        });
    }
    
    // Example 1: Catching errors
    log('Example 1: Basic catch\n');
    
    riskyOperation(true)
        .then(result => log('Success: ' + result))
        .catch(error => log('Caught: ' + error.message));
    
    // Example 2: Error in .then() chain
    setTimeout(() => {
        log('\n---\nExample 2: Error in chain\n');
        
        riskyOperation(false)
            .then(result => {
                log('First then: ' + result);
                throw new Error('Error in then!');
            })
            .then(result => {
                log('This will NOT run');
            })
            .catch(error => {
                log('Caught from chain: ' + error.message);
            });
    }, 1000);
    
    // Example 3: Promise.allSettled
    setTimeout(() => {
        log('\n---\nExample 3: Promise.allSettled\n');
        log('(Gets results of ALL promises, even if some fail)\n');
        
        Promise.allSettled([
            riskyOperation(false),
            riskyOperation(true),
            riskyOperation(false)
        ]).then(results => {
            results.forEach((result, i) => {
                if (result.status === 'fulfilled') {
                    log(`Promise ${i + 1}: ${result.value}`);
                } else {
                    log(`Promise ${i + 1}: ${result.reason.message}`);
                }
            });
        });
    }, 2000);
}

// ==========================================
// YOUR TURN: Practice Exercises
// ==========================================

/*
🎯 CHALLENGES - Try these!

1. Create a `delay(ms)` function that returns a Promise
   that resolves after the specified milliseconds.
   Usage: delay(1000).then(() => console.log('1 second later'));

2. Create a `timeout(promise, ms)` function that:
   - Races the promise against a timeout
   - Rejects if the timeout wins
   
3. Implement a `retry(fn, retries)` function that:
   - Calls fn (which returns a promise)
   - If it fails, retries up to `retries` times
   - Returns the first successful result

4. Use Promise.all to fetch data from 3 different
   mock API endpoints simultaneously.
*/

console.log('🤝 Promises practice loaded! Open index.html in browser.');
