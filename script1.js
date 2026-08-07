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

let cityInput = 'Siwan';

function dayOfTheWeek(day, month, year) {
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekday[new Date(`${year}-${month}-${day}`).getDay()];
}

function applyWeatherStyles(code, timeOfDay) {
    let backgroundImage = 'clear.jpg';
    let buttonColor = '#e5ba92';

    if (code === 1000) {
        backgroundImage = 'clear.jpg';
        buttonColor = timeOfDay === 'night' ? '#181e27' : '#e5ba92';
    } else if ([1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282].includes(code)) {
        backgroundImage = 'cloudy.jpg';
        buttonColor = timeOfDay === 'night' ? '#181e27' : '#fa6d1b';
    } else if ([1063, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(code)) {
        backgroundImage = 'rainy.jpg';
        buttonColor = timeOfDay === 'night' ? '#325c80' : '#647d75';
    } else {
        backgroundImage = 'snow.jpg';
        buttonColor = timeOfDay === 'night' ? '#1b1b1b' : '#4d72aa';
    }

    app.style.backgroundImage = `url(${backgroundImage})`;
    btn.style.background = buttonColor;
}

function fetchWeatherData() {
    app.style.opacity = '0';

    fetch(`https://api.weatherapi.com/v1/current.json?key=3477bdf0ee5b41a4b4f125649231112&q=${cityInput}`)
        .then((response) => response.json())
        .then((data) => {
            temp.innerHTML = `${data.current.temp_c}&#176;`;
            conditionOutput.innerHTML = data.current.condition.text;

            const dateValue = data.location.localtime;
            const year = parseInt(dateValue.substr(0, 4), 10);
            const month = parseInt(dateValue.substr(5, 2), 10);
            const day = parseInt(dateValue.substr(8, 2), 10);
            const time = dateValue.substr(11);

            dateOutput.innerHTML = `${dayOfTheWeek(day, month, year)} ${day},${month} ${year}`;
            timeOutput.innerHTML = time;
            nameOutput.innerHTML = data.location.name;

            const iconId = data.current.condition.icon.substring('//cdn.weatherapi.com/weather/64x64'.length);
            icon.src = `./icon/${iconId}`;

            cloudOutput.innerHTML = `${data.current.cloud}%`;
            humidityOutput.innerHTML = `${data.current.humidity}%`;
            windOutput.innerHTML = `${data.current.wind_kph}km/h`;

            const timeOfDay = data.current.is_day ? 'day' : 'night';
            applyWeatherStyles(data.current.condition.code, timeOfDay);
            app.style.opacity = '1';
        })
        .catch(() => {
            alert('City not found, please try again.');
            app.style.opacity = '1';
        });
}

cities.forEach((city) => {
    city.addEventListener('click', () => {
        cityInput = city.innerHTML;
        fetchWeatherData();
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (search.value.trim().length === 0) {
        alert('Please type a city name');
        return;
    }

    cityInput = search.value.trim();
    search.value = '';
    fetchWeatherData();
});

fetchWeatherData();
