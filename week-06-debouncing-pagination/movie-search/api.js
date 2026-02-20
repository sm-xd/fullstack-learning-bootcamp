const API = {
    BASE_URL: 'https://www.omdbapi.com/',
    API_KEY: '25039a79', OMDB_PAGE_SIZE: 10,
    async searchMovies(searchTerm, page = 1) {
        if (!searchTerm || searchTerm.trim().length < 2) {
            return { error: 'Search term must be at least 2 characters' };
        }

        try {
            const url = new URL(this.BASE_URL);
            url.searchParams.append('apikey', this.API_KEY);
            url.searchParams.append('s', searchTerm.trim());
            url.searchParams.append('page', page);
            url.searchParams.append('type', 'movie');
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.Response === 'False') {
                return {
                    success: false,
                    error: data.Error || 'No movies found',
                    movies: [],
                    totalResults: 0
                };
            }

            return {
                success: true,
                movies: data.Search || [],
                totalResults: parseInt(data.totalResults, 10) || 0,
                currentPage: page
            };

        } catch (error) {
            console.error('API Error:', error);

            return {
                success: false,
                error: this._getErrorMessage(error),
                movies: [],
                totalResults: 0
            };
        }
    },

    async searchMoviesMultiPage(searchTerm, virtualPage = 1, resultsPerPage = 10) {
        const pagesNeeded = resultsPerPage / this.OMDB_PAGE_SIZE;
        const startOmdbPage = (virtualPage - 1) * pagesNeeded + 1;

        const pagesToFetch = [];
        for (let i = 0; i < pagesNeeded; i++) {
            pagesToFetch.push(startOmdbPage + i);
        }

        try {
            const promises = pagesToFetch.map(page =>
                this.searchMovies(searchTerm, page)
            );

            const results = await Promise.all(promises);

            const firstResult = results[0];
            if (!firstResult.success) {
                return firstResult;
            }

            const allMovies = results
                .filter(r => r.success)
                .flatMap(r => r.movies);

            return {
                success: true,
                movies: allMovies,
                totalResults: firstResult.totalResults,
                currentPage: virtualPage
            };

        } catch (error) {
            console.error('Multi-page fetch error:', error);
            return {
                success: false,
                error: this._getErrorMessage(error),
                movies: [],
                totalResults: 0
            };
        }
    },

    _getErrorMessage(error) {
        if (!navigator.onLine) {
            return 'No internet connection. Please check your network.';
        }
        if (error.message.includes('401')) {
            return 'Invalid API key. Please check your configuration.';
        }
        if (error.message.includes('429')) {
            return 'Too many requests. Please wait a moment.';
        }
        return 'Something went wrong. Please try again.';
    },

    async getMovieDetails(imdbId) {
        if (!imdbId) {
            return { success: false, error: 'No movie ID provided' };
        }

        try {
            const url = new URL(this.BASE_URL);
            url.searchParams.append('apikey', this.API_KEY);
            url.searchParams.append('i', imdbId);
            url.searchParams.append('plot', 'full');

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.Response === 'False') {
                return {
                    success: false,
                    error: data.Error || 'Movie not found'
                };
            }

            return {
                success: true,
                movie: data
            };

        } catch (error) {
            console.error('API Error:', error);
            return {
                success: false,
                error: this._getErrorMessage(error)
            };
        }
    },

    calculateTotalPages(totalResults, resultsPerPage = 10) {
        return Math.ceil(totalResults / resultsPerPage);
    }
};

