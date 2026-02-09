# Week 5: Async JavaScript/TypeScript - Fetch API & Error Handling

## 🎯 Learning Objectives
By the end of this week, you will:
- Understand synchronous vs asynchronous JavaScript
- Master Callbacks, Promises, and async/await
- Use the Fetch API to make HTTP requests
- Handle loading states and errors gracefully
- Build a complete Weather App with real API integration

---

## 📚 Learning Path

### Day 1: Understanding Asynchronous JavaScript

#### What to Learn:
1. **Synchronous vs Asynchronous Code**
   - JavaScript is single-threaded
   - Event loop and call stack
   - Why async is needed (network requests, timers, file operations)

2. **Callbacks**
   - What are callbacks?
   - Callback pattern for async operations
   - Callback Hell (Pyramid of Doom)

#### Resources:
- [MDN - Asynchronous JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)
- [JavaScript.info - Callbacks](https://javascript.info/callbacks)

#### Practice:
- Complete `practice/01-callbacks/` exercises

---

### Day 2: Promises

#### What to Learn:
1. **Promise Basics**
   - Creating a Promise
   - Promise states: pending, fulfilled, rejected
   - `.then()`, `.catch()`, `.finally()`

2. **Promise Chaining**
   - Returning values in `.then()`
   - Chaining multiple `.then()` calls
   - Error propagation

3. **Promise Static Methods**
   - `Promise.all()` - wait for all
   - `Promise.race()` - first to settle
   - `Promise.allSettled()` - all results regardless of status
   - `Promise.any()` - first fulfilled

#### Resources:
- [MDN - Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [JavaScript.info - Promises](https://javascript.info/promise-basics)

#### Practice:
- Complete `practice/02-promises/` exercises

---

### Day 3: Async/Await

#### What to Learn:
1. **async Functions**
   - `async` keyword
   - Always returns a Promise
   - Cleaner syntax than promise chains

2. **await Keyword**
   - Pauses execution until Promise settles
   - Can only be used inside async functions
   - Top-level await in modules

3. **Error Handling with try/catch**
   - Wrapping await in try/catch
   - Multiple await statements
   - Parallel execution with `Promise.all()`

#### Resources:
- [MDN - async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [JavaScript.info - Async/await](https://javascript.info/async-await)

#### Practice:
- Complete `practice/03-async-await/` exercises

---

### Day 4: Fetch API

#### What to Learn:
1. **Fetch Basics**
   - `fetch()` function
   - Request and Response objects
   - Reading response: `.json()`, `.text()`, `.blob()`

2. **HTTP Methods**
   - GET requests (default)
   - POST, PUT, PATCH, DELETE
   - Setting headers and body

3. **Request Configuration**
   - Options object
   - Headers
   - CORS basics

#### Resources:
- [MDN - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [JavaScript.info - Fetch](https://javascript.info/fetch)

#### Practice:
- Complete `practice/04-fetch-api/` exercises

---

### Day 5: Error Handling & Loading States

#### What to Learn:
1. **Error Handling Patterns**
   - Network errors vs HTTP errors
   - Custom error messages
   - Retry logic

2. **UI States**
   - Loading state (spinners, skeletons)
   - Error state (user-friendly messages)
   - Empty state
   - Success state

3. **Best Practices**
   - Abort controllers for cancellation
   - Timeout handling
   - Graceful degradation

#### Resources:
- [MDN - AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [Error Handling Best Practices](https://www.valentinog.com/blog/error/)

#### Practice:
- Complete `practice/05-error-handling/` exercises

---

### Day 6-7: Weather App Project

Build a complete weather application using OpenWeatherMap API.

#### Features to Implement:
- [ ] Search for city weather
- [ ] Display current weather (temp, humidity, wind, conditions)
- [ ] Show weather icon
- [ ] Loading spinner while fetching
- [ ] Error handling (city not found, network error)
- [ ] Responsive design
- [ ] (Bonus) 5-day forecast
- [ ] (Bonus) Geolocation for current location

---

## 📁 Folder Structure

```
week-04-async-js-&-fetch/
├── README.md
├── practice/
│   ├── 01-callbacks/
│   │   ├── index.html
│   │   └── script.js
│   ├── 02-promises/
│   │   ├── index.html
│   │   └── script.js
│   ├── 03-async-await/
│   │   ├── index.html
│   │   └── script.js
│   ├── 04-fetch-api/
│   │   ├── index.html
│   │   └── script.js
│   └── 05-error-handling/
│       ├── index.html
│       └── script.js
└── weather-app/
    ├── index.html
    ├── style.css
    └── script.js
```

---

## 🔑 API Setup (OpenWeatherMap)

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. API endpoint: `https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric`

---

## ✅ Week Checklist

- [ ] Understand sync vs async JavaScript
- [ ] Can explain callbacks and callback hell
- [ ] Comfortable creating and consuming Promises
- [ ] Master async/await syntax
- [ ] Use Fetch API for GET and POST requests
- [ ] Handle errors gracefully in async code
- [ ] Implement loading states in UI
- [ ] Complete Weather App deliverable

---

## 💡 Quick Reference

### Promise Example
```javascript
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Data received!");
    }, 1000);
  });
};

fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### Async/Await Example
```javascript
const getData = async () => {
  try {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) throw new Error('HTTP error!');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Fetch with Loading & Error States
```javascript
const fetchWithStates = async (url) => {
  showLoader();
  hideError();
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    displayData(data);
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoader();
  }
};
```

---

## 🚀 Deliverable: Weather App

Create a weather application that:
1. Allows users to search for a city
2. Fetches weather data from OpenWeatherMap API
3. Displays weather information beautifully
4. Shows loading spinner during fetch
5. Handles errors with user-friendly messages

Good luck! 🌤️
