// Grab all HTML elements and initialize events.

const cityInput = document.getElementById("input-city");

const cityElement = document.getElementById("city");

const mainIconElement = document.getElementById("main-icon");

const temperatureElement = document.getElementById("temperature");

const dateElement = document.getElementById("current-day");

const descriptionElement = document.getElementById("description");

const humidityElement = document.getElementById("humidity");

const windElement = document.getElementById("wind");

const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", search);

const celsiusLink = document.getElementById("celsius");
celsiusLink.addEventListener("click", convertToCelsius);

const fahrenheitLink = document.getElementById("fahrenheit");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

mainIconElement.setAttribute("src", "http://openweathermap.org/img/wn/10d@2x.png") 



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

// Sends a request to the API, asking for a temperature in city that is
// currently filled out in `cityInput` element.
function search(event) {
  event.preventDefault();
  sendApiRequest(cityInput.value, onCityInformationUpdated);
}

// function getLocalizationAndSearch(event) {
//   event.preventDefault();
//   navigator.geolocation.getCurrentPosition(onPositionObtained);
// }

// function onPositionObtained(position) {
//   sendApiRequestByCoords(position.coords, onCityInformationUpdated);
// }

// Sends an API request, asking for weather in `cityName`.
// After the request completes, it will call function `userCallback`
// with the object containing the weather information.
function sendApiRequest(cityName, userCallback) {
  const apiKey = "89a9c36cd107591e242e50cb3a76a2e4";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  axios
    .get(url)
    .then((response) => response.data)
    .then(userCallback);
}

// After the request completes, it will call function `userCallback`
// with the object containing the weather information.
// function sendApiRequestByCoords(coords, userCallback) {
//   const apiKey = "89a9c36cd107591e242e50cb3a76a2e4";
//   const url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric&lat=${coords.latitude}&lon=${coords.longitude}`;

//   axios
//     .get(url)
//     .then((response) => response.data)
//     .then(userCallback);
// }

// All the information about selected city.
let cityInformation = null;

function onCityInformationUpdated(data) {
  cityInformation = data;

  displayCity(data);
  displayWeather(data);
  displayTime(data);
  displayDescription(data);
  displayWind(data);
  displayHumidity(data);
  


  // coś jeszcze?
}

function convertToFahrenheit(event) {
  event.preventDefault();

  temperatureElement.innerHTML =
    Math.round((cityInformation.main.temp * 9) / 5 + 32) + " °F";
}

function convertToCelsius(event) {
  event.preventDefault();

  temperatureElement.innerHTML = Math.round(cityInformation.main.temp) + " °C";
}

function displayWeather(data) {
  let temperature = Math.round(data.main.temp);

  temperatureElement.innerText = `${temperature}` + " °C";
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

function displayHumidity(data) {
    humidityElement.innerText = data.main.humidity;
}

// function displayPrecipitation(data) {
//     precipitationElement.innerText = data.
// }



function displayTime(data) {
  const shiftFromUTCInSeconds = data.timezone; // How much time off we are from UTC.

  // TODO: figure out how to convert the time to UTC and apply the shif.
  // TODO: wind speed, precipitation, weather description, and weather icon are mandatory
// TODO: poprawić style
  dateElement.innerText = formatDate(new Date());
}

// navigator.geolocation.getCurrentPosition(onPositionObtained);



