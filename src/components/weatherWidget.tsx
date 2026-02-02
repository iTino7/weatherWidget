import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CurrentWeather from "./CurrentWeather";
import DaysForecast from "./DaysForecast";
import HourlyForecast from "./HourlyForecast";
import type { Forecast } from "../types/forecastData";
import type { Weather, Sys } from "../types/weatherData";

function WeatherWidget() {
  const [weatherResponse, setWeatherResponse] = useState<
    (Weather & Sys) | null
  >(null);
  const [forecastResponse, setForecastResponse] = useState<Forecast | null>(
    null
  );
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => {
      setActiveIndex(carouselApi.selectedScrollSnap());
    };
    onSelect();
    carouselApi.on("select", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  const baseCardClassName = "w-full rounded-2xl border-0";
  const gradientClassName = getGradientClass(
    weatherResponse?.weather[0]?.icon
  );
  const cardClassName = `${baseCardClassName} ${gradientClassName}`.trim();

  const renderCardContent = (
    cardType: "current" | "hourly" | "daily"
  ) => {
    return (
      <CardContent className="pl-8">
        {cardType === "current" && (
          <CurrentWeather
            weatherResponse={weatherResponse}
            forecastResponse={forecastResponse}
            getWeatherIconUrl={getWeatherIconUrl}
            convertKelvinToCelsius={convertKelvinToCelsius}
          />
        )}
        {cardType === "hourly" && (
          <HourlyForecast
            forecastList={forecastResponse?.list}
            getWeatherIconUrl={getWeatherIconUrl}
            convertKelvinToCelsius={convertKelvinToCelsius}
            hoursCount={5}
          />
        )}
        {cardType === "daily" && (
          <DaysForecast
            forecastList={forecastResponse?.list}
            getWeatherIconUrl={getWeatherIconUrl}
            convertKelvinToCelsius={convertKelvinToCelsius}
            daysCount={5}
          />
        )}
      </CardContent>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md rounded-2xl carousel-shadow-bottom overflow-visible">
        <Carousel className="w-full" setApi={setCarouselApi}>
        <CarouselContent className="items-stretch">
          {(["current", "hourly", "daily"] as const).map((cardType, index) => (
            <CarouselItem
              className={`flex transition-opacity duration-300 ${
                index === activeIndex ? "opacity-100" : "opacity-50"
              }`}
              key={`weather-card-${index}`}
            >
              <Card
                className={
                  cardType === "hourly" || cardType === "daily"
                    ? baseCardClassName
                    : cardClassName
                }
              >
                {renderCardContent(cardType)}
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}

export default WeatherWidget;
