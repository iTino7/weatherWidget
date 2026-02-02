import { useCallback, useEffect, useState } from "react"
import type { Forecast } from "../types/forecastData"
import type { Weather } from "../types/weatherData"

function WeatherWidget() {
    const [weatherResponse, setWeatherResponse] = useState<Weather | null>(null)
    const [forecastResponse, setForecastResponse] = useState<Forecast | null>(null)
    

    const apiKey = import.meta.env.VITE_API_KEY

    const weatherData = useCallback(async (endpoint: string) => {
        try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/${endpoint}?q=Napoli,it&appid=${apiKey}`)
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(`HTTP error! status: ${response.status} ${errorData?.message ?? ""}`.trim())
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error(error)
        return null
    }
    }, [apiKey])

    function convertKelvinToCelsius(kelvin?: number) {
        return typeof kelvin === "number" ? `${Math.round(kelvin - 273.15)} °C` : "-"
    }

    function getWeatherIconUrl(icon?: string) {
        return icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : ""
    }

    console.log(weatherResponse)

    

    useEffect(() => {
        const loadWeather = async () => {
            const current = await weatherData("weather")
            const forecast = await weatherData("forecast")
            if (current) {
                setWeatherResponse(current as Weather)
            }
            if (forecast) {
                setForecastResponse(forecast as Forecast)
            }
        }
        loadWeather()
    }, [weatherData])
    
  return (
    <>
    <h1>Weather Widget</h1>
    <h2>Name: {forecastResponse?.city?.name}</h2>
    <h3>Graduazione: {convertKelvinToCelsius(weatherResponse?.main?.temp)}</h3>
    <h3>
        Icon:
        {weatherResponse?.weather[0]?.icon ? (
            <img
                src={getWeatherIconUrl(weatherResponse.weather[0].icon)}
                alt={weatherResponse.weather[0].description}
            />
        ) : (
            "-"
        )}
    </h3>
    </>
  )
}

export default WeatherWidget