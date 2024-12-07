const locationInput = document.getElementById("location");
const locationForm = document.getElementById("locationForm");
const currentDay = document.querySelector(".days .day:first-child");
const dayTwo = document.querySelector(".days .day:nth-child(2)");
const dayThree = document.querySelector(".days .day:nth-child(3)");
const navBtn = document.querySelector(".menu-button");
const navMenu = document.querySelector(".navbar nav ul");

async function getLocation() {
  try {
    await navigator.geolocation.getCurrentPosition(
      async (res) => {
        const lat = res.coords.latitude;
        const lng = res.coords.longitude;
        const data = await fetch(
          `https://us1.locationiq.com/v1/reverse.php?key=pk.1b8798a6da62ec19f141fd591e4a48c2&lat=${lat}&lon=${lng}&format=json`
        );
        if (!data) throw new Error("Something went wrong fetching the city.");
        const jsonData = await data.json();
        if (!jsonData.address) console.error(jsonData.error);
        displayResults(jsonData.address.city);
      },
      (res) => {
        console.error(res);
      }
    );
  } catch (err) {
    console.error(err.message ?? "Something went wrong");
  }
}

getLocation();

locationInput.addEventListener("input", (e) => {
  displayResults(e.target.value);
});

locationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  displayResults(locationInput.target.value);
});

async function displayResults(input) {
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=9b494687580b49b5a02155026230208&q=${input}&days=3&aqi=no&alerts=no`
    );
    if (!res.ok) throw new Error("Invalid city name");
    const data = await res.json();

    changeCurrentDay(data.current, data.location);
    changeDayTwoAndThree(data.forecast.forecastday[1], data.forecast.forecastday[2]);
  } catch (err) {
    console.error(err);
  }
}

function changeCurrentDay(currentDayData, location) {
  const date = new Date(currentDayData.last_updated);
  const directionsByDegree = ["north", "north east", "east", "south east", "south", "south west", "west", "north west"];

  currentDay.innerHTML = `
  <header>
  <p>${date.toLocaleDateString("en-us", { weekday: "long" })}</p>
  <span>${date.toString().slice(8, 10)} ${date.toLocaleDateString("en-us", { month: "long" })}</span>
</header>
<div class="content">
  <h3>${location.name}, ${location.country}</h3>
  <div>${currentDayData.temp_c}&deg;C<img src="${currentDayData.condition.icon}" alt="${
    currentDayData.condition.text
  }"/></div>
  <p>${currentDayData.condition.text}</p>
</div>
<footer>
  <ul>
    <li><i class="fa-solid fa-umbrella"></i> ${currentDayData.humidity}%</li>
    <li><i class="fa-solid fa-wind"></i>${currentDayData.wind_kph} km/h</li>
    <li><i class="fa-regular fa-compass"></i> ${
      directionsByDegree[Math.floor(((+currentDayData.wind_degree + 22.5) % 360) / 45)]
    }</li>
  </ul>
</footer>`;
}

function changeDayTwoAndThree(dayTwoData, dayThreeData) {
  const dayTwoDate = new Date(dayTwoData.date);
  const dayThreeDate = new Date(dayThreeData.date);

  dayTwo.innerHTML = ` <header>
  <p>${dayTwoDate.toLocaleDateString("en-us", { weekday: "long" })}</p>
</header>
<div class="content">
  <img src="${dayTwoData.day.condition.icon}" alt="${dayTwoData.day.condition.text}" />
  <div>${dayTwoData.day.maxtemp_c}&deg;C</div>
  <p class="mintemp"><span>${dayTwoData.day.mintemp_c}</span>&deg;</p>
  <p>Sunny</p>
</div>
</div>`;

  dayThree.innerHTML = ` <header>
  <p>${dayThreeDate.toLocaleDateString("en-us", { weekday: "long" })}</p>
</header>
<div class="content">
  <img src="${dayThreeData.day.condition.icon}" alt="${dayThreeData.day.condition.text}" />
  <div>${dayThreeData.day.maxtemp_c}&deg;C</div>
  <p class="mintemp"><span>${dayThreeData.day.mintemp_c}</span>&deg;</p>
  <p>Sunny</p>
</div>
</div>`;
}

navBtn.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});
