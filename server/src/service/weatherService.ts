import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: string;
  lon: string;
}
// TODO: Define a class for the Weather object
interface Weather {
  city: string, 
  date: string, 
  icon: string, 
  iconDescription: string, 
  tempF: string, 
  windSpeed: string, 
  humidity: string

}


// TODO: Complete the WeatherService class

class WeatherService {
 // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;

  private apiKey?: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';

    this.apiKey = process.env.API_KEY || '';
  }
  
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {

    try {
      const response = await fetch(
        `${this.baseURL}/data/2.5/forecast?q=${query}&appid=${this.apiKey}`
      );

      const weatherData = await response.json();
      return weatherData;

    } catch (err) {
      console.log('Error:', err);
      return err;
    }


  }
  
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    let locationCoordinates: Coordinates = {
      lat: locationData.lat,
      lon: locationData.lon,
    } 
    return locationCoordinates;
  }
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  
   private buildWeatherQuery(coordinates: Coordinates): string {
    let fetchWCoordinates = `api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`
    return fetchWCoordinates;
   }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(query: string) {


    let locationData = await this.fetchLocationData(query);
    let locationCoordinates = this.destructureLocationData(locationData);
    return locationCoordinates;
  }
  // TODO: Create fetchWeatherData method
   private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const weatherData = await response.json();
    return weatherData;

   }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    let weatherObject: Weather = {
      city: response.city,
      date: response.date,
      icon: response.icon,
      iconDescription: response.iconDescription,
      tempF: response.tempF,
      windSpeed: response.windSpeed,
      humidity: response.humidity,

    }
    return weatherObject;

  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray: Weather[]  = weatherData.map((response) => {
      currentWeather = this.parseCurrentWeather(response);
      return currentWeather;
    })
    return forecastArray;
  }
  
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {

    let locationCoordinates: Coordinates = await this.fetchAndDestructureLocationData(city);
    let weatherData = await this.fetchWeatherData(locationCoordinates);
    let currentWeather = this.parseCurrentWeather(weatherData);
    let forecastArray = this.buildForecastArray(currentWeather, weatherData);
    return forecastArray;
  }
}

export default new WeatherService();
