const AppState = {
    currentSearch: '',
    currentPage: 1,
    totalPages: 0,
    totalResults: 0,
    resultsPerPage: 10,
    isLoading: false,
    debounceTimer: null
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

async function performSearch(searchTerm, page = 1) {
    if (!searchTerm || searchTerm.trim().length < 2) {
        UI.showEmpty();
        return;
    }

    if (AppState.isLoading) return;

    AppState.isLoading = true;
    AppState.currentSearch = searchTerm.trim();
    AppState.currentPage = page;
    AppState.resultsPerPage = UI.getResultsPerPage();

    Storage.saveLastSearch(AppState.currentSearch);

    const cacheKey = `${AppState.currentSearch}_p${page}_n${AppState.resultsPerPage}`;

    const cached = Storage.getCachedResults(AppState.currentSearch, cacheKey);
    if (cached) {
        handleSearchResults(cached, page);
        AppState.isLoading = false;
        return;
    }

    UI.showLoading();
    UI.setButtonsDisabled(true);

    let results;
    if (AppState.resultsPerPage === 10) {
        results = await API.searchMovies(AppState.currentSearch, page);
    } else {
        results = await API.searchMoviesMultiPage(
            AppState.currentSearch,
            page,
            AppState.resultsPerPage
        );
    }

    handleSearchResults(results, page);

    if (results.success) {
        Storage.cacheResults(AppState.currentSearch, cacheKey, results);
    }

    AppState.isLoading = false;
}

function handleSearchResults(results, page) {
    UI.showSearchIndicator(false);

    if (!results.success) {
        if (results.error === 'Movie not found!' || results.error === 'No movies found') {
            UI.showNoResults();
        } else {
            UI.showError(results.error);
        }
        return;
    }

    if (results.movies.length === 0) {
        UI.showNoResults();
        return;
    }

    AppState.totalResults = results.totalResults;
    AppState.totalPages = API.calculateTotalPages(results.totalResults, AppState.resultsPerPage);
    AppState.currentPage = page;

    UI.showControlsBar(AppState.totalResults);

    UI.renderMovies(results.movies);
    UI.updatePagination(AppState.currentPage, AppState.totalPages);
    UI.setButtonsDisabled(false);
}

async function changePage(direction) {
    const newPage = AppState.currentPage + direction;

    if (newPage < 1 || newPage > AppState.totalPages) return;

    UI.scrollToTop();

    await performSearch(AppState.currentSearch, newPage);
}

function handlePerPageChange() {
    if (AppState.currentSearch) {
        performSearch(AppState.currentSearch, 1);
    }
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

function setupEventListeners() {
    UI.elements.searchInput.addEventListener('input', handleSearchInput);

    UI.elements.searchInput.addEventListener('keydown', handleSearchKeydown);

    UI.elements.prevBtn.addEventListener('click', () => changePage(-1));
    UI.elements.nextBtn.addEventListener('click', () => changePage(1));

    UI.elements.perPageSelect.addEventListener('change', handlePerPageChange);

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

