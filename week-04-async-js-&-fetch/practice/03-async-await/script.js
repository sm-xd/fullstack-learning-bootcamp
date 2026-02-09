const output = document.getElementById('output');

function log(message) {
    output.textContent += message + '\n';
    console.log(message);
}

function clearOutput() {
    output.textContent = '';
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fakeAPI(data, delayMs = 1000, shouldFail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error('API Error'));
            } else {
                resolve(data);
            }
        }, delayMs);
    });
}


async function runExercise1() {
    clearOutput();
    log('Basic async/await\n');
    
    // An async function always returns a Promise
    async function getGreeting() {
        return 'Hello, World!'; // Automatically wrapped in Promise.resolve()
    }
    
    // await pauses until the Promise resolves
    const greeting = await getGreeting();
    log('Greeting: ' + greeting);
    
    log('\nFetching user data...');
    
    async function fetchUser() {
        await delay(1000);
        return { id: 1, name: 'John Doe', role: 'Developer' };
    }
    
    const user = await fetchUser();
    log('User : ' + user.name);
    
    log('\nFetching multiple ');
    
    const item1 = await fakeAPI('Item 1', 500);
    log('Got: ' + item1);
    
    const item2 = await fakeAPI('Item 2', 500);
    log('Got: ' + item2);
    
}
// Sequential vs Parallel
async function runExercise2() {
    clearOutput();
    log('Sequential vs Parallel\n');
    
    const seqStart = Date.now();
    
    const a = await fakeAPI('A', 500);
    log('   Got ' + a);
    const b = await fakeAPI('B', 500);
    log('   Got ' + b);
    const c = await fakeAPI('C', 500);
    log('   Got ' + c);
    
    log(`   Total time: ${Date.now() - seqStart}ms (≈1500ms)\n`);
    

    const parStart = Date.now();
    
    const promiseA = fakeAPI('A', 500);
    const promiseB = fakeAPI('B', 500);
    const promiseC = fakeAPI('C', 500);
    
    const [resultA, resultB, resultC] = await Promise.all([
        promiseA, 
        promiseB, 
        promiseC
    ]);
    
    log(`   Got ${resultA}, ${resultB}, ${resultC}`);
    log(`   Total time: ${Date.now() - parStart}ms (≈500ms)\n`);
    
}

// looops
async function runExercise4() {
    clearOutput();
    log('Loops with async/await\n');
    
    const items = ['Apple', 'Banana', 'Orange', 'Grape'];
    
    log('Sequential processing:\n');
    
    for (const item of items) {
        await delay(400);
        log('   Processed: ' + item);
    }
    
    log('\nParallel processing \n');
    
    const parallelStart = Date.now();
    
    const results = await Promise.all(
        items.map(async (item) => {
            await delay(400);
            return `Processed: ${item}`;
        })
    );
    
    results.forEach(result => log('   ' + result));
    log(`   Done in ${Date.now() - parallelStart}ms`);
    
}
