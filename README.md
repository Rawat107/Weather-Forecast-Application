# Weather Forecast Application

Live Demo: [Link](https://weather-forecast-app-bs2a.onrender.com)

A weather forecast application that provides real-time weather data with dynamic backgrounds. Built with HTML, Tailwind CSS, and Vanilla JavaScript. Its features include current weather conditions, 5-day forecast, recent search history, and location-based weather lookup.

## Documentation

For detailed development process, challenges faced, and technical deep dive:  
[View Full Documentation](https://github.com/Rawat107/Weather-Forecast-Application/blob/main/Weather%20Forecast%20Application%20Documentation.docx)

## Key Features

- Real-time weather data for any city worldwide
- 5-day weather forecast with hourly trends
- Dynamic background images based on current weather
- Recent search history with quick access
- Geolocation support for instant local weather
- Responsive design for all screen sizes

## Technologies Used

- OpenWeatherMap API (Weather data)
- Unsplash API (Background images)
- Vanilla JavaScript (ES6+)
- Tailwind CSS (Styling)
- Vite (Build tool)
- LocalStorage (Recent searches)

## Getting Started

### Prerequisites

- Node.js v16.x or higher
- npm v7.x or higher
- API keys from [OpenWeatherMap](https://openweathermap.org/api) and [Unsplash](https://unsplash.com/developers)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rawat107/weather-app.git
   cd weather-app
   ```
   
2. **Create environment file**
   Create a `.env` file in the root directory with the following content:

   ```env
   VITE_API_KEY="your_openweathermap_api_key_here"
   VITE_UNSPLASH_ACCESS_KEY="your_unsplash_access_key_here"
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```
   
4. **Run Tailwind CSS in watch mode** (in a separate terminal)
   ```bash
   npm run tw:watch

5. **Run the application**

   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

### Obtaining API Keys

1. **OpenWeatherMap API**

   - Register at [https://openweathermap.org/api](https://openweathermap.org/api)
   - Create an API key under your account settings
   - Free tier provides 60 calls/minute

2. **Unsplash API**
   - Register as developer at [https://unsplash.com/developers](https://unsplash.com/developers)
   - Create a new application
   - Get your Access Key from the application dashboard

## Usage

1. **Search by City**

   - Type city name in the search bar
   - Press Enter or click Search button
   - Valid examples: "London", "New York", "Tokyo"

2. **Current Location**

   - Click the location button
   - Grant browser permission for geolocation

3. **Recent Searches**

   - Previously searched cities appear below search bar
   - Click any item to reload its weather data

4. **Weather Display**
   - Current temperature and conditions
   - Wind speed, humidity, and visibility
   - 5-day forecast with temperature trends
   - Dynamic background matching weather conditions

## Troubleshooting

**Common Issues:**

- **Invalid API Keys**: Ensure keys are properly set in `.env`
- **CORS Errors**: Verify API endpoints are correct
- **Location Errors**: Check browser permissions
- **Missing Data**: Confirm internet connection

**Development Commands:**

- `npm run dev`: Start development server
- `npm run build`: Create production build
- `npm run start`: Locally preview production build

## License

This project is developed and maintained by [Vaibhav Rawat](https://github.com/Rawat107).

---

**Note:** This application requires an active internet connection for API calls and image loading. API usage is subject to OpenWeatherMap and Unsplash terms of service.

```

```
