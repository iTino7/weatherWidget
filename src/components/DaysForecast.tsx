import { Spinner } from "@/components/ui/spinner";
import type { DaysForecastProps } from "../types/forecastComponents";

function DaysForecast({
  forecastList = [],
  daysCount,
  getWeatherIconUrl,
  convertKelvinToCelsius,
}: DaysForecastProps) {
  const startDay = new Date();
  startDay.setHours(0, 0, 0, 0);
  startDay.setDate(startDay.getDate() + 1);

  const dayMs = 24 * 60 * 60 * 1000;
  const daySlots = Array.from({ length: daysCount }, (_, index) => {
    return new Date(startDay.getTime() + index * dayMs);
  });

  const getForecastForDay = (dayDate: Date) => {
    const dayStart = new Date(dayDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart.getTime() + dayMs);
    const targetNoon = new Date(dayStart);
    targetNoon.setHours(12, 0, 0, 0);

    const dayItems = forecastList.filter((item) => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate >= dayStart && itemDate < dayEnd;
    });

    if (dayItems.length === 0) {
      return null;
    }

    return dayItems.reduce((closest, item) => {
      const closestDiff = Math.abs(
        new Date(closest.dt * 1000).getTime() - targetNoon.getTime()
      );
      const itemDiff = Math.abs(
        new Date(item.dt * 1000).getTime() - targetNoon.getTime()
      );
      return itemDiff < closestDiff ? item : closest;
    });
  };

  return (
    <div className="flex flex-wrap justify-between pr-6 text-[#313A52]">
      {daySlots.map((day) => {
        const dayForecast = getForecastForDay(day);
        const dayLabel = day.toLocaleDateString("it-IT", {
          weekday: "short",
        });
        const key = day.toISOString().slice(0, 10);

        return (
          <div
            className="flex flex-col items-center justify-center rounded-xl bg-white/70 px-2 py-3"
            key={key}
          >
            {dayForecast ? (
              <>
                <span className="text-sm font-semibold">
                  {convertKelvinToCelsius(dayForecast.main?.temp)}
                </span>
                <img
                  className="h-8 w-8"
                  src={getWeatherIconUrl(dayForecast.weather[0]?.icon)}
                  alt={dayForecast.weather[0]?.description ?? "forecast"}
                />
                <span className="text-sm font-semibold capitalize">
                  {dayLabel}
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

export default DaysForecast;
