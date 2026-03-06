import {
  generateId, migrateState, reducer, getTagCounts,
  sortTasks, filterTasks, createStore, loadState
} from '../src/store.js';

const mockStorage = (() => {
  let store = {};
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = v; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(global, 'localStorage', { value: mockStorage });
beforeEach(() => localStorage.clear());

const t = (id, title, done = false, tags = [], starred = false, createdAt = Date.now()) =>
  ({ id, title, done, tags, starred, createdAt });

const base = { tasks: [], filter: 'all', tagFilter: null, sort: 'newest' };

describe('generateId', () => {
  test('returns non-empty string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  test('unique across calls', () => {
    const ids = new Set(Array.from({ length: 100 }, generateId));
    expect(ids.size).toBe(100);
  });
});

describe('migrateState', () => {
  test('returns null for null', () => {
    expect(migrateState(null)).toBeNull();
  });

  test('returns null for missing tasks array', () => {
    expect(migrateState({ tasks: 'not-array' })).toBeNull();
  });

  test('normalises missing task fields', () => {
    const result = migrateState({ tasks: [{ id: '1' }] });
    expect(result.tasks[0]).toMatchObject({
      id: '1', title: '', done: false, starred: false, tags: [], createdAt: 0
    });
  });

  test('preserves valid task fields', () => {
    const input = { tasks: [{ id: 'a', title: 'Buy milk', done: true, starred: true, tags: ['shop'], createdAt: 100 }] };
    const result = migrateState(input);
    expect(result.tasks[0]).toEqual(input.tasks[0]);
  });

  test('filters non-string tags', () => {
    const result = migrateState({ tasks: [{ id: '1', tags: ['ok', 42, null] }] });
    expect(result.tasks[0].tags).toEqual(['ok']);
  });

  test('defaults invalid filter to all', () => {
    expect(migrateState({ tasks: [], filter: 'bogus' }).filter).toBe('all');
  });

  test('defaults invalid sort to newest', () => {
    expect(migrateState({ tasks: [], sort: 'bogus' }).sort).toBe('newest');
  });

  test('defaults non-string tagFilter to null', () => {
    expect(migrateState({ tasks: [], tagFilter: 123 }).tagFilter).toBeNull();
  });

  test('preserves valid state fields', () => {
    const result = migrateState({ tasks: [], filter: 'done', sort: 'alpha', tagFilter: 'work' });
    expect(result.filter).toBe('done');
    expect(result.sort).toBe('alpha');
    expect(result.tagFilter).toBe('work');
  });
});

describe('reducer', () => {
  test('ADD appends task', () => {
    const task = t('1', 'Test');
    const next = reducer(base, { type: 'ADD', payload: task });
    expect(next.tasks).toEqual([task]);
    expect(next).not.toBe(base);
  });

  test('REMOVE deletes by id', () => {
    const state = { ...base, tasks: [t('1', 'A'), t('2', 'B')] };
    const next = reducer(state, { type: 'REMOVE', payload: '1' });
    expect(next.tasks).toHaveLength(1);
    expect(next.tasks[0].id).toBe('2');
  });

  test('REMOVE resets tagFilter when tag no longer exists', () => {
    const state = { ...base, tasks: [t('1', 'A', false, ['work'])], tagFilter: 'work' };
    const next = reducer(state, { type: 'REMOVE', payload: '1' });
    expect(next.tagFilter).toBeNull();
  });

  test('REMOVE keeps tagFilter when tag still exists', () => {
    const state = {
      ...base,
      tasks: [t('1', 'A', false, ['work']), t('2', 'B', false, ['work'])],
      tagFilter: 'work'
    };
    const next = reducer(state, { type: 'REMOVE', payload: '1' });
    expect(next.tagFilter).toBe('work');
  });

  test('TOGGLE flips done', () => {
    const state = { ...base, tasks: [t('1', 'A', false)] };
    expect(reducer(state, { type: 'TOGGLE', payload: '1' }).tasks[0].done).toBe(true);
  });

  test('TOGGLE back to false', () => {
    const state = { ...base, tasks: [t('1', 'A', true)] };
    expect(reducer(state, { type: 'TOGGLE', payload: '1' }).tasks[0].done).toBe(false);
  });

  test('STAR toggles starred', () => {
    const state = { ...base, tasks: [t('1', 'A', false, [], false)] };
    expect(reducer(state, { type: 'STAR', payload: '1' }).tasks[0].starred).toBe(true);
    const state2 = { ...base, tasks: [t('1', 'A', false, [], true)] };
    expect(reducer(state2, { type: 'STAR', payload: '1' }).tasks[0].starred).toBe(false);
  });

  test('EDIT updates title', () => {
    const state = { ...base, tasks: [t('1', 'Old')] };
    const next = reducer(state, { type: 'EDIT', payload: { id: '1', title: 'New' } });
    expect(next.tasks[0].title).toBe('New');
  });

  test('EDIT preserves other task fields', () => {
    const state = { ...base, tasks: [t('1', 'Old', true, ['tag'], true, 50)] };
    const next = reducer(state, { type: 'EDIT', payload: { id: '1', title: 'New' } });
    expect(next.tasks[0]).toMatchObject({ done: true, tags: ['tag'], starred: true, createdAt: 50 });
  });

  test('CLEAR_DONE removes completed tasks', () => {
    const state = { ...base, tasks: [t('1', 'A', true), t('2', 'B', false)] };
    const next = reducer(state, { type: 'CLEAR_DONE' });
    expect(next.tasks).toHaveLength(1);
    expect(next.tasks[0].id).toBe('2');
  });

  test('CLEAR_DONE resets tagFilter when tag gone', () => {
    const state = { ...base, tasks: [t('1', 'A', true, ['work'])], tagFilter: 'work' };
    const next = reducer(state, { type: 'CLEAR_DONE' });
    expect(next.tagFilter).toBeNull();
  });

  test('CLEAR_DONE keeps tagFilter when tag remains', () => {
    const state = {
      ...base,
      tasks: [t('1', 'A', true, ['work']), t('2', 'B', false, ['work'])],
      tagFilter: 'work'
    };
    const next = reducer(state, { type: 'CLEAR_DONE' });
    expect(next.tagFilter).toBe('work');
  });

  test('FILTER changes filter', () => {
    expect(reducer(base, { type: 'FILTER', payload: 'active' }).filter).toBe('active');
  });

  test('TAG_FILTER sets tag', () => {
    expect(reducer(base, { type: 'TAG_FILTER', payload: 'work' }).tagFilter).toBe('work');
  });

  test('TAG_FILTER null clears', () => {
    const state = { ...base, tagFilter: 'work' };
    expect(reducer(state, { type: 'TAG_FILTER', payload: null }).tagFilter).toBeNull();
  });

  test('SORT sets mode', () => {
    expect(reducer(base, { type: 'SORT', payload: 'alpha' }).sort).toBe('alpha');
  });

  test('unknown action returns same reference', () => {
    expect(reducer(base, { type: 'NOOP' })).toBe(base);
  });
});

describe('getTagCounts', () => {
  test('counts tags across tasks (Map)', () => {
    const tasks = [
      t('1', 'A', false, ['work', 'urgent']),
      t('2', 'B', false, ['work']),
      t('3', 'C', false, ['home'])
    ];
    const counts = getTagCounts(tasks);
    expect(counts).toBeInstanceOf(Map);
    expect(counts.get('work')).toBe(2);
    expect(counts.get('urgent')).toBe(1);
    expect(counts.get('home')).toBe(1);
  });

  test('empty Map for tasks with no tags', () => {
    expect(getTagCounts([t('1', 'A')])).toEqual(new Map());
  });
});

describe('sortTasks', () => {
  const a = t('1', 'Banana', false, [], false, 100);
  const b = t('2', 'Apple', false, [], false, 200);
  const c = t('3', 'Cherry', false, [], false, 150);

  test('newest descending', () => {
    expect(sortTasks([a, b, c], 'newest').map((x) => x.id)).toEqual(['2', '3', '1']);
  });

  test('oldest ascending', () => {
    expect(sortTasks([a, b, c], 'oldest').map((x) => x.id)).toEqual(['1', '3', '2']);
  });

  test('alpha by title', () => {
    expect(sortTasks([a, b, c], 'alpha').map((x) => x.title)).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  test('does not mutate original', () => {
    const arr = [b, a];
    sortTasks(arr, 'alpha');
    expect(arr[0].id).toBe('2');
  });
});

describe('filterTasks', () => {
  const tasks = [
    t('1', 'A', false, ['work']),
    t('2', 'B', true, ['home']),
    t('3', 'C', false, ['work', 'home'])
  ];

  test('all returns everything', () => {
    expect(filterTasks(tasks, 'all', null)).toEqual(tasks);
  });

  test('active only', () => {
    expect(filterTasks(tasks, 'active', null).map((x) => x.id)).toEqual(['1', '3']);
  });

  test('done only', () => {
    expect(filterTasks(tasks, 'done', null).map((x) => x.id)).toEqual(['2']);
  });

  test('tag filter narrows results', () => {
    expect(filterTasks(tasks, 'all', 'home').map((x) => x.id)).toEqual(['2', '3']);
  });

  test('combined status + tag filter', () => {
    expect(filterTasks(tasks, 'active', 'work').map((x) => x.id)).toEqual(['1', '3']);
  });

  test('null tagFilter returns all', () => {
    expect(filterTasks(tasks, 'all', null)).toHaveLength(3);
  });
});

describe('createStore', () => {
  test('defaults', () => {
    const s = createStore().getState();
    expect(s).toEqual({ tasks: [], filter: 'all', tagFilter: null, sort: 'newest' });
  });

  test('accepts initial state', () => {
    const s = createStore({ tasks: [t('1', 'A')], filter: 'done' }).getState();
    expect(s.tasks).toHaveLength(1);
    expect(s.filter).toBe('done');
  });

  test('dispatch updates state', () => {
    const store = createStore();
    store.dispatch({ type: 'ADD', payload: t('1', 'A') });
    expect(store.getState().tasks).toHaveLength(1);
  });

  test('subscribe notifies', () => {
    const store = createStore();
    const fn = jest.fn();
    store.subscribe(fn);
    store.dispatch({ type: 'ADD', payload: t('1', 'A') });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('unsubscribe stops notifications', () => {
    const store = createStore();
    const fn = jest.fn();
    const unsub = store.subscribe(fn);
    unsub();
    store.dispatch({ type: 'ADD', payload: t('1', 'A') });
    expect(fn).not.toHaveBeenCalled();
  });

  test('persists to localStorage', () => {
    const store = createStore();
    store.dispatch({ type: 'ADD', payload: t('1', 'A') });
    const saved = JSON.parse(localStorage.getItem('todo-app'));
    expect(saved.tasks).toHaveLength(1);
  });

  test('no-op dispatch skips notify', () => {
    const store = createStore();
    const fn = jest.fn();
    store.subscribe(fn);
    store.dispatch({ type: 'NOOP' });
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('loadState', () => {
  test('returns null when empty', () => {
    expect(loadState()).toBeNull();
  });

  test('parses and migrates stored state', () => {
    localStorage.setItem('todo-app', JSON.stringify({ tasks: [{ id: '1' }], filter: 'all' }));
    const state = loadState();
    expect(state.tasks[0]).toMatchObject({ id: '1', done: false, starred: false });
  });

  test('returns null on corrupt JSON', () => {
    localStorage.setItem('todo-app', '{bad');
    expect(loadState()).toBeNull();
  });
});
