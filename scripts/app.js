/** @format */

window.addEventListener("load", () => {
  let long;
  let lat;
  const locationTimezone = document.querySelector(".location-timezone");
  const temperatureDegree = document.querySelector(".temperature-degree");
  const temperatureDescription = document.querySelector(
    ".temperature-description"
  );
  const currentIcon = document.querySelector(".image-container");
  const temperatureSpan = document.querySelector(".temperature-span");
  const degreeSection = document.querySelector(".degree-section");
  const city = document.getElementById("city");
  const searchBtn = document.querySelector("button");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,daily&appid=059989eb536dd71e7c22b993c8263896`;
      fetch(api)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          let { temp } = data.current;
          const { main } = data.current.weather[0];
          const { icon } = data.current.weather[0];
          locationTimezone.textContent = data.timezone;
          let currentTemp = temp;
          currentTemp -= 273.15;
          temperatureDegree.textContent = currentTemp.toFixed(2);
          temperatureDescription.textContent = main;
          currentIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;

          degreeSection.addEventListener("click", () => {
            if (temperatureSpan.textContent === "°C") {
              let Ftemp = ((temp - 273.15) * 9) / 5 + 32;
              temperatureDegree.textContent = Ftemp.toFixed(2);
              temperatureSpan.textContent = "°F";
            } else {
              temperatureDegree.textContent = currentTemp.toFixed(2);
              temperatureSpan.textContent = "°C";
            }
          });
        });
    });
  }

  searchBtn.addEventListener("click", () => {
    if (city.value.trim() === "") {
      alert("wrong city name");
    } else {
      const api = `http://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=059989eb536dd71e7c22b993c8263896`;
      fetch(api)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          let { temp } = data.main;
          const { main } = data.weather[0];
          const { icon } = data.weather[0];
          locationTimezone.textContent = data.name;
          let currentTemp = temp;
          currentTemp -= 273.15;
          temperatureDegree.textContent = currentTemp.toFixed(2);
          temperatureDescription.textContent = main;
          currentIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;

          degreeSection.addEventListener("click", () => {
            if (temperatureSpan.textContent !== "°C") {
              let Ftemp = ((temp - 273.15) * 9) / 5 + 32;
              temperatureDegree.textContent = Ftemp.toFixed(2);
              temperatureSpan.textContent = "°F";
              console.log("this is farenhit");
            } else {
              temperatureDegree.textContent = currentTemp.toFixed(2);
              temperatureSpan.textContent = "°C";
              console.log("this is celcius");
            }
          });
        })
        .catch((error) => {
          alert("wrong city name");
          console.clear();
        });
    }
  });
});
