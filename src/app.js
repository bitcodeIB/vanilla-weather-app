// Grab all HTML elements and initialize events.

const cityInput = document.getElementById("input-city");

const cityElement = document.getElementById("city");

const mainIconElement = document.getElementById("main-icon");

const temperatureElement = document.getElementById("temperature");

const dateElement = document.getElementById("current-day");

const descriptionElement = document.getElementById("description");

const humidityElement = document.getElementById("humidity");

const windElement = document.getElementById("wind");

const forecastElement = document.getElementById("forecast");

const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", search);

const localizationButton = document.getElementById("localization-button");
localizationButton.addEventListener("click", getLocalizationAndSearch);

const celsiusLink = document.getElementById("celsius");
celsiusLink.addEventListener("click", convertToCelsius);

const fahrenheitLink = document.getElementById("fahrenheit");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

// Sends a request to the API, asking for a temperature in city that is
// currently filled out in `cityInput` element.
function search(event) {
  event.preventDefault();
  sendApiRequest(cityInput.value, onCityInformationUpdated);
}

function getLocalizationAndSearch(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(onPositionObtained);
}

function onPositionObtained(position) {
  sendApiRequestByCoords(position.coords, onCityInformationUpdated);
}

function getDataFromResponse(response) {
  return response.data;
}

// Sends an API request, asking for weather in `cityName`.
// After the request completes, it will call function `userCallback`
// with the object containing the weather information.
function sendApiRequest(cityName, userCallback) {
  const apiKey = "89a9c36cd107591e242e50cb3a76a2e4";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  axios.get(url).then(getDataFromResponse).then(userCallback);
}

function sendApiRequestByCoords(coords, userCallback) {
  const apiKey = "89a9c36cd107591e242e50cb3a76a2e4";
  const url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric&lat=${coords.latitude}&lon=${coords.longitude}`;

  axios.get(url).then(getDataFromResponse).then(userCallback);
}

function getForecast(coordinates, userCallback) {
  const apiKey = "89a9c36cd107591e242e50cb3a76a2e4";
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(getDataFromResponse).then(userCallback);

  // test link
  // https://api.openweathermap.org/data/2.5/onecall?lat=47.6062&lon=-122.3321&appid=89a9c36cd107591e242e50cb3a76a2e4&units=metric
}

// All the information about selected city.
let cityInformation = null;

function onCityInformationUpdated(data) {
  // cityInformation = data;

  displayCity(data);
  displayWeather(data);
  displayTime(data);
  displayDescription(data);
  displayWind(data);
  displayHumidity(data);
  displayIcon(data);
  // Send another request to obtain the forecast
  getForecast(data.coord, displayForecast);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  temperatureElement.innerHTML = Math.round(
    (cityInformation.main.temp * 9) / 5 + 32
  );
}

function convertToCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  temperatureElement.innerHTML = Math.round(cityInformation.main.temp);
}

function displayWeather(data) {
  let temperature = Math.round(data.main.temp);

  temperatureElement.innerText = `${temperature}`;
}

function displayCity(data) {
  cityElement.innerText = data.name;
  cityInput.value = "";
}

function displayDescription(data) {
  descriptionElement.innerText = data.weather[0].description;
}

function displayWind(data) {
  windElement.innerText = data.wind.speed;
}

function displayIcon(data) {
  icon = data.weather[0].icon;
  mainIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${icon}@2x.png`
  );
}

function displayHumidity(data) {
  humidityElement.innerText = data.main.humidity;
}

function displayTime(data) {
  const shiftFromUTCInSeconds = data.timezone; // How much time off we are from UTC.

  // TODO: figure out how to convert the time to UTC and apply the shif.

  dateElement.innerText = formatDate(new Date());
}

function displayForecast(data) {
  console.log(data);
  let forecast = data.daily;
  console.log(forecast);

  let forecastHTML = `<div class="row">`;
  let days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  forecast.forEach(function (forecastDay, index) {
    // let i = 0
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
                  <div class="weather-forecast-date">${formatDay(
                    forecastDay.dt
                  )}</div>
                  <img
                    src="http://openweathermap.org/img/wn/${
                      forecastDay.weather[0].icon
                    }@2x.png"
                    class="forecast-icon"
                    alt=""
                  />
                  <div class="weather-forecast-temperatures">
                    <span class="temp-max">${Math.round(
                      forecastDay.temp.max
                    )}°</span>
                    <span class="temp-min">${Math.round(
                      forecastDay.temp.min
                    )}°</span>
                  </div>            
              </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

sendApiRequest("Warsaw", onCityInformationUpdated);
