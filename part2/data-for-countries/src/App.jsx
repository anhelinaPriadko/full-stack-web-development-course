import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  // Fetch all countries on initial load
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null) // Reset manual selection when typing a new query
  }

  // Filter countries case-insensitively based on search input
  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>
      <CountryContent 
        countries={filteredCountries} 
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
      />
    </div>
  )
}

// Component to handle lists, show buttons, and single country details
const CountryContent = ({ countries, selectedCountry, onSelectCountry }) => {
  // If a country was explicitly selected via the "Show" button, display only that country
  if (selectedCountry) {
    return <CountryDetails country={selectedCountry} />
  }

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1 && countries.length <= 10) {
    return (
      <ul>
        {countries.map(country => (
          <li key={country.cca3}>
            {country.name.common}{' '}
            <button onClick={() => onSelectCountry(country)}>Show</button>
          </li>
        ))}
      </ul>
    )
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />
  }

  return <p>No matches found</p>
}

// Component for rendering a single country's full data + weather report
const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const capital = country.capital ? country.capital[0] : null
  const api_key = import.meta.env.VITE_WEATHER_KEY

  // Fetch weather data for the capital city using useEffect
  useEffect(() => {
    if (!capital || !api_key) return

    // OpenWeatherMap current weather API endpoint
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`

    axios
      .get(url)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.error('Failed to fetch weather data:', error)
      })
  }, [capital, api_key])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital {capital || 'N/A'}</p>
      <p>Area {country.area}</p>

      <h3>Languages</h3>
      <ul>
        {country.languages &&
          Object.values(country.languages).map(language => (
            <li key={language}>{language}</li>
          ))}
      </ul>

      <img 
        src={country.flags.png} 
        alt={`Flag of ${country.name.common}`} 
        width="150" 
        style={{ border: '1px solid #ccc' }}
      />

      {weather && (
        <div>
          <h3>Weather in {capital}</h3>
          <p>Temperature {weather.main.temp} Celsius</p>
          <img 
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
            alt={weather.weather[0].description} 
          />
          <p>Wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

export default App