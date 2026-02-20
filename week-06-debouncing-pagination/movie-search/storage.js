const Storage = {
    KEYS: {
        LAST_SEARCH: 'movieApp_lastSearch',
        CACHED_RESULTS: 'movieApp_cachedResults'
    },

    saveLastSearch(searchTerm) {
        try {
            localStorage.setItem(this.KEYS.LAST_SEARCH, searchTerm);
        } catch (error) {
            console.warn('Could not save search term:', error);
        }
    },

    getLastSearch() {
        try {
            return localStorage.getItem(this.KEYS.LAST_SEARCH) || '';
        } catch (error) {
            return '';
        }
    },

    cacheResults(searchTerm, page, results) {
        try {
            const cacheKey = this._createCacheKey(searchTerm, page);
            const cacheData = {
                timestamp: Date.now(),
                results: results
            };
            sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Could not cache results:', error);
        }
    },

    getCachedResults(searchTerm, page) {
        try {
            const cacheKey = this._createCacheKey(searchTerm, page);
            const cached = sessionStorage.getItem(cacheKey);

            if (!cached) return null;

            const cacheData = JSON.parse(cached);
            const FIVE_MINUTES = 5 * 60 * 1000;

            if (Date.now() - cacheData.timestamp > FIVE_MINUTES) {
                sessionStorage.removeItem(cacheKey);
                return null;
            }

            return cacheData.results;
        } catch (error) {
            return null;
        }
    },

    clearCache() {
        try {
            const keysToRemove = [];
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && key.startsWith('movieApp_cache_')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => sessionStorage.removeItem(key));
        } catch (error) {
            console.warn('Could not clear cache:', error);
        }
    },

    _createCacheKey(searchTerm, page) {
        return `movieApp_cache_${searchTerm.toLowerCase().trim()}_p${page}`;
    }
};

