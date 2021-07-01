/** @format */

window.addEventListener("load", async () => {
  let long;
  let lat;
  let locationTimezone = document.querySelector(".location-timezone");
  let temperatureDegree = document.querySelector(".temperature-degree");
  let temperatureDescription = document.querySelector(
    ".temperature-description"
  );
  const currentIcon = document.querySelector(".image-container");
  const temperatureSpan = document.querySelector(".temperature-span");
  const degreeSection = document.querySelector(".degree-section");
  const city = document.querySelector(".search-location__city");
  const searchBtn = document.querySelector(".search-location__btn");
  let temperature = 0;

  async function fetchWeatherData(obj = {}) {
    const { lat, long, city } = obj;
    let api = city
      ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=059989eb536dd71e7c22b993c8263896`
      : `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,daily&appid=059989eb536dd71e7c22b993c8263896`;
    try {
      const response = await fetch(api);
      const data = await response.json();
      if (data.cod === "404") throw new Error(data.message);

      temperature = data?.current?.temp ?? data?.main?.temp;
      const weatherData = {
        temp: temperature,
        type: data?.current?.weather?.[0]?.main ?? data?.weather?.[0]?.main,
        timezone:
          typeof data?.timezone === "string" ? data?.timezone : data?.name,
        icon: data?.current?.weather?.[0]?.icon ?? data?.weather?.[0]?.icon,
        span: "°C",
      };
      renderWeatherData(weatherData);
    } catch (error) {
      alert(error.message);
    }
  }

  function renderWeatherData({ temp, type, timezone, icon, span }) {
    locationTimezone.textContent = timezone;
    let currentTemp = temp - 273.15;
    temperatureDegree.textContent = currentTemp.toFixed(2);
    temperatureDescription.textContent = type;
    temperatureSpan.textContent = span;
    currentIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  degreeSection.addEventListener("click", () => {
    if (temperatureSpan.textContent === "°C") {
      let Ftemp = ((temperature - 273.15) * 9) / 5 + 32;
      temperatureDegree.textContent = Ftemp.toFixed(2);
      temperatureSpan.textContent = "°F";
    } else {
      const currentTemp = temperature - 273.15;
      temperatureDegree.textContent = currentTemp.toFixed(2);
      temperatureSpan.textContent = "°C";
    }
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      await fetchWeatherData({ lat, long });
    });
  }

  searchBtn.addEventListener("click", async () => {
    if (city.value.trim() === "") {
      alert("wrong city name");
    } else {
      await fetchWeatherData({ city: city.value });
    }
  });

  city.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.keyCode === 13) searchBtn.click();
  });
});
