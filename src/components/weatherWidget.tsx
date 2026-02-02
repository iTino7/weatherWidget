import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Forecast } from "../types/forecastData";
import type { Weather, Sys } from "../types/weatherData";

function WeatherWidget() {
  const [weatherResponse, setWeatherResponse] = useState<
    (Weather & Sys) | null
  >(null);
  const [forecastResponse, setForecastResponse] = useState<Forecast | null>(
    null
  );

  const apiKey = import.meta.env.VITE_API_KEY;

  const weatherData = useCallback(
    async (endpoint: string) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/${endpoint}?q=Napoli,it&appid=${apiKey}`
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `HTTP error! status: ${response.status} ${
              errorData?.message ?? ""
            }`.trim()
          );
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [apiKey]
  );

  function convertKelvinToCelsius(kelvin?: number) {
    return typeof kelvin === "number"
      ? `${Math.round(kelvin - 273.15)}°`
      : "-";
  }

  function getWeatherIconUrl(icon?: string) {
    return icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : "";
  }

  function getGradientClass(icon?: string) {
    const prefix = icon?.slice(0, 2);
    if (prefix === "01") {
      return "weather-gradient-sun";
    }
    if (prefix && ["02", "03", "04"].includes(prefix)) {
      return "weather-gradient-clouds";
    }
    if (prefix && ["09", "10"].includes(prefix)) {
      return "weather-gradient-rain";
    }
    return "";
  }

  useEffect(() => {
    const loadWeather = async () => {
      const current = await weatherData("weather");
      const forecast = await weatherData("forecast");
      if (current) {
        setWeatherResponse(current as Weather & Sys);
      }
      if (forecast) {
        setForecastResponse(forecast as Forecast);
      }
    };
    loadWeather();
  }, [weatherData]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6">
      <Card
        className={`w-full max-w-md rounded-2xl border-0 shadow-lg shadow-black/10 ${getGradientClass(
          weatherResponse?.weather[0]?.icon
        )}`.trim()}
      >
        <CardContent className="pl-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-7xl font-bold text-[#313A52] ml-[-15px]">
                {convertKelvinToCelsius(weatherResponse?.main?.temp)}
              </h3>
              <h2 className="text-[#D7D7DB]">
                {forecastResponse?.city?.name ?? weatherResponse?.name},{" "}
                {weatherResponse?.sys?.country}
              </h2>
            </div>
            <div className="flex items-center justify-end">
              {weatherResponse?.weather[0]?.icon ? (
                <img
                  className="h-20 w-20 sm:h-22 sm:w-22 lg:h-26 lg:w-26"
                  src={getWeatherIconUrl(weatherResponse.weather[0].icon)}
                  alt={weatherResponse.weather[0].description}
                />
              ) : (
                "-"
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default WeatherWidget;
