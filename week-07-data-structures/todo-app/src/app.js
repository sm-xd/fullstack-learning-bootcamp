import { createStore, loadState, generateId, filterTasks, sortTasks, getTagCounts } from './store.js';

function init() {
  const store = createStore(loadState());

  const form = document.getElementById('add-form');
  const taskInput = document.getElementById('task-input');
  const tagInput = document.getElementById('tag-input');
  const list = document.getElementById('task-list');
  const countEl = document.getElementById('count');
  const tagBar = document.getElementById('tag-bar');
  const sortSelect = document.getElementById('sort-select');
  const clearBtn = document.getElementById('clear-done');
  const emptyEl = document.getElementById('empty-state');
  const footerEl = document.getElementById('footer');
  const filters = document.querySelectorAll('[data-filter]');
  const dateEl = document.getElementById('date');

  dateEl.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  function render(state) {
    const filtered = filterTasks(state.tasks, state.filter, state.tagFilter);
    const sorted = sortTasks(filtered, state.sort);
    const active = state.tasks.filter((t) => !t.done).length;
    const doneCount = state.tasks.length - active;

    list.innerHTML = '';
    sorted.forEach((task) => {
      const li = document.createElement('li');
      li.className = 'task' + (task.done ? ' done' : '');

      const toggle = document.createElement('button');
      toggle.className = 'toggle';
      toggle.textContent = task.done ? '\u2713' : '';
      toggle.setAttribute('aria-label', task.done ? 'Mark incomplete' : 'Mark complete');
      toggle.addEventListener('click', () => store.dispatch({ type: 'TOGGLE', payload: task.id }));

      const body = document.createElement('div');
      body.className = 'task-body';

      const title = document.createElement('span');
      title.className = 'task-title';
      title.textContent = task.title;
      title.addEventListener('dblclick', () => startEdit(li, task));
      body.appendChild(title);

      if (task.tags.length) {
        const tags = document.createElement('div');
        tags.className = 'task-tags';
        task.tags.forEach((t) => {
          const chip = document.createElement('span');
          chip.className = 'task-tag';
          chip.textContent = t;
          chip.addEventListener('click', () =>
            store.dispatch({ type: 'TAG_FILTER', payload: t })
          );
          tags.appendChild(chip);
        });
        body.appendChild(tags);
      }

      const star = document.createElement('button');
      star.className = 'star' + (task.starred ? ' starred' : '');
      star.textContent = task.starred ? '\u2605' : '\u2606';
      star.setAttribute('aria-label', task.starred ? 'Remove importance' : 'Mark important');
      star.addEventListener('click', () => store.dispatch({ type: 'STAR', payload: task.id }));

      const del = document.createElement('button');
      del.className = 'delete';
      del.setAttribute('aria-label', 'Delete task');
      del.textContent = '\u00d7';
      del.addEventListener('click', () => store.dispatch({ type: 'REMOVE', payload: task.id }));

      li.append(toggle, body, star, del);
      list.appendChild(li);
    });

    const empty = sorted.length === 0;
    emptyEl.hidden = !empty;
    if (empty) {
      emptyEl.textContent = state.tasks.length === 0
        ? 'Your task list is empty'
        : 'No tasks match the current filter';
    }

    footerEl.hidden = state.tasks.length === 0;
    countEl.textContent = `${active} task${active !== 1 ? 's' : ''} remaining`;
    clearBtn.hidden = doneCount === 0;

    filters.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === state.filter);
    });

    sortSelect.value = state.sort;
    renderTags(state);
  }

  function renderTags(state) {
    const counts = getTagCounts(state.tasks);
    tagBar.innerHTML = '';
    if (!counts.size) return;

    const allBtn = document.createElement('button');
    allBtn.className = 'tag-pill' + (state.tagFilter === null ? ' active' : '');
    allBtn.textContent = 'All';
    allBtn.addEventListener('click', () =>
      store.dispatch({ type: 'TAG_FILTER', payload: null })
    );
    tagBar.appendChild(allBtn);

    counts.forEach((cnt, tag) => {
      const btn = document.createElement('button');
      btn.className = 'tag-pill' + (state.tagFilter === tag ? ' active' : '');
      btn.textContent = `${tag} (${cnt})`;
      btn.addEventListener('click', () =>
        store.dispatch({ type: 'TAG_FILTER', payload: tag })
      );
      tagBar.appendChild(btn);
    });
  }

  function startEdit(li, task) {
    if (task.done) return;
    const titleEl = li.querySelector('.task-title');
    if (!titleEl || li.querySelector('.task-title-input')) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-title-input';
    input.value = task.title;
    input.maxLength = 200;

    const save = () => {
      const val = input.value.trim();
      if (val && val !== task.title) {
        store.dispatch({ type: 'EDIT', payload: { id: task.id, title: val } });
      } else {
        render(store.getState());
      }
    };

    input.addEventListener('blur', save);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
      if (e.key === 'Escape') { input.value = task.title; input.blur(); }
    });

    titleEl.replaceWith(input);
    input.focus();
    input.select();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;
    const rawTags = tagInput.value.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    const tags = [...new Set(rawTags)];
    store.dispatch({
      type: 'ADD',
      payload: {
        id: generateId(), title: text, done: false,
        starred: false, tags, createdAt: Date.now()
      }
    });
    taskInput.value = '';
    tagInput.value = '';
    taskInput.focus();
  });

  filters.forEach((btn) => {
    btn.addEventListener('click', () =>
      store.dispatch({ type: 'FILTER', payload: btn.dataset.filter })
    );
  });

  sortSelect.addEventListener('change', (e) => {
    store.dispatch({ type: 'SORT', payload: e.target.value });
  });

  clearBtn.addEventListener('click', () => store.dispatch({ type: 'CLEAR_DONE' }));

  store.subscribe(render);
  render(store.getState());
}

document.addEventListener('DOMContentLoaded', init);

document.addEventListener('DOMContentLoaded', init);
