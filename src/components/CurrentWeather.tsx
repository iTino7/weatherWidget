import { Spinner } from "@/components/ui/spinner";
import type { CurrentWeatherProps } from "../types/forecastComponents";

function CurrentWeather({
  weatherResponse,
  forecastResponse,
  getWeatherIconUrl,
  convertKelvinToCelsius,
}: CurrentWeatherProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h3 className="text-7xl font-bold text-[#313A52] ml-[-15px]">
          {weatherResponse?.main?.temp != null ? (
            convertKelvinToCelsius(weatherResponse?.main?.temp)
          ) : (
            <Spinner className="size-8 text-[#313A52]" />
          )}
        </h3>
        <h2 className="text-[#D7D7DB]">
          {forecastResponse?.city?.name},{" "}
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
          <Spinner className="size-6 text-[#313A52]" />
        )}
      </div>
    </div>
  );
}

export default CurrentWeather;
