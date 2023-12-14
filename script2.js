const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');
let cityInput = "Siwan";

cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData();
        app.style.opacity = "0";
    });
});

form.addEventListener('submit', (e) => {
    if (search.value.trim() === "") {
        alert('Please type a city name');
    } else {
        cityInput = search.value.trim();
        fetchWeatherData();
        search.value = "";
        app.style.opacity = "0";
    }
    e.preventDefault();
});

function dayOfTheWeek(day, month, year) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekday[new Date(`${year}-${month}-${day}`).getDay()];
}

function applyWeatherStyles(code, timeOfDay) {
    const backgrounds = {
        '1000': 'clear.jpg',
        '1003': 'cloudy.jpg',
        '1063': 'rainy.jpg',
        // Add more conditions as needed
    };

    app.style.backgroundImage = `url(${backgrounds[code] || 'default.jpg'})`;

    btn.style.background = timeOfDay === "night" ? "#1b1b1b" : "#4d72aa";
}

function fetchWeatherData() {
    fetch(`http://api.weatherapi.com/v1/current.json?key=3477bdf0ee5b41a4b4f125649231112&q=${cityInput}`)
        .then(response => response.json())
        .then(data => {
            temp.innerHTML = `${data.current.temp_c}&#176;`;
            conditionOutput.innerHTML = data.current.condition.text;
            const date = new Date(data.location.localtime);
            dateOutput.innerHTML = `${dayOfTheWeek(date.getDate(), date.getMonth() + 1, date.getFullYear())} ${date.getDate()},${date.getMonth() + 1} ${date.getFullYear()}`;
            timeOutput.innerHTML = data.location.localtime.substr(11);
            nameOutput.innerHTML = data.location.name;
            icon.src = `./icon/${data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64".length)}`;
            cloudOutput.innerHTML = `${data.current.cloud}%`;
            humidityOutput.innerHTML = `${data.current.humidity}%`;
            windOutput.innerHTML = `${data.current.wind_kph}km/h`;

            let timeOfDay = data.current.is_day ? "day" : "night";
            applyWeatherStyles(data.current.condition.code, timeOfDay);

            app.style.opacity = "1";
        })
        .catch(() => {
            alert('City not found');
            app.style.opacity = "1";
        });
}

fetchWeatherData();
app.style.opacity = "1";
