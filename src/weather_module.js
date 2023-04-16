const WeatherModule = (() => {
  const forecastWeather = 'https://api.weatherapi.com/v1/forecast.json?key=dcf026d8b6784471a6463622233003&q='
  const currentWeather = 'https://api.weatherapi.com/v1/current.json?key=dcf026d8b6784471a6463622233003&q='
  const searchAPI = 'https://api.weatherapi.com/v1/search.json?key=dcf026d8b6784471a6463622233003&q='

  async function retrieveForecast (place) {
    const response = await fetch(forecastWeather + place)
    const data = await response.json()
    return data
  }

  async function search (place) {
    const response = await fetch(searchAPI + place)
    const data = await response.json()
    return data
  }

  async function retrieveCurrent (place) {
    try {
    const response = await fetch(currentWeather + place)
    if (!response.ok) throw new Error('Request Failed')
    const data = await response.json()
    return data
    } catch (err){
      alert('Invalid location')
      return 'err'
    }
  }

  return { retrieveForecast, retrieveCurrent, search }
})()

export { WeatherModule as default }
