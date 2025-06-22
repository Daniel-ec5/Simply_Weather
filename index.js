

const weatherIcons = {
  Clear: "./images/sunny.svg",
  Clouds: "./images/cloudy.svg",
  Rain: "./images/rainy.svg",
  Drizzle: "./images/rainy.svg",
  Thunderstorm: "./images/thunder.svg",
  Snow: "./images/snowy.svg",
  Mist: "./images/fog.png",
  Smoke: "./images/fog.png",
  Haze: "./images/fog.png",
  Dust: "./images/rainy_sunny.svg",
  Fog: "./images/fog.png",
  Sand: "./images/sunny.svg",
  Ash: "./images/night.svg",
  Squall: "./images/windy.png",
  Tornado: "./images/windy.svg"

};
const template = document.getElementById("result-template");
let cityList=document.getElementById("cities");
fetch("https://raw.githubusercontent.com/lutangar/cities.json/refs/heads/master/cities.json")
.then(response => response.json())
.then(cities=>{
    cities.forEach(city => {
        let option = document.createElement("option");
        option.value = city.name;
        option.textContent = `${city.name}, ${city.country}`;
        cityList.appendChild(option);
    });
})
.catch(error => {
    console.error("Error fetching city data:", error);
    alert("The city Suggestion is not available at the moment. Please type it manually.");
    
});
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        template.style.display = "none";    
        const errorMessage = document.getElementById("error-message");
        errorMessage.style.display = "block";
        errorMessage.textContent = "Please enter a city name.";
    }
});
function fetchWeather(city) {
    const apiKey="f4b05b369e2c989f93629ed95f93c8ca";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error("City not found");
        }
        return response.json();
    })
    .then(data=>{
        const cont= document.getElementsByClassName("result-container")[0];
        let cityName = data.name;
        console.log(data);
        let temperature = data.main.temp;
        let weatherName = data.weather[0].main;
        let weatherIcon = weatherIcons[weatherName] || "./images/weather.svg"; // Default icon if not found
        let humidity = data.main.humidity + "%";
        let windSpeed = data.wind.speed + " m/s";
        let precipitation1=data.rain? data.rain["1h"] : 0;
        let precipitation2=data.snow? data.snow["1h"] : 0;
        let precipitation= precipitation1 + precipitation2;
        var result = template.cloneNode(true);
        result.id="";
        result.querySelector(".cityName").textContent = cityName;
        result.querySelector(".temperature").textContent = temperature + "°C";
        result.querySelector(".weatherName").textContent = weatherName;
        result.querySelector(".humidity").textContent ="Humidity: "+ humidity;
        result.querySelector(".wind").textContent = "Wind: " + windSpeed;
        result.querySelector(".precipitation").textContent ="Precipitation: "+ precipitation +"mm";      
        const today=new Date();
        result.querySelector(".day").textContent = today.toLocaleString('default', { weekday: 'long' });
        result.querySelector(".dateNumber").textContent = today.getDate();
        result.querySelector(".month").textContent = today.toLocaleString('default', { month: 'long'
        });
        result.querySelector(".hour").textContent = today.getHours() % 12 || 12; // Convert to
        result.querySelector(".ampm").textContent = today.getHours() >= 12 ? 'PM' : 'AM'; // Determine AM/PM
        result.querySelector(".weather-icon").src = weatherIcon;
        cont.insertBefore(result,cont.firstChild);

    })
    .catch(error=>{
        console.error("Error fetching weather data:", error);
        alert("Error fetching weather data " );
    });
    
}