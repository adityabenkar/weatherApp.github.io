/** @format */
import { Api_Key } from "./api.js";
window.addEventListener("load", async () => {
  const location = document.querySelector(".location-timezone");
  const temperatureIcon = document.querySelector(".image-container");
  const degreeSection = document.querySelector(".degree-section");
  const temperatureDegree = document.querySelector(".temperature-degree");
  const temperatureSpan = document.querySelector(".temperature-span");
  const temperatureDescription = document.querySelector(
    ".temperature-description"
  );
  const searchCity = document.querySelector(".search-location__city");
  const searchBtn = document.querySelector(".search-location__btn");
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("disappear");
  }, 3000);

  async function fetchWeatherData(obj = {}) {
    const { lat, long, city } = obj;
    let api = city
      ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Api_Key}`
      : `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude={part}&appid=${Api_Key}`;
    try {
      const response = await fetch(api);
      const data = await response.json();
      if (data.cod === "404") {
        alert(data.message);
        console.clear();
        return;
      }

      const temperature = data?.current?.temp ?? data?.main?.temp;
      const weatherData = {
        temp: temperature,
        icon: data?.current?.weather?.[0]?.icon ?? data?.weather?.[0]?.icon,
        loc: data?.name ?? data?.timezone,
        desc:
          data?.current?.weather?.[0]?.description ??
          data?.weather?.[0]?.description,
        span: "°C",
      };
      renderWeatherdata(weatherData);
    } catch (err) {
      console.log(err.message);
    }
  }

  function renderWeatherdata({ temp, icon, loc, desc, span }) {
    let currentTemp = temp - 273.15;
    temperatureDegree.textContent = currentTemp.toFixed(2);
    temperatureIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    location.textContent = loc;
    temperatureDescription.textContent = desc;
    temperatureSpan.textContent = span;
  }

  degreeSection.addEventListener("click", () => {
    if (temperatureSpan.textContent === "°C") {
      let Ftemp = ((temperature - 273.15) * 9) / 5 + 32;
      temperatureDegree.textContent = Ftemp.toFixed(2);
      temperatureSpan.textContent = "°F";
    } else {
      let currentTemp = temperature - 273.15;
      temperatureDegree.textContent = currentTemp.toFixed(2);
      temperatureSpan.textContent = "°C";
    }
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      await fetchWeatherData({ lat, long });
    });
  }

  searchBtn.addEventListener("click", async () => {
    if (searchCity.value.trim() === " ") alert("wrong searchCity name");
    else await fetchWeatherData({ city: searchCity.value });
  });

  searchCity.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.keyCode === 13) searchBtn.click();
  });
});
