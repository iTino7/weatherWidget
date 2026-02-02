import { Spinner } from "@/components/ui/spinner";
import type { HourlyForecastProps } from "../types/forecastComponents";

function HourlyForecast({
  forecastList = [],
  hoursCount,
  getWeatherIconUrl,
  convertKelvinToCelsius,
}: HourlyForecastProps) {
  const now = new Date();
  const startHour = new Date(now);
  startHour.setMinutes(0, 0, 0);
  const hourMs = 60 * 60 * 1000;
  const hourlySlots = Array.from({ length: hoursCount }, (_, index) => {
    return new Date(startHour.getTime() + (index + 1) * hourMs);
  });

  return (
    <div className="flex flex-wrap justify-between pr-6 text-[#313A52]">
      {hourlySlots.map((slot) => {
        const slotSeconds = Math.floor(slot.getTime() / 1000);
        const matchingForecast =
          forecastList.find((item) => item.dt >= slotSeconds) ??
          forecastList[forecastList.length - 1];
        const hourLabel = `${slot.getHours().toString().padStart(2, "0")}:00`;

        return (
          <div
            className="flex flex-col items-center justify-center rounded-xl bg-white/70 px-2 py-3"
            key={slotSeconds}
          >
            <span className="text-sm font-semibold">{hourLabel}</span>
            {matchingForecast ? (
              <>
                <img
                  className="h-8 w-8"
                  src={getWeatherIconUrl(matchingForecast.weather[0]?.icon)}
                  alt={matchingForecast.weather[0]?.description ?? "forecast"}
                />
                <span className="text-sm font-semibold">
                  {convertKelvinToCelsius(matchingForecast.main?.temp)}
                </span>
              </>
            ) : (
              <Spinner className="size-4 text-[#313A52]" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default HourlyForecast;
