const UI = {
    elements: {
        searchInput: null,
        searchIndicator: null,
        loadingState: null,
        errorState: null,
        errorMessage: null,
        emptyState: null,
        noResultsState: null,
        resultsGrid: null,
        pagination: null,
        prevBtn: null,
        nextBtn: null,
        pageInfo: null,
        controlsBar: null,
        perPageSelect: null,
        resultsCount: null
    },

    init() {
        this.elements.searchInput = document.getElementById('searchInput');
        this.elements.searchIndicator = document.getElementById('searchIndicator');
        this.elements.loadingState = document.getElementById('loadingState');
        this.elements.errorState = document.getElementById('errorState');
        this.elements.errorMessage = document.getElementById('errorMessage');
        this.elements.emptyState = document.getElementById('emptyState');
        this.elements.noResultsState = document.getElementById('noResultsState');
        this.elements.resultsGrid = document.getElementById('resultsGrid');
        this.elements.pagination = document.getElementById('pagination');
        this.elements.prevBtn = document.getElementById('prevBtn');
        this.elements.nextBtn = document.getElementById('nextBtn');
        this.elements.pageInfo = document.getElementById('pageInfo');
        this.elements.controlsBar = document.getElementById('controlsBar');
        this.elements.perPageSelect = document.getElementById('perPageSelect');
        this.elements.resultsCount = document.getElementById('resultsCount');
    },

    showState(stateName) {
        const states = ['loadingState', 'errorState', 'emptyState', 'noResultsState', 'resultsGrid'];

        states.forEach(state => {
            const element = this.elements[state];
            if (element) {
                element.classList.add('hidden');
            }
        });

        if (stateName && this.elements[stateName]) {
            this.elements[stateName].classList.remove('hidden');
        }
    },

    showLoading() {
        this.showState('loadingState');
        this.elements.pagination.classList.add('hidden');
    },

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.showState('errorState');
        this.elements.pagination.classList.add('hidden');
    },

    showEmpty() {
        this.showState('emptyState');
        this.elements.pagination.classList.add('hidden');
        this.elements.controlsBar.classList.add('hidden');
    },

    showNoResults() {
        this.showState('noResultsState');
        this.elements.pagination.classList.add('hidden');
        this.elements.controlsBar.classList.add('hidden');
    },

    renderMovies(movies) {
        this.showState('resultsGrid');

        this.elements.resultsGrid.innerHTML = '';

        movies.forEach(movie => {
            const card = this._createMovieCard(movie);
            this.elements.resultsGrid.appendChild(card);
        });
    },

    _createMovieCard(movie) {
        const card = document.createElement('article');
        card.className = 'movie-card';
        card.setAttribute('data-imdb-id', movie.imdbID);
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View details for ${movie.Title}`);

        const placeholderSvg = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
        <line x1="7" y1="2" x2="7" y2="22"></line>
        <line x1="17" y1="2" x2="17" y2="22"></line>
        <line x1="2" y1="12" x2="22" y2="12"></line>
      </svg>
    `;

        const hasPoster = movie.Poster && movie.Poster !== 'N/A';

        card.innerHTML = `
      <div class="movie-card_poster-wrapper">
        ${hasPoster
                ? `<img class="movie-card_poster" src="${movie.Poster}" alt="${this._escapeHtml(movie.Title)} poster" loading="lazy" referrerpolicy="no-referrer">`
                : `<div class="movie-card_poster-placeholder">${placeholderSvg}</div>`
            }
      </div>
      <div class="movie-card_info">
        <h2 class="movie-card_title">${this._escapeHtml(movie.Title)}</h2>
        <p class="movie-card_year">${movie.Year}</p>
      </div>
    `;

        const img = card.querySelector('.movie-card_poster');
        if (img) {
            img.addEventListener('error', () => {
                const wrapper = card.querySelector('.movie-card_poster-wrapper');
                wrapper.innerHTML = `<div class="movie-card_poster-placeholder">${placeholderSvg}</div>`;
            });
        }

        return card;
    },

    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    updatePagination(currentPage, totalPages) {
        if (totalPages <= 1) {
            this.elements.pagination.classList.add('hidden');
            return;
        }

        this.elements.pagination.classList.remove('hidden');
        this.elements.pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        this.elements.prevBtn.disabled = currentPage <= 1;
        this.elements.nextBtn.disabled = currentPage >= totalPages;
    },

    showControlsBar(totalResults) {
        this.elements.controlsBar.classList.remove('hidden');
        this.elements.resultsCount.textContent = `${totalResults.toLocaleString()} results`;
    },

    hideControlsBar() {
        this.elements.controlsBar.classList.add('hidden');
    },

    getResultsPerPage() {
        return parseInt(this.elements.perPageSelect.value, 10);
    },

    setSearchValue(value) {
        this.elements.searchInput.value = value;
    },

    getSearchValue() {
        return this.elements.searchInput.value;
    },

    showSearchIndicator(show) {
        if (show) {
            this.elements.searchIndicator.classList.remove('hidden');
        } else {
            this.elements.searchIndicator.classList.add('hidden');
        }
    },

    setButtonsDisabled(disabled) {
        this.elements.prevBtn.disabled = disabled;
        this.elements.nextBtn.disabled = disabled;
        this.elements.perPageSelect.disabled = disabled;
    },

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },

    showModalLoading() {
        const modal = document.getElementById('movieModal');
        const loading = document.getElementById('modalLoading');
        const content = document.getElementById('modalContent');

        modal.classList.remove('hidden');
        loading.classList.remove('hidden');
        content.classList.add('hidden');
        document.body.style.overflow = 'hidden';
    },

    showMovieDetails(movie) {
        const loading = document.getElementById('modalLoading');
        const content = document.getElementById('modalContent');

        document.getElementById('modalTitle').textContent = movie.Title || 'Unknown Title';
        document.getElementById('modalYear').textContent = movie.Year || '';
        document.getElementById('modalRated').textContent = movie.Rated && movie.Rated !== 'N/A' ? movie.Rated : '';
        document.getElementById('modalRuntime').textContent = movie.Runtime && movie.Runtime !== 'N/A' ? movie.Runtime : '';
        document.getElementById('modalPlot').textContent = movie.Plot && movie.Plot !== 'N/A' ? movie.Plot : 'No plot available.';
        document.getElementById('modalDirector').textContent = movie.Director && movie.Director !== 'N/A' ? movie.Director : 'Unknown';
        document.getElementById('modalActors').textContent = movie.Actors && movie.Actors !== 'N/A' ? movie.Actors : 'Unknown';
        document.getElementById('modalGenre').textContent = movie.Genre && movie.Genre !== 'N/A' ? movie.Genre : 'Unknown';
        document.getElementById('modalBoxOffice').textContent = movie.BoxOffice && movie.BoxOffice !== 'N/A' ? movie.BoxOffice : 'N/A';

        const posterImg = document.getElementById('modalPoster');
        const posterPlaceholder = document.getElementById('modalPosterPlaceholder');

        if (movie.Poster && movie.Poster !== 'N/A') {
            posterImg.src = movie.Poster;
            posterImg.alt = `${movie.Title} poster`;
            posterImg.classList.remove('hidden');
            posterPlaceholder.classList.add('hidden');

            posterImg.onerror = () => {
                posterImg.classList.add('hidden');
                posterPlaceholder.classList.remove('hidden');
            };
        } else {
            posterImg.classList.add('hidden');
            posterPlaceholder.classList.remove('hidden');
        }

        const ratingsContainer = document.getElementById('modalRatings');
        ratingsContainer.innerHTML = '';

        if (movie.Ratings && movie.Ratings.length > 0) {
            movie.Ratings.forEach(rating => {
                const ratingEl = document.createElement('div');
                ratingEl.className = 'modal_rating';

                let source = rating.Source;
                if (source === 'Internet Movie Database') source = 'IMDb';
                if (source === 'Rotten Tomatoes') source = 'RT';
                if (source === 'Metacritic') source = 'Meta';

                ratingEl.innerHTML = `
          <span class="modal_rating-value">${rating.Value}</span>
          <span class="modal_rating-source">${source}</span>
        `;
                ratingsContainer.appendChild(ratingEl);
            });
        }

        const imdbLink = document.getElementById('modalImdbLink');
        if (movie.imdbID) {
            imdbLink.href = `https://www.imdb.com/title/${movie.imdbID}/`;
            imdbLink.classList.remove('hidden');
        } else {
            imdbLink.classList.add('hidden');
        }

        loading.classList.add('hidden');
        content.classList.remove('hidden');
    },

    hideModal() {
        const modal = document.getElementById('movieModal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
};

