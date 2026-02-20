# Movie Search App

A beginner-friendly project demonstrating core JavaScript browser concepts: **debouncing**, **pagination**, and **web storage**.

### Debouncing

**What is it?**
Debouncing delays a function call until after a certain amount of time has passed since the last call.

**Why use it?**
When a user types in a search box, we don't want to make an API call for every single keystroke. That would:
- Waste API calls (and money if you're paying per request)
- Overload the server
- Create a poor user experience with flickering results

**How it works:**
```javascript
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);  // Cancel previous timer
    timeoutId = setTimeout(() => {
      func.apply(this, args);  // Call function after delay
    }, delay);
  };
}

// Usage: Only calls searchMovies 500ms after user stops typing
const debouncedSearch = debounce(searchMovies, 500);
```

---

### Pagination

**What is it?**
Breaking large datasets into smaller chunks (pages) that load on demand.

**Why use it?**
- Faster initial load (don't fetch 1000 results at once)
- Better user experience (easier to browse)
- Reduced bandwidth usage
- API limitations (OMDb returns max 10 results per request)

**How it works:**
```
Total Results: 127 movies
Results Per Page: 10
Total Pages: Math.ceil(127 / 10) = 13 pages
```

---

### localStorage vs sessionStorage

Both store data in the browser, but they behave differently:

| Feature | localStorage | sessionStorage |
|---------|--------------|----------------|
| Persistence | Until manually cleared | Until tab closes |
| Scope | All tabs for same domain | Only current tab |
| Use case | User preferences, saved data | Temporary cache, session data |

**In this app:**
- `localStorage`: Saves last search term (persists after browser close)
- `sessionStorage`: Caches API results (clears when tab closes)

---

## Getting an OMDb API Key

1. Go to [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
2. Select "FREE" tier (1,000 daily requests)
3. Enter your email
4. Check your email and activate the key
5. Replace `YOUR_API_KEY` in `api.js` with your actual key

---

## Project Structure

```
movie-search/
├── index.html      # Page structure
├── styles.css      # All styling
├── app.js          # Main logic + debounce
├── api.js          # API communication
├── ui.js           # DOM manipulation
├── storage.js      # localStorage/sessionStorage
└── README.md       # This file
```

**Why this structure?**
Each file has one responsibility:
- `api.js` - Only talks to the API
- `ui.js` - Only updates the screen
- `storage.js` - Only handles saving/loading data
- `app.js` - Coordinates everything

This is called **Separation of Concerns** and makes code easier to understand and maintain.

---

## How to Run

1. Get your OMDb API key (see above)
2. Open `api.js` and replace `YOUR_API_KEY`
3. Open `index.html` in your browser
4. Start searching!

No build tools or servers needed - it just works!

---

## Key Concepts Demonstrated

- Debounced input handling
- Fetch API for HTTP requests
- Async/await syntax
- DOM manipulation
- Event listeners
- localStorage persistence
- sessionStorage caching
- Responsive CSS Grid
- Loading/error states
- Pagination logic

---

## Further Reading

- [MDN: Debouncing and Throttling](https://developer.mozilla.org/en-US/docs/Glossary/Debounce)
- [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [OMDb API Documentation](https://www.omdbapi.com/)
