// ----------------------------
// API Configuration Section
// ----------------------------

// OpenWeatherMap API configuration
const API_KEY = import.meta.env.VITE_API_KEY; // Environment variable for API key
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; // Unsplash API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/'; // Base URL for weather API

// ----------------------------
// DOM Element Selection
// ----------------------------

// Input elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn');

// Display Elements
const recentSearches = document.getElementById('recentSearches');
const weatherContainer = document.getElementById('weatherContainer');
const weatherResult = document.getElementById('weatherResult');
const locationEle = document.getElementById('location');
const dateEle = document.getElementById('date');
const temperatureEle = document.getElementById('temperature');
const weatherConditionEle = document.getElementById('weatherCondition');
const weatherIconEle = document.getElementById('weatherIcon');
const windSpeedEle = document.getElementById('windSpeed');
const humidityEle = document.getElementById('humidity');
const visibilityEle = document.getElementById('visibility')
const forecastContainer = document.getElementById('forecastContainer');
const forecastSection= document.getElementById('forecastSection');
const clearBtn = document.getElementById('clearAllButton');


// ----------------------------
// Event Listeners
// ----------------------------

// Handle Enter key in city input
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeatherByCity(cityInput.value);
    }
});

// Search button click handler
searchBtn.addEventListener('click', () => fetchWeatherByCity(cityInput.value));

// Current location button handler
currentLocationBtn.addEventListener('click', fetchWeatherByLocation);

// Load recent searches on page load
window.addEventListener('load', updateRecentSearches);

// Add event listener for clear all button (add this at bottom with other event listeners)
clearBtn.addEventListener('click', clearAllRecentSearches);


// ----------------------------
// Core Weather Functions
// ----------------------------


// Fetch weather data  by city name

async function fetchWeatherByCity(city){
     // Trim and validate input
     city.trim();
     cityInput.value = '';
        
     // Check for empty input
     if (!city) {
         alert("Please enter a city name");
         return;
     }

     // Check minimum length
     if (city.length < 2) {
         alert("City name should be at least 2 characters long");
         return;
     }

     // Check for numbers in city name
     if (/\d/.test(city)) {
         alert("City names shouldn't contain numbers");
         return;
     }

    try{
        // Show loading state
        searchBtn.disabled = true;
        searchBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Searching';

        // API response
        const response = await fetch(`${BASE_URL}weather?q=${city}&units=metric&appid=${API_KEY}`);
        if (!response.ok) throw new Error("City not found");

        // Process response
        const data = await response.json();
        updateWeatherUI(data);
        saveRecentSearch(city);
    } catch(error) {
        // Error handling and user feedback
        let userMessage = 'City not found - please check spelling';
        alert(userMessage);
        cityInput.focus();
    } finally {
        // Reset button state
        searchBtn.disabled = false;
        searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Search';
    }
}


// fetch weather by current location
async function fetchWeatherByLocation() {
    if(!navigator.geolocation){
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (location) => {
        const { latitude, longitude} = location.coords;
        try{
            const response = await fetch(`${BASE_URL}weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
            if(!response.ok) throw new Error('location data unavailable');
            const data = await response.json();
            updateWeatherUI(data);
            saveRecentSearch(data.name)
        } catch (error){
            alert(error.message);
        }
    }, () => {
        alert('Unable to retrieve location.');
        });
}

// Update UI with weather data

function updateWeatherUI(data){
    // Get weather condition from API response
    const condition = data.weather[0].main;

    // Set dynamic background
    setWeatherBackground(condition);

    const currentDate = new Date(data.dt * 1000).toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'short'
    });
    weatherContainer.classList.remove('hidden');
    weatherResult.classList.remove('hidden');

    locationEle.textContent = `${data.name}, ${data.sys.country}`;
    dateEle.textContent = currentDate
    temperatureEle.textContent =  `${data.main.temp}°C`;
    weatherConditionEle.textContent = data.weather[0].description;
    weatherIconEle.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    windSpeedEle.textContent = data.wind.speed;
    humidityEle.textContent = data.main.humidity;
    visibilityEle.textContent = (data.visibility/1000).toFixed(1);
    fetchForecast(data.coord.lat, data.coord.lon);

    weatherContainer.classList.add('lg:animate-slideIn');
    weatherContainer.offsetHeight; // Trigger reflow
    
    weatherContainer.classList.remove('hidden');
    weatherContainer.classList.add('lg:block');
};


// ----------------------------
// Forecast Functions
// ----------------------------

// Fetch 5-day forecast
// lat - Latitude
// lon - Longitude
async function fetchForecast(lat, lon){
    try{
        const response = await fetch(`${BASE_URL}forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
        if (!response.ok) throw new Error('Forecast data unavailable');
        const data = await response.json();
        updateForecastUI(data.list);
    } catch(error){
        alert(error.message);
    }
}

// Update UI with forecast data
// forecastList - List of forecast data points

function updateForecastUI(forecastList) {
    forecastContainer.classList.remove('hidden');
    forecastSection.classList.remove('hidden');


    // Group forecast by date
    const forecastByDate = {};
    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        if(!forecastByDate[date]) forecastByDate[date] = [];
        forecastByDate[date].push(forecast);
    });

    // Get dates starting from tomorrow
    const dates = Object.keys(forecastByDate).slice(1, 6);

    const forecastDivs = ["day1", "day2", "day3", "day4", "day5"];
    
    forecastDivs.forEach((id, index) => {
        const dateForecasts = forecastByDate[dates[index]];
        if(!dateForecasts) return;

        // Get midday forecast or first available
        const forecast = dateForecasts.find(f => {
            const hours = new Date(f.dt * 1000).getHours();
            return hours === 12;
        }) || dateForecasts[0];

        const dayElement = document.getElementById(id);
        dayElement.classList.remove('hidden');
        dayElement.innerHTML = `
            <p class="text-sm font-medium text-gray-950">
                ${new Date(forecast.dt * 1000).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short'
                })}
            </p>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" 
                class="mx-auto my-1 w-12 h-12">
            <p class="text-lg font-semibold">${Math.round(forecast.main.temp)}°C</p>
            <div class="flex flex-col items-center gap-1 w-full">
                <div class="flex items-center justify-center gap-1 w-full">
                    <i class="fa-solid fa-wind text-sm"></i>
                    <span class="text-sm">${Math.round(forecast.wind.speed)} km/h</span>
                </div>
            
                <div class="flex items-center justify-center gap-1 w-full">
                    <i class="fa-solid fa-droplet text-sm"></i>
                    <span class="text-sm">${forecast.main.humidity}%</span>
                </div>
            </div>
            <p class="text-sm font-medium text-gray-950 capitalize">${forecast.weather[0].description}</p>
        `;
    });
}

// ----------------------------
// Recent Searches Management
// ----------------------------

// Save recent searches in local storage
// City- city name to save
function saveRecentSearch(city) {
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];

    const normalizedCity = city.trim().toLowerCase();

    const exists = searches.some(existing => existing.trim().toLowerCase() === normalizedCity);

    if (!exists) {
        const formattedCity = city.trim().split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        searches.unshift(formattedCity);
        if(searches.length > 8){
            searches = searches.slice(0, 8);
        }
        localStorage.setItem('recentSearches', JSON.stringify(searches));
        updateRecentSearches();
    }
}

// Update recent searches dropdown
function updateRecentSearches() {
    recentSearches.innerHTML = '';
    const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    searches.forEach(city => {
        const li = document.createElement('li');
        li.className = 'relative group';
        li.innerHTML = `
            <button class="w-full p-3 pr-10 text-left rounded-lg bg-gray-50/50 hover:bg-blue-200/50 backdrop-blur-sm transition-colors duration-200 flex items-center justify-between cursor-pointer border border-blue-300/70">
                <span>${city}</span>
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-arrow-rotate-left ml-2 text-blue-500"></i>
                    <button class="clear-single-btn absolute right-3 top-1/2 -translate-y-1/2 opacity-80 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </button>
        `;
        li.addEventListener('click', () => fetchWeatherByCity(city));

         // Clear single search handler
         li.querySelector('.clear-single-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            clearSingleSearch(city);
        });


        recentSearches.appendChild(li);
    });
}

// Clear all search
function clearAllRecentSearches() {
    localStorage.removeItem('recentSearches');
    updateRecentSearches();
}

// Clear single search
function clearSingleSearch(cityToRemove) {
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    searches = searches.filter(city => city !== cityToRemove);
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    updateRecentSearches();
}


// ----------------------------
// Background Image Handling
// ----------------------------

// Fetches weather-themed background image from Unsplash
// condition - Weather condition keyword

async function getWeatherBackground(condition) {
    try {
        const response = await fetch(
            `https://api.unsplash.com/photos/random?query=${condition}+weather&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&w=1920&h=1080&content_filter=high&collections=893395`
        );

        
        if (!response.ok) throw new Error('Failed to fetch background');
        
        const data = await response.json();
        return data.urls.full;
        
    } catch (error) {
        console.error('Unsplash error:', error);
        return `./img/Weather/Clouds.jpg`; // Fallback
    }
}

// Sets background image based on weather condition
// condition - Weather condition keyword
async function setWeatherBackground(condition) {
    try {
        const imageUrl = await getWeatherBackground(condition);
        document.body.style.backgroundImage = `url(${imageUrl})`;

    } catch (error) {
        console.error('Failed to set background:', error);
        document.body.style.backgroundImage = 'url(./img/Weather/Clouds.jpg)';
    }
}


