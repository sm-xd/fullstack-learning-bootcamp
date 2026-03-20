const AppState = {
    currentSearch: '',
    currentPage: 1,
    totalPages: 0,
    totalResults: 0,
    isLoading: false,
    hasMore: false
};

function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function throttle(func, limit) {
    let lastCall = 0;

    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

async function performSearch(searchTerm, page = 1) {
    if (!searchTerm || searchTerm.trim().length < 2) {
        UI.showEmpty();
        return;
    }

    if (AppState.isLoading) return;

    AppState.isLoading = true;
    AppState.currentSearch = searchTerm.trim();

    if (page === 1) {
        Storage.saveLastSearch(AppState.currentSearch);
    }

    const cached = Storage.getCachedResults(AppState.currentSearch, page);
    if (cached) {
        handleSearchResults(cached, page);
        AppState.isLoading = false;
        return;
    }

    if (page === 1) {
        UI.showLoading();
    } else {
        UI.showScrollLoader();
    }

    const results = await API.searchMovies(AppState.currentSearch, page);

    handleSearchResults(results, page);

    if (results.success) {
        Storage.cacheResults(AppState.currentSearch, page, results);
    }

    AppState.isLoading = false;
}

function handleSearchResults(results, page) {
    UI.showSearchIndicator(false);
    UI.hideScrollLoader();

    if (!results.success) {
        if (page === 1) {
            if (results.error === 'Movie not found!' || results.error === 'No movies found') {
                UI.showNoResults();
            } else {
                UI.showError(results.error);
            }
        }
        AppState.hasMore = false;
        return;
    }

    if (results.movies.length === 0) {
        if (page === 1) UI.showNoResults();
        AppState.hasMore = false;
        return;
    }

    AppState.totalResults = results.totalResults;
    AppState.totalPages = API.calculateTotalPages(results.totalResults, 10);
    AppState.currentPage = page;
    AppState.hasMore = page < AppState.totalPages;

    UI.showControlsBar(AppState.totalResults);

    if (page === 1) {
        UI.renderMovies(results.movies);
    } else {
        UI.appendMovies(results.movies);
    }
}

async function loadMoreMovies() {
    if (AppState.isLoading || !AppState.hasMore || !AppState.currentSearch) return;
    await performSearch(AppState.currentSearch, AppState.currentPage + 1);
}

const debouncedSearch = debounce((searchTerm) => {
    performSearch(searchTerm, 1);
}, 500);

function handleSearchInput(event) {
    const searchTerm = event.target.value;

    if (searchTerm.length >= 2) {
        UI.showSearchIndicator(true);
    }

    debouncedSearch(searchTerm);
}

function handleSearchKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const searchTerm = UI.getSearchValue();
        if (searchTerm.length >= 2) {
            performSearch(searchTerm, 1);
        }
    }
}

async function handleMovieClick(event) {
    const card = event.target.closest('.movie-card');
    if (!card) return;

    const imdbId = card.getAttribute('data-imdb-id');
    if (!imdbId) return;

    UI.showModalLoading();

    const result = await API.getMovieDetails(imdbId);

    if (result.success) {
        UI.showMovieDetails(result.movie);
    } else {
        UI.hideModal();
        console.error('Failed to load movie details:', result.error);
    }
}

function handleMovieKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleMovieClick(event);
    }
}

const throttledScroll = throttle(() => {
    const scrolled = window.scrollY + window.innerHeight;
    const threshold = document.documentElement.scrollHeight - 300;
    if (scrolled >= threshold) {
        loadMoreMovies();
    }
}, 200);

function setupEventListeners() {
    UI.elements.searchInput.addEventListener('input', handleSearchInput);

    UI.elements.searchInput.addEventListener('keydown', handleSearchKeydown);

    window.addEventListener('scroll', throttledScroll);

    UI.elements.resultsGrid.addEventListener('click', handleMovieClick);
    UI.elements.resultsGrid.addEventListener('keydown', handleMovieKeydown);

    document.getElementById('modalClose').addEventListener('click', UI.hideModal);
    document.getElementById('modalBackdrop').addEventListener('click', UI.hideModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            UI.hideModal();
        }
    });
}

function restorePreviousSearch() {
    const lastSearch = Storage.getLastSearch();

    if (lastSearch) {
        UI.setSearchValue(lastSearch);
        performSearch(lastSearch, 1);
    }
}

function initApp() {
    UI.init();

    setupEventListeners();

    restorePreviousSearch();

    UI.elements.searchInput.focus();

    console.log('Movie Search App initialized');
}

document.addEventListener('DOMContentLoaded', initApp);

