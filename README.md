# What's Up? A Weather-app
A simple weather app featuring basic API fetch and async/await functions. Uses WeatherAPI. See the project live [here](https://coffeedevr.github.io/weather-app/), hosted by Github Pages.

## What does this app do?
Basically you search for a location and it shows the forecast for the day, along with humidity, precipitation and wind forecast. It also shows the location's timezone
and date and time. All data is pulled from WeatherAPI.

## Why did I made this project?
This project is a part of the Odin Project curriculum, and it serves as a practice for basic API fetch with async/await JS functions. Since this project also uses webpack, the index HTML is generated so all the elements are made using [JavaScript](src/assets/dom_interface.js).

## What improvements can you still make in this project?
* [Rewrite, or even remove my factory function for retrieving results from the API](src/weather_module.js) - I think I overdid this part because I want all the functions to stay in one place. I think it just added more [async redundancy](src/assets/index.js).
* Add a feature where it also shows the forecast for the next few days.
* Make it responsive on smaller screens.
