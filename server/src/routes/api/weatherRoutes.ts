import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/:city', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  try {
    const cityName = req.params.city;
    const weatherData = await WeatherService.getWeatherForCity(cityName);
      // TODO: save city to search history
    await HistoryService.addCity(cityName);
      
    res.json(weatherData);
    console.log(weatherData);
  } catch (err){
    console.log(err);
    res.status(500).json(err);

  }

});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const savedCities = await HistoryService.getCities();
    res.json(savedCities);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// * BONUS TODO: DELETE city from search history
//router.delete('/history/:id', async (req, res) => {});

export default router;
