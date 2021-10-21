//using the API from OpenWeather

//weather object
let weather = {
  apiKey: 'b8331ffa4ac5c9b570e4f6fa54cc579f',
  //purpose: fetch weather by city name
  fetchWeatherByCity: function (city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
    )
      .then((res) => {
        if (!res.ok) {
          alert('No weather info found');
          throw new Error('No weather found.');
        }
        return res.json();
      })
      .then((data) => this.displayWeather(data))
      .catch((err) => {
        console.log(err);
      });
  },
  //purpose: fetch weather by latitude and longitude info
  fetchWeatherByLocation: function (lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${this.apiKey}&lat=${lat}&lon=${lon}`
    )
      .then((res) => {
        if (!res.ok) {
          alert('No weather info found');
          throw new Error('No weather found.');
        }
        return res.json();
      })
      .then((data) => this.displayWeather(data))
      .catch((err) => {
        console.log(err);
      });
  },
  //display data after fetching
  displayWeather: function (data) {
    const { name, timezone } = data;
    const { icon, description } = data.weather[0];
    const { temp, temp_min, temp_max, humidity, pressure } = data.main;
    const { speed } = data.wind;
    const { country, sunrise, sunset } = data.sys;

    //timezone: Shift in seconds from UTC
    //modify from https://stackoverflow.com/questions/62690963/how-can-i-get-the-current-time-using-timezone-offset-using-moment-js
    const timezoneInMinutes = timezone / 60;
    const currentTime = moment().utcOffset(timezoneInMinutes).format('lll');

    //convert sunrise/sunset time, unix, UTC into the related local time
    const localSunrise = moment
      .unix(sunrise)
      .utcOffset(timezoneInMinutes)
      .format('LT');
    const localSunset = moment
      .unix(sunset)
      .utcOffset(timezoneInMinutes)
      .format('LT');
    document.querySelector('.time').innerText = 'As of ' + currentTime;
    document.querySelector('.city').innerText =
      'Weather in ' + name + ', ' + country;
    document.querySelector(
      '.icon'
    ).src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    document.querySelector('.description').innerText = description;
    document.querySelector('.temp').innerText = temp.toFixed(1) + '°C';
    document.querySelector('.temp-max').innerText =
      'H: ' + temp_max.toFixed(1) + '°C';
    document.querySelector('.temp-min').innerText =
      'L: ' + temp_min.toFixed(1) + '°C';
    document.querySelector('.humidity').innerText =
      'Humidity: ' + humidity + '%';
    document.querySelector('.wind').innerText =
      'Wind Speed: ' + speed + ' km/h';
    document.querySelector('.pressure').innerText =
      'Pressure: ' + pressure + ' hPa';
    document.querySelector('.sunrise span').innerText = localSunrise;
    document.querySelector('.sunset span').innerText = localSunset;
    document.querySelector('.weather').classList.remove('loading');
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
  },
  //processing search term from input form
  search: function () {
    let inputValue = document.querySelector('.search-bar').value;
    //console.log(inputValue);
    document.querySelector('.search-bar').value = '';

    if (!inputValue) {
      alert('Please enter a city name');
      return;
    }

    this.fetchWeatherByCity(inputValue);
  },
  //get user's current location and fetch data
  getLocation: function () {
    const message = document.querySelector('#message');

    // get the current user's position
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    // check if the Geolocation API is supported
    if (!navigator.geolocation) {
      message.textContent = 'Geolocation is not supported by this browser.';
      return;
    }

    // handle success for getting location
    function onSuccess(position) {
      const { latitude, longitude } = position.coords;
      //message.textContent = `Your current location is: (${latitude},${longitude})`;
      weather.fetchWeatherByLocation(latitude, longitude);
    }

    // handle error when getting location
    function onError() {
      message.textContent = `Sorry, failed to get your location.`;
    }
  },
};

document.querySelector('.weather-search').addEventListener('submit', (e) => {
  e.preventDefault();
  weather.search();
});

document
  .querySelector('.current-location-search button')
  .addEventListener('click', () => {
    weather.getLocation();
  });

// Modal Toggle
const toggleModal = () => {
  document.querySelector('.modal').classList.toggle('show-modal');
};

const windowOnClick = (e) => {
  if (e.target === document.querySelector('.modal')) {
    toggleModal();
  }
};

document.querySelector('.trigger').addEventListener('click', toggleModal);
document.querySelector('.close-button').addEventListener('click', toggleModal);
document.querySelector('.modal').addEventListener('click', windowOnClick);

//initial fetching when entering/refresing the website, default city: Vancouver
weather.fetchWeatherByCity('Vancouver');
