import type { Forecast } from "./forecastData";
import type { Weather, Sys } from "./weatherData";
import type { List } from "./forecastData";

export type CurrentWeatherProps = {
  weatherResponse: (Weather & Sys) | null;
  forecastResponse: Forecast | null;
  getWeatherIconUrl: (icon?: string) => string;
  convertKelvinToCelsius: (kelvin?: number) => string;
};

export type HourlyForecastProps = {
  forecastList?: List[];
  hoursCount: number;
  getWeatherIconUrl: (icon?: string) => string;
  convertKelvinToCelsius: (kelvin?: number) => string;
};

export type DaysForecastProps = {
  forecastList?: List[];
  daysCount: number;
  getWeatherIconUrl: (icon?: string) => string;
  convertKelvinToCelsius: (kelvin?: number) => string;
};
