import WeatherModule from './weather_module.js'
import './style.css'
import DOMInterface from './dom_interface'
import GitHubLogo from './assets/githublogo.png'
import Cloud from './assets/cloud.png'
import Rain from './assets/precipitation.png'
import { formatInTimeZone } from 'date-fns-tz'

const head = document.getElementsByTagName('head')
head[0].innerHTML += '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Alkatra&family=Didact+Gothic&family=Tilt+Neon&family=Yatra+One&display=swap" rel="stylesheet">'

const APIModule = (() => {
  // await search results
  async function showResults (event) {
    const input = event.target.value
    const results = await WeatherModule.search(input)
    generateDropdown(results.length, results)
  }

  // generate dropdown results under search
  async function generateDropdown (items, results) {
    if (items <= 0 || items === undefined) { return }
    const check = document.querySelector('datalist')
    if (check !== null) { document.querySelector('#search-wrapper').removeChild(check) }
    const datalist = document.createElement('datalist')
    datalist.setAttribute('id', 'place')
    // eslint-disable-next-line prefer-const
    for (let obj in results) {
      const item = document.createElement('option')
      item.setAttribute('value', results[obj].name + ', ' + results[obj].region)
      datalist.appendChild(item)
    }
    document.querySelector('#search-wrapper').appendChild(datalist)
  }

  // search api and get result
  async function getForecast () {
    const input = document.querySelector('#places').value
    const results = await WeatherModule.retrieveForecast(input)

    return results
  }

  async function getCurrent () {
    const input = document.querySelector('#places').value
    const results = await WeatherModule.retrieveCurrent(input)

    return results
  }

  return { showResults, generateDropdown, getForecast, getCurrent }
})()

const contentContainer = document.createElement('div')
contentContainer.setAttribute('id', 'content-container')
document.body.appendChild(contentContainer)

const searchContainer = document.createElement('div')
searchContainer.setAttribute('id', 'search-container')
contentContainer.appendChild(searchContainer)

DOMInterface.insertToById('search-container', DOMInterface.createElement('img', '', 'logo'))
document.querySelector('#logo').src = Cloud

const mainText = document.createElement('h1')
mainText.setAttribute('id', 'main-text')
mainText.textContent = "What's Up?"
searchContainer.appendChild(mainText)

// create search input
const searchWrapper = document.createElement('div')
searchWrapper.setAttribute('id', 'search-wrapper')
searchContainer.appendChild(searchWrapper)

const search = document.createElement('input')
search.setAttribute('id', 'places')
search.setAttribute('type', 'search')
search.setAttribute('list', 'place')
search.setAttribute('placeholder', 'Search city...')
searchWrapper.appendChild(search)
search.addEventListener('input', APIModule.showResults)
search.addEventListener('search', displayResults)

const searchIcon = document.createElement('button')
searchIcon.setAttribute('type', 'button')
searchIcon.setAttribute('id', 'search-button')
searchWrapper.appendChild(searchIcon)
searchIcon.addEventListener('click', displayResults)
DOMInterface.insertToById('search-container', DOMInterface.createElement('h2', '', 'result-name'))

// create footer
document.body.appendChild(DOMInterface.createElement('div', 'footer-container', ''))
const footerText = '© ' + new Date().getFullYear() + ' coffeedevr | '
DOMInterface.insertToByClass('footer-container', DOMInterface.createElement('p', '', 'footer-text'))
DOMInterface.insertTextContentById('footer-text', footerText)
DOMInterface.insertToByClass('footer-container', DOMInterface.createImgById('github-logo', GitHubLogo))

// display result
async function displayResults () {
  const search = document.querySelector('#places').value
  const current = await APIModule.getCurrent(search)
  const forecast = await APIModule.getForecast(search)
  DOMInterface.insertTextContentById('result-name', current.location.name + ', ' + current.location.region + '<br>' + current.location.country)

  document.querySelector('#weather-logo').src = current.current.condition.icon

  // left container
  DOMInterface.insertTextContentById('current-condition-name', current.current.condition.text)
  DOMInterface.insertTextContentById('current-temp-text', current.current.temp_c + '° C | ' + current.current.temp_f + '° F')
  DOMInterface.insertTextContentById('current-feeltemp-text', 'Feels like: <br>' + current.current.feelslike_c + '° C | ' + current.current.feelslike_f + '° F')

  // right container
  DOMInterface.insertTextContentById('current-preci-name', current.current.precip_mm + ' mm | ' + current.current.precip_in + ' in')
  DOMInterface.insertTextContentById('current-humi-text', current.current.humidity + '% Humidity')
  DOMInterface.insertTextContentById('current-wind-text', 'Wind: ' + current.current.wind_degree + '° ' + current.current.wind_dir + '<br>' + current.current.wind_kph + ' kph | ' + current.current.wind_mph + ' mph')

  // forecast 9:00
  for (let i = 9; i <= 18; i += 3) {
    DOMInterface.insertTextContentById('forecast-time-' + i, i + ':00')
    document.querySelector('#forecast-weather-logo-' + i).src = forecast.forecast.forecastday[0].hour[i].condition.icon
    DOMInterface.insertTextContentById('forecast-temp-' + i, forecast.forecast.forecastday[0].hour[i].temp_c + '° C | ' + forecast.forecast.forecastday[0].hour[i].temp_f + '° F')
    DOMInterface.insertTextContentById('forecast-preci-' + i, forecast.forecast.forecastday[0].hour[i].precip_mm + ' mm | ' + forecast.forecast.forecastday[0].hour[i].precip_in + ' in')
    DOMInterface.insertTextContentById('forecast-humi-' + i, forecast.forecast.forecastday[0].hour[i].humidity + '% Humidity')
    DOMInterface.insertTextContentById('forecast-wind-' + i, 'Wind: ' + forecast.forecast.forecastday[0].hour[i].wind_degree + '° ' + forecast.forecast.forecastday[0].hour[i].wind_dir + '<br>' + forecast.forecast.forecastday[0].hour[i].wind_kph + ' kph | ' + forecast.forecast.forecastday[0].hour[i].wind_mph + ' mph')
  }

  // // forecast 12:00
  // DOMInterface.insertTextContentById('forecast-time-two', '12:00 PM')
  // document.querySelector('#forecast-weather-logo-two').src = forecast.forecast.forecastday[0].hour[12].condition.icon
  // DOMInterface.insertTextContentById('forecast-temp-two', forecast.forecast.forecastday[0].hour[12].temp_c + '° C | ' + forecast.forecast.forecastday[0].hour[12].temp_f + '° F')
  // DOMInterface.insertTextContentById('forecast-preci-two', forecast.forecast.forecastday[0].hour[12].precip_mm + ' mm | ' + forecast.forecast.forecastday[0].hour[12].precip_in + ' in')
  // DOMInterface.insertTextContentById('forecast-humi-two', forecast.forecast.forecastday[0].hour[12].humidity + '% Humidity')
  // DOMInterface.insertTextContentById('forecast-wind-two', 'Wind: ' + forecast.forecast.forecastday[0].hour[12].wind_degree + '° ' + forecast.forecast.forecastday[0].hour[12].wind_dir + '<br>' + forecast.forecast.forecastday[0].hour[12].wind_kph + ' kph / ' + forecast.forecast.forecastday[0].hour[12].wind_mph + ' mph')

  //   // forecast 3:00

  //   DOMInterface.insertTextContentById('forecast-time-one', '3:00 PM')
  //   document.querySelector('#forecast-weather-logo-one').src = forecast.forecast.forecastday[0].hour[9].condition.icon
  //   DOMInterface.insertTextContentById('forecast-temp-one', forecast.forecast.forecastday[0].hour[9].temp_c + '° C | ' + forecast.forecast.forecastday[0].hour[9].temp_f + '° F')
  //   DOMInterface.insertTextContentById('forecast-preci-one', forecast.forecast.forecastday[0].hour[9].precip_mm + ' mm | ' + forecast.forecast.forecastday[0].hour[9].precip_in + ' in')
  //   DOMInterface.insertTextContentById('forecast-humi-one', forecast.forecast.forecastday[0].hour[9].humidity + '% Humidity')
  //   DOMInterface.insertTextContentById('forecast-wind-one', 'Wind: ' + forecast.forecast.forecastday[0].hour[9].wind_degree + '° ' + forecast.forecast.forecastday[0].hour[9].wind_dir + '<br>' + forecast.forecast.forecastday[0].hour[9].wind_kph + ' kph / ' + forecast.forecast.forecastday[0].hour[9].wind_mph + ' mph')

  //   // forecast 6:00
  //   DOMInterface.insertTextContentById('forecast-time-two', '6:00 PM')
  //   document.querySelector('#forecast-weather-logo-two').src = forecast.forecast.forecastday[0].hour[12].condition.icon
  //   DOMInterface.insertTextContentById('forecast-temp-two', forecast.forecast.forecastday[0].hour[12].temp_c + '° C | ' + forecast.forecast.forecastday[0].hour[12].temp_f + '° F')
  //   DOMInterface.insertTextContentById('forecast-preci-two', forecast.forecast.forecastday[0].hour[12].precip_mm + ' mm | ' + forecast.forecast.forecastday[0].hour[12].precip_in + ' in')
  //   DOMInterface.insertTextContentById('forecast-humi-two', forecast.forecast.forecastday[0].hour[12].humidity + '% Humidity')
  //   DOMInterface.insertTextContentById('forecast-wind-two', 'Wind: ' + forecast.forecast.forecastday[0].hour[12].wind_degree + '° ' + forecast.forecast.forecastday[0].hour[12].wind_dir + '<br>' + forecast.forecast.forecastday[0].hour[12].wind_kph + ' kph / ' + forecast.forecast.forecastday[0].hour[12].wind_mph + ' mph')
}

function buildDOM () {
  DOMInterface.insertToById('content-container', DOMInterface.createElement('p', '', 'date-display'))
  DOMInterface.insertToById('content-container', DOMInterface.createElement('p', '', 'time-display'))
  document.querySelector('#date-display').textContent = 'fetching data...'
  document.querySelector('#time-display').textContent = 'fetching data...'
  DOMInterface.insertToById('content-container', DOMInterface.createElement('div', 'current-weather-wrapper-left', ''))
  DOMInterface.insertToById('content-container', DOMInterface.createElement('div', 'current-weather-wrapper-right', ''))
  DOMInterface.insertToById('content-container', DOMInterface.createElement('div', 'forecast-weather-wrapper-1', ''))
  DOMInterface.insertToById('content-container', DOMInterface.createElement('div', 'forecast-weather-wrapper-2', ''))

  // left container
  DOMInterface.insertToByClass('current-weather-wrapper-left', DOMInterface.createElement('div', 'current-weather-left-container', ''))
  DOMInterface.insertToByClass('current-weather-left-container', DOMInterface.createElement('div', 'current-weather-left-header', ''))

  DOMInterface.insertToByClass('current-weather-left-header', DOMInterface.createElement('img', 'icon', 'weather-logo'))
  DOMInterface.insertToByClass('current-weather-left-header', DOMInterface.createElement('h2', '', 'current-condition-name'))

  DOMInterface.insertToByClass('current-weather-left-container', DOMInterface.createElement('h1', '', 'current-temp-text'))
  DOMInterface.insertToByClass('current-weather-left-container', DOMInterface.createElement('p', '', 'current-feeltemp-text'))

  // right container
  DOMInterface.insertToByClass('current-weather-wrapper-right', DOMInterface.createElement('div', 'current-weather-right-container', ''))
  DOMInterface.insertToByClass('current-weather-right-container', DOMInterface.createElement('div', 'current-weather-right-header', ''))

  DOMInterface.insertToByClass('current-weather-right-header', DOMInterface.createElement('h2', '', 'current-preci-name'))
  DOMInterface.insertToByClass('current-weather-right-header', DOMInterface.createElement('img', 'icon', 'preci-logo'))
  document.querySelector('#preci-logo').src = Rain

  DOMInterface.insertToByClass('current-weather-right-container', DOMInterface.createElement('h1', '', 'current-humi-text'))
  DOMInterface.insertToByClass('current-weather-right-container', DOMInterface.createElement('p', '', 'current-wind-text'))

  // forecast 9:00
  for (let i = 9; i <= 18; i += 3) {
    const a = () => i >= 15 ? 2 : 1
    DOMInterface.insertToByClass('forecast-weather-wrapper-' + a(), DOMInterface.createElement('div', 'forecast-weather-container', 'forecast-weather-container-' + i))
    DOMInterface.insertToById('forecast-weather-container-' + i, DOMInterface.createElement('div', 'forecast-header', 'forecast-weather-header-' + i))
    DOMInterface.insertToById('forecast-weather-header-' + i, DOMInterface.createElement('img', 'icon', 'forecast-weather-logo-' + i))
    DOMInterface.insertToById('forecast-weather-header-' + i, DOMInterface.createElement('p', 'forecast-time', 'forecast-time-' + i))
    DOMInterface.insertToById('forecast-weather-container-' + i, DOMInterface.createElement('p', '', 'forecast-temp-' + i))
    DOMInterface.insertToById('forecast-weather-container-' + i, DOMInterface.createElement('img', 'icon', 'forecast-preci-logo-' + i))
    DOMInterface.insertToById('forecast-weather-container-' + i, DOMInterface.createElement('p', '', 'forecast-preci-' + i))
    document.querySelector('#forecast-preci-logo-' + i).src = Rain
    DOMInterface.insertToById('forecast-weather-container-' + i, DOMInterface.createElement('p', '', 'forecast-humi-' + i))
    DOMInterface.insertToById('forecast-weather-container-' + i, DOMInterface.createElement('p', '', 'forecast-wind-' + i))
  }

  // // forecast 12:00
  // DOMInterface.insertToByClass('forecast-weather-wrapper-one', DOMInterface.createElement('div', 'forecast-weather-container', 'forecast-weather-two-container'))
  // DOMInterface.insertToById('forecast-weather-two-container', DOMInterface.createElement('div', 'forecast-header', 'forecast-weather-two-header'))
  // DOMInterface.insertToById('forecast-weather-two-header', DOMInterface.createElement('img', 'icon', 'forecast-weather-logo-two'))
  // DOMInterface.insertToById('forecast-weather-two-header', DOMInterface.createElement('p', 'forecast-time', 'forecast-time-two'))
  // DOMInterface.insertToById('forecast-weather-two-container', DOMInterface.createElement('p', '', 'forecast-temp-two'))
  // DOMInterface.insertToById('forecast-weather-two-container', DOMInterface.createElement('img', 'icon', 'forecast-preci-logo-two'))
  // DOMInterface.insertToById('forecast-weather-two-container', DOMInterface.createElement('p', '', 'forecast-preci-two'))
  // document.querySelector('#forecast-preci-logo-two').src = Rain
  // DOMInterface.insertToById('forecast-weather-two-container', DOMInterface.createElement('p', '', 'forecast-humi-two'))
  // DOMInterface.insertToById('forecast-weather-two-container', DOMInterface.createElement('p', '', 'forecast-wind-two'))

  //   // forecast 3:00
  //   DOMInterface.insertToByClass('forecast-weather-wrapper-two', DOMInterface.createElement('div', 'forecast-weather-container', 'forecast-weather-three-container'))
  //   DOMInterface.insertToById('forecast-weather-three-container', DOMInterface.createElement('div', 'forecast-header', 'forecast-weather-three-header'))
  //   DOMInterface.insertToById('forecast-weather-three-header', DOMInterface.createElement('img', 'icon', 'forecast-weather-logo-three'))
  //   DOMInterface.insertToById('forecast-weather-three-header', DOMInterface.createElement('p', 'forecast-time', 'forecast-time-three'))
  //   DOMInterface.insertToById('forecast-weather-three-container', DOMInterface.createElement('p', '', 'forecast-temp-three'))
  //   DOMInterface.insertToById('forecast-weather-three-container', DOMInterface.createElement('img', 'icon', 'forecast-preci-logo-three'))
  //   DOMInterface.insertToById('forecast-weather-three-container', DOMInterface.createElement('p', '', 'forecast-preci-three'))
  //   document.querySelector('#forecast-preci-logo-three').src = Rain
  //   DOMInterface.insertToById('forecast-weather-three-container', DOMInterface.createElement('p', '', 'forecast-humi-threee'))
  //   DOMInterface.insertToById('forecast-weather-three-container', DOMInterface.createElement('p', '', 'forecast-wind-three'))

  //   // forecast 6:00
  //   DOMInterface.insertToByClass('forecast-weather-wrapper-two', DOMInterface.createElement('div', 'forecast-weather-container', 'forecast-weather-four-container'))
  //   DOMInterface.insertToById('forecast-weather-four-container', DOMInterface.createElement('div', 'forecast-header', 'forecast-weather-four-header'))
  //   DOMInterface.insertToById('forecast-weather-four-header', DOMInterface.createElement('img', 'icon', 'forecast-weather-logo-four'))
  //   DOMInterface.insertToById('forecast-weather-four-header', DOMInterface.createElement('p', 'forecast-time', 'forecast-time-four'))
  //   DOMInterface.insertToById('forecast-weather-four-container', DOMInterface.createElement('p', '', 'forecast-temp-four'))
  //   DOMInterface.insertToById('forecast-weather-four-container', DOMInterface.createElement('img', 'icon', 'forecast-preci-logo-four'))
  //   DOMInterface.insertToById('forecast-weather-four-container', DOMInterface.createElement('p', '', 'forecast-preci-four'))
  //   document.querySelector('#forecast-preci-logo-four').src = Rain
  //   DOMInterface.insertToById('forecast-weather-four-container', DOMInterface.createElement('p', '', 'forecast-humi-four'))
  //   DOMInterface.insertToById('forecast-weather-four-container', DOMInterface.createElement('p', '', 'forecast-wind-four'))
}

async function updateTime () {
  const search = document.querySelector('#places').value
  const current = await APIModule.getCurrent(search)
  const date = formatInTimeZone(new Date(), current.location.tz_id, 'EEEE MMMM d, yyyy')
  const time = formatInTimeZone(new Date(), current.location.tz_id, 'HH:mm:ss zzz')
  document.querySelector('#date-display').innerHTML = date
  document.querySelector('#time-display').textContent = time
}

buildDOM()
setInterval(updateTime, 1000)
search.value = 'Manila, Philippines'
displayResults()
