// Openweathermap API Key
// import { API_KEY } from "./config.js";
// import { UNSPLASH_ACCESS_KEY } from "./config.js";

const API_KEY = import.meta.env.VITE_API_KEY;
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

// const WEATHER_COLLECTIONS = '893395'; 
// Storm Chasing, Dramatic Skies, Weather Patterns, Weather.
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

// Selecting elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn');
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


cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeatherByCity(cityInput.value);
    }
});

// fetch weather by city name
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
        searchBtn.disabled = true;
searchBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Searching';
        const response = await fetch(`${BASE_URL}weather?q=${city}&units=metric&appid=${API_KEY}`);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        updateWeatherUI(data);
        saveRecentSearch(city);
    } catch(error) {
        let userMessage = 'City not found - please check spelling';
        alert(userMessage);
        cityInput.focus();
    } finally {
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


// Fetch 7-day forecast
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
function updateForecastUI(forecastList) {
    forecastContainer.classList.remove('hidden');
    forecastSection.classList.remove('hidden');

    const forecastDivs = ["day1", "day2", "day3", "day4", "day5"];
    
    forecastDivs.forEach((id, index) => {
        const forecastIndex = index * 8; // Get data for every 24 hours
        if (forecastIndex >= forecastList.length) return;
        
        const forecast = forecastList[forecastIndex];

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

// Save recent searches in local storage
function saveRecentSearch(city) {
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    if (!searches.includes(city)) {
        searches.unshift(city);
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
        li.innerHTML = `
            <button class="w-full p-3 text-left rounded-lg bg-gray-50/50 hover:bg-blue-200/50 backdrop-blur-sm transition-colors duration-200 flex items-center justify-between cursor-pointer border border-blue-300/70">
                <span>${city}</span>
                <i class="fa-solid fa-arrow-rotate-left ml-2 text-blue-500"></i>
            </button>
        `;
        li.addEventListener('click', () => fetchWeatherByCity(city));
        recentSearches.appendChild(li);
    });
}


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

async function setWeatherBackground(condition) {
    try {
        const imageUrl = await getWeatherBackground(condition);
        document.body.style.backgroundImage = `url(${imageUrl})`;

    } catch (error) {
        console.error('Failed to set background:', error);
        document.body.style.backgroundImage = 'url(./img/Weather/Clouds.jpg)';
    }
}


//event listerner
searchBtn.addEventListener('click', () => fetchWeatherByCity(cityInput.value));
currentLocationBtn.addEventListener('click', fetchWeatherByLocation);
window.addEventListener('load', updateRecentSearches); 