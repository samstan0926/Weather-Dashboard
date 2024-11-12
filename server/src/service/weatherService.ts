import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: string;
  lon: string;
}

// TODO: Define a class for the Weather object
interface Weather {
  city?: string;
  date: string;
  icon: string;
  tempF: string;
  windSpeed: string;
  humidity: string;
  iconDescription: string;


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
  /*private async fetchLocationData(query: string) {

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


  }*/

  // TODO: Create destructureLocationData method
  /* private destructureLocationData(locationData: Coordinates): Coordinates {
     
     let locationCoordinates: Coordinates = {
       lat: locationData.lat,
       lon: locationData.lon,
     } 
     return locationCoordinates;
   }*/
  // TODO: Create buildGeocodeQuery method
  //private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  private async fetchAndDestructureLocationData(query: string): Promise<any> {

    try {
      const response = await fetch(`${this.baseURL}/data/2.5/weather?q=${query}&appid=${this.apiKey}`);
      let locationData = await response.json();
      let lat = locationData.coord.lat;
      let lon = locationData.coord.lon;
      let locationCoordinates: Coordinates = {
        lat: lat,
        lon: lon,
      }
      return locationCoordinates;

    } catch (err) {
      console.log('Error:', err);
      return err;

    }

  };





  private buildWeatherQuery(coordinates: Coordinates): string {
    let fetchWCoordinates = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`
    return fetchWCoordinates;
  }
  // TODO: Create fetchAndDestructureLocationData method

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any>{
    try {
    let fetchURL = this.buildWeatherQuery(coordinates);
    const response = await fetch(fetchURL);
    const weatherData = await response.json();
    return weatherData;
  } catch (err) {
    console.log('Error:', err);
    return err;

  }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(currentWeatherData: any) {
    const date = new Date();


    let currentWeather: Weather = {

      city: currentWeatherData.name,
      date: date.toLocaleDateString(),
      icon: currentWeatherData.weather[0].icon,
      iconDescription: currentWeatherData.weather[0].description,
      tempF: currentWeatherData.main.temp,
      windSpeed: currentWeatherData.wind.speed,
      humidity: currentWeatherData.main.humidity,

    }
    
    return currentWeather;

  }
  private async buildCurrentWeatherQuery(coordinates: Coordinates) {
    try {
    let response = await fetch(`${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`)

    let currentWeatherData = await response.json();
    return currentWeatherData;
    } catch (err) {
      console.log('Error:', err);
      return err;
    }
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    let forecastArray: Weather[] = [currentWeather];
    function removeTime(date: string): string {
      return date.split(' ')[0];


    }
    function buildArray(weatherData: any): Weather[] {
      for (let i = 4; i <= weatherData.list.length; i += 8) {
        let forecastObject: Weather = {


          date: removeTime(weatherData.list[i].dt_txt),
          icon: weatherData.list[i].weather[0].icon,
          iconDescription: weatherData.list[i].weather[0].description,
          tempF: weatherData.list[i].main.temp,
          windSpeed: weatherData.list[i].wind.speed,
          humidity: weatherData.list[i].main.humidity,

        }

        forecastArray.push(forecastObject);

      }
      return forecastArray;
    }
    buildArray(weatherData);
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {

    let locationCoordinates: Coordinates = await this.fetchAndDestructureLocationData(city);
    let weatherData = await this.fetchWeatherData(locationCoordinates);
    let currentWeatherData = await this.buildCurrentWeatherQuery(locationCoordinates);
    let currentWeather: Weather = this.parseCurrentWeather(currentWeatherData);
    let forecastArray = this.buildForecastArray(currentWeather, weatherData);
    return forecastArray;
  }
}

export default new WeatherService();
