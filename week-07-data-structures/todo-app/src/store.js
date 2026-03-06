const STORAGE_KEY = 'todo-app';

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function migrateState(raw) {
  if (!raw || !Array.isArray(raw.tasks)) return null;
  return {
    tasks: raw.tasks.map((t) => ({
      id: String(t.id || generateId()),
      title: String(t.title || ''),
      done: Boolean(t.done),
      starred: Boolean(t.starred),
      tags: Array.isArray(t.tags) ? t.tags.filter((x) => typeof x === 'string') : [],
      createdAt: Number(t.createdAt) || 0
    })),
    filter: ['all', 'active', 'done'].includes(raw.filter) ? raw.filter : 'all',
    tagFilter: typeof raw.tagFilter === 'string' ? raw.tagFilter : null,
    sort: ['newest', 'oldest', 'alpha'].includes(raw.sort) ? raw.sort : 'newest'
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'REMOVE': {
      const tasks = state.tasks.filter((t) => t.id !== action.payload);
      const tagFilter = state.tagFilter && tasks.some((t) => t.tags.includes(state.tagFilter))
        ? state.tagFilter : null;
      return { ...state, tasks, tagFilter };
    }
    case 'TOGGLE':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        )
      };
    case 'STAR':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, starred: !t.starred } : t
        )
      };
    case 'EDIT':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, title: action.payload.title } : t
        )
      };
    case 'CLEAR_DONE': {
      const tasks = state.tasks.filter((t) => !t.done);
      const tagFilter = state.tagFilter && tasks.some((t) => t.tags.includes(state.tagFilter))
        ? state.tagFilter : null;
      return { ...state, tasks, tagFilter };
    }
    case 'FILTER':
      return { ...state, filter: action.payload };
    case 'TAG_FILTER':
      return { ...state, tagFilter: action.payload };
    case 'SORT':
      return { ...state, sort: action.payload };
    default:
      return state;
  }
}

export function getTagCounts(tasks) {
  return tasks.reduce((map, t) => {
    t.tags.forEach((tag) => map.set(tag, (map.get(tag) || 0) + 1));
    return map;
  }, new Map());
}

export function sortTasks(tasks, mode) {
  const copy = [...tasks];
  if (mode === 'oldest') return copy.sort((a, b) => a.createdAt - b.createdAt);
  if (mode === 'alpha') return copy.sort((a, b) => a.title.localeCompare(b.title));
  return copy.sort((a, b) => b.createdAt - a.createdAt);
}

export function filterTasks(tasks, filter, tagFilter) {
  let result = tasks;
  if (filter === 'active') result = result.filter((t) => !t.done);
  if (filter === 'done') result = result.filter((t) => t.done);
  if (tagFilter) result = result.filter((t) => new Set(t.tags).has(tagFilter));
  return result;
}

export function createStore(initial) {
  let state = { tasks: [], filter: 'all', tagFilter: null, sort: 'newest', ...initial };
  const listeners = new Set();

  return {
    getState: () => state,
    dispatch(action) {
      const next = reducer(state, action);
      if (next === state) return;
      state = next;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
      listeners.forEach((fn) => fn(state));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? migrateState(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}
