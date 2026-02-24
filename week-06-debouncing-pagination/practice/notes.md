# Practice Notes: Debouncing, Throttling, and Web Storage

Quick reference for the core concepts covered in this week's demos.

---

## Debouncing

### What is it?
A technique that delays function execution until after a pause in activity.

### Mental Model
Imagine an elevator door:
- Door starts to close
- Someone walks in → door resets the timer
- Another person walks in → timer resets again
- Only when nobody enters for a few seconds does the door finally close

### When to Use
- Search input (wait for user to stop typing)
- Window resize events
- Form validation
- Auto-save features

### Implementation
```javascript
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);  // Reset the timer
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage
const debouncedSearch = debounce(searchAPI, 500);
searchInput.addEventListener('input', debouncedSearch);
```

---

## Throttling

### What is it?
A technique that limits function execution to once per specified time interval.

### Mental Model
Imagine a speed limit:
- No matter how fast you want to go, you can only go 60 mph
- You might hit 60, wait, hit 60 again, etc.
- Consistent, regulated rate

### When to Use
- Scroll events
- Mouse movement tracking
- Resize handlers when you need updates
- Progress bar updates
- Game loop updates

### Implementation
```javascript
function throttle(func, limit) {
  let lastRun = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastRun >= limit) {
      lastRun = now;
      func.apply(this, args);
    }
  };
}

// Usage
const throttledScroll = throttle(updatePosition, 100);
window.addEventListener('scroll', throttledScroll);
```

---

## Debounce vs Throttle

| Aspect | Debounce | Throttle |
|--------|----------|----------|
| When it fires | After activity stops | At regular intervals |
| Number of calls | Once (at the end) | Multiple (regularly) |
| Best for | Search input, resize end | Scroll, mouse move |
| User waiting | Might feel delayed | Responsive updates |

### Visual Timeline

```
User action:  ----x-x-x-x-x-x-x---------x-x-x-x----
Debounce:     -------------------------•---------•
Throttle:     ----•---•---•---•---------•---•-----

x = user action
• = function execution
```

---

## localStorage

### Characteristics
- Persists until manually cleared
- Survives browser close
- Shared across all tabs (same origin)
- ~5-10 MB limit

### API
```javascript
// Save
localStorage.setItem('key', 'value');

// Retrieve
const value = localStorage.getItem('key');

// Remove one
localStorage.removeItem('key');

// Clear all
localStorage.clear();

// Count items
console.log(localStorage.length);
```

### Storing Objects
```javascript
// Objects must be serialized to JSON
const user = { name: 'John', age: 30 };

// Save
localStorage.setItem('user', JSON.stringify(user));

// Retrieve
const savedUser = JSON.parse(localStorage.getItem('user'));
```

### Use Cases
- User preferences (theme, language)
- Shopping cart contents
- Form drafts
- Authentication tokens (be careful!)
- Last search queries

---

## sessionStorage

### Characteristics
- Clears when tab/window closes
- Isolated to current tab
- Not shared between tabs
- ~5-10 MB limit

### API
Same as localStorage:
```javascript
sessionStorage.setItem('key', 'value');
const value = sessionStorage.getItem('key');
sessionStorage.removeItem('key');
sessionStorage.clear();
```

### Use Cases
- Temporary caches
- One-time form data
- Wizard/multi-step form state
- Tab-specific data
- Preventing duplicate API calls

---

## Common Gotchas

### 1. Storage only stores strings
```javascript
// ❌ Won't work as expected
localStorage.setItem('count', 42);
const count = localStorage.getItem('count'); // "42" (string!)

// ✅ Convert explicitly
const count = parseInt(localStorage.getItem('count'), 10); // 42 (number)
```

### 2. Storage events only fire in OTHER tabs
```javascript
// This listener won't catch changes in the same tab
window.addEventListener('storage', (e) => {
  console.log('Storage changed:', e.key, e.newValue);
});
```

### 3. Debounce/Throttle and `this` context
```javascript
// ❌ May lose context
button.addEventListener('click', debounce(handleClick, 500));

// ✅ Preserve context if needed
button.addEventListener('click', debounce(handleClick.bind(this), 500));
```

### 4. Private browsing mode
Some browsers limit or disable storage in private mode. Always wrap in try-catch:
```javascript
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn('Storage not available');
  }
}
```

---

## Quick Reference

```javascript
// Debounce - delays until pause
const debouncedFn = debounce(fn, 500);

// Throttle - limits to rate
const throttledFn = throttle(fn, 100);

// localStorage - permanent
localStorage.setItem('key', JSON.stringify(data));
const data = JSON.parse(localStorage.getItem('key'));

// sessionStorage - temporary
sessionStorage.setItem('key', JSON.stringify(data));
const data = JSON.parse(sessionStorage.getItem('key'));
```

---

## Practice Exercises

1. **Debounce a search input** - Count how many API calls you save
2. **Throttle a scroll handler** - Build a scroll progress indicator
3. **localStorage theme toggle** - Remember user's dark/light preference
4. **sessionStorage form backup** - Save form data as user types
5. **Combine them** - Debounced search with sessionStorage cache
