import WeatherModule from './weather_module.js'
import './style.css'
import DOMInterface from './dom_interface'
import GitHubLogo from './assets/githublogo.png'
import Cloud from './assets/cloud.png'
import Rain from './assets/precipitation.png'
import { formatInTimeZone } from 'date-fns-tz'

const head = document.getElementsByTagName('head')
head[0].innerHTML += '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Alkatra&family=Didact+Gothic&family=Tilt+Neon&family=Yatra+One&display=swap" rel="stylesheet">'

let location = 'Manila, Philippines'
let tempLoc = ''

const APIModule = (() => {
  // await search results
  async function showResults (input) {
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

  async function getCurrent (input) {
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
search.addEventListener('input', ((event) => {
  event.stopImmediatePropagation()
  const input = event.target.value
  APIModule.showResults(input)}))
search.addEventListener('enter', displayResults)

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
  tempLoc = document.querySelector('#places').value
  const search = await APIModule.getCurrent(tempLoc)
  let current, forecast = ''
  if (search === 'err') {
    document.querySelector('#places').value = location
  } else {
    location = tempLoc
    current = await APIModule.getCurrent(location)
    forecast = await APIModule.getForecast(location)
  }

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

  // forecast
  for (let i = 9; i <= 18; i += 3) {
    DOMInterface.insertTextContentById('forecast-time-' + i, i + ':00')
    document.querySelector('#forecast-weather-logo-' + i).src = forecast.forecast.forecastday[0].hour[i].condition.icon
    DOMInterface.insertTextContentById('forecast-temp-' + i, forecast.forecast.forecastday[0].hour[i].temp_c + '° C | ' + forecast.forecast.forecastday[0].hour[i].temp_f + '° F')
    DOMInterface.insertTextContentById('forecast-preci-' + i, forecast.forecast.forecastday[0].hour[i].precip_mm + ' mm | ' + forecast.forecast.forecastday[0].hour[i].precip_in + ' in')
    DOMInterface.insertTextContentById('forecast-humi-' + i, forecast.forecast.forecastday[0].hour[i].humidity + '% Humidity')
    DOMInterface.insertTextContentById('forecast-wind-' + i, 'Wind: ' + forecast.forecast.forecastday[0].hour[i].wind_degree + '° ' + forecast.forecast.forecastday[0].hour[i].wind_dir + '<br>' + forecast.forecast.forecastday[0].hour[i].wind_kph + ' kph | ' + forecast.forecast.forecastday[0].hour[i].wind_mph + ' mph')
  }
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

  // forecast
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
}

async function updateTime () {
  const current = await APIModule.getCurrent(location)
  const date = formatInTimeZone(new Date(), current.location.tz_id, 'EEEE MMMM d, yyyy')
  const time = formatInTimeZone(new Date(), current.location.tz_id, 'HH:mm:ss zzz')
  document.querySelector('#date-display').innerHTML = date
  document.querySelector('#time-display').textContent = time
}

buildDOM()
setInterval(updateTime, 1000)
search.value = location
displayResults()
