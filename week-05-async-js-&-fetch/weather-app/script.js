const CONFIG = {
    API_KEY: 'd06e5cfe78577f6ad7dc6c57c9c622b5',

    BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
    ICON_URL: 'https://openweathermap.org/img/wn',

    UNITS: 'metric', // 'metric' for Celsius, 'imperial' for Fahrenheit
};


const elements = {
    searchForm: document.getElementById('search-form'),
    cityInput: document.getElementById('city-input'),
    searchBtn: document.getElementById('search-btn'),
    btnText: document.querySelector('.btn-text'),
    btnLoader: document.querySelector('.btn-loader'),
    locationBtn: document.getElementById('location-btn'),

    // States
    initialState: document.getElementById('initial-state'),
    loadingState: document.getElementById('loading-state'),
    errorState: document.getElementById('error-state'),
    weatherCard: document.getElementById('weather-card'),

    // Error
    errorMessage: document.getElementById('error-message'),
    retryBtn: document.getElementById('retry-btn'),

    // Weather Data
    cityName: document.getElementById('city-name'),
    weatherIcon: document.getElementById('weather-icon'),
    tempValue: document.getElementById('temp-value'),
    weatherDescription: document.getElementById('weather-description'),
    feelsLike: document.getElementById('feels-like'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('wind-speed'),
    visibility: document.getElementById('visibility'),
};

let currentCity = '';

/**
 * Shows a specific state and hides all others
 * @param {'initial' | 'loading' | 'error' | 'success'} state 
 */
function showState(state) {
    elements.initialState.classList.add('hidden');
    elements.loadingState.classList.add('hidden');
    elements.errorState.classList.add('hidden');
    elements.weatherCard.classList.add('hidden');

    switch (state) {
        case 'initial':
            elements.initialState.classList.remove('hidden');
            break;
        case 'loading':
            elements.loadingState.classList.remove('hidden');
            break;
        case 'error':
            elements.errorState.classList.remove('hidden');
            break;
        case 'success':
            elements.weatherCard.classList.remove('hidden');
            break;
    }
}

/**
 * Toggles the button loading state
 * @param {boolean} isLoading 
 */
function setButtonLoading(isLoading) {
    elements.searchBtn.disabled = isLoading;
    elements.btnText.classList.toggle('hidden', isLoading);
    elements.btnLoader.classList.toggle('hidden', !isLoading);
}

/**
 * Fetches weather data for a city
 * @param {string} city - City name
 * @returns {Promise<Object>} - Weather data
 */
async function fetchWeatherData(city) {

    const url = `${CONFIG.BASE_URL}?q=${encodeURIComponent(city)}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`;

    const response = await fetch(url);

    if (!response.ok) {
        handleHttpError(response, city);
    }

    const data = await response.json();
    return data;
}

/**
 * Transforms raw API data to our format
 * @param {Object} data - Raw API response
 * @returns {Object} - Formatted weather data
 */
function formatWeatherData(data) {
    return {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        visibility: Math.round(data.visibility / 1000), // Convert m to km
    };
}

/**
 * Updates the weather card with data
 * @param {Object} weather - Formatted weather data
 */
function displayWeather(weather) {
    elements.cityName.textContent = `${weather.city}, ${weather.country}`;
    elements.weatherIcon.src = `${CONFIG.ICON_URL}/${weather.icon}@2x.png`;
    elements.weatherIcon.alt = weather.description;
    elements.tempValue.textContent = weather.temperature;
    elements.weatherDescription.textContent = weather.description;
    elements.feelsLike.textContent = `${weather.feelsLike}°C`;
    elements.humidity.textContent = `${weather.humidity}%`;
    elements.windSpeed.textContent = `${weather.windSpeed} km/h`;
    elements.visibility.textContent = `${weather.visibility} km`;
}

/**
 * Handles error by displaying message and showing error state
 * @param {string} message 
 */
function handleError(message) {
    elements.errorMessage.textContent = message;
    showState('error');
}

/**
 * Handles HTTP response errors with appropriate messages
 * @param {Response} response - The fetch response object
 * @param {string} [city] - Optional city name for context
 */
function handleHttpError(response, city = '') {
    switch (response.status) {
        case 401:
            throw new Error('Invalid API key. Please check your configuration.');
        case 404:
            throw new Error(city ? `City "${city}" not found. Please check the spelling.` : 'Location not found.');
        case 429:
            throw new Error('Too many requests. Please try again later.');
        default:
            throw new Error(`Failed to fetch weather data (${response.status})`);
    }
}

/**
 * Handles geolocation errors with appropriate messages
 * @param {GeolocationPositionError} error - The geolocation error object
 */
function handleGeolocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            handleError('Location permission denied. Please allow access to use this feature.');
            break;
        case error.POSITION_UNAVAILABLE:
            handleError('Location information is unavailable. Please try again later.');
            break;
        case error.TIMEOUT:
            handleError('Location request timed out. Please try again.');
            break;
        default:
            handleError('An unknown error occurred while fetching location.');
            break;
    }
}

/**
 * Main function to get weather for a city
 * @param {string} city 
 */
async function getWeather(city) {

    currentCity = city;

    showState('loading');
    setButtonLoading(true);

    try {
        const data = await fetchWeatherData(city);

        const weather = formatWeatherData(data);

        displayWeather(weather);
        showState('success');

    } catch (error) {
        handleError(error.message);
    } finally {
        setButtonLoading(false);
    }
}

async function getweatherByCoords(position) {
    const { latitude, longitude } = position.coords;
    const url = `${CONFIG.BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            handleHttpError(response);
        }
        const data = await response.json();
        const weather = formatWeatherData(data);
        displayWeather(weather);
        showState('success');
    }
    catch (error) {
        handleError(error.message);
    }
}

// Form submission
elements.searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const city = elements.cityInput.value.trim();

    if (city) {
        getWeather(city);
    }
});

// Retry button
elements.retryBtn.addEventListener('click', () => {
    if (currentCity) {
        getWeather(currentCity);
    }
});

// location button
elements.locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getweatherByCoords, handleGeolocationError);
    } else {
        handleError('Geolocation is not supported by this browser.');
    }
})
