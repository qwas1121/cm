import { useState, useEffect } from "react";

const WeatherComponent = () => {
  const [weatherIcon, setWeatherIcon] = useState<string | null>(null);

  // ✅ 오늘 날짜 (`YYYY.MM.DD` 형식)
  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${String(
    today.getMonth() + 1
  ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`;

        try {
          const response = await fetch(url);
          const data = await response.json();

          // ✅ 날씨 코드 가져와서 아이콘 설정
          setWeatherIcon(getWeatherIcon(data.weather[0].icon));
        } catch (error) {
          console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
        }
      },
      (error) => {
        console.error("위치 정보를 가져올 수 없음:", error);
      }
    );
  }, []);

  // ✅ 날씨 코드 → 아이콘 변환 함수
  const getWeatherIcon = (iconCode: string): string => {
    const weatherIcons: { [key: string]: string } = {
      "01d": "☀️",
      "01n": "🌙",
      "02d": "🌤️",
      "02n": "☁️",
      "03d": "🌥️",
      "03n": "☁️",
      "04d": "☁️",
      "04n": "☁️",
      "09d": "🌧️",
      "09n": "🌧️",
      "10d": "🌦️",
      "10n": "🌧️",
      "11d": "⛈️",
      "11n": "⛈️",
      "13d": "❄️",
      "13n": "❄️",
      "50d": "🌫️",
      "50n": "🌫️",
    };
    return weatherIcons[iconCode] || "❓";
  };

  return (
    <p className="today_text">
      <span>Today is… {formattedDate} </span> {weatherIcon || "⏳"}
    </p>
  );
};

export default WeatherComponent;
