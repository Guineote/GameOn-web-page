// API Keys (coloca tus propias claves)
const WEATHER_API_KEY = '0431f4db9f5b51aa2970db8e4aa7109e';
const cities = ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Aguascalientes', 'San Luis Potosí', 'Durango', 'Chiapas', 'Oaxaca', 'León'];
const NEWS_API_KEY = 'e_1ehVk8lfhnKoJNBbmVepQ4HC-6tB91KWu2TLhGf6zgTLGU';
const SPORTS_API_KEY = '3';

// Clima
// Función para obtener el clima de cada ciudad
async function fetchWeather() {
  const weatherDiv = document.getElementById('weather');
  let htmlContent = '';
  
  for (const city of cities) {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},mx&units=metric&appid=${WEATHER_API_KEY}`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();

      htmlContent += `
        <div>
          <h4>${data.name}</h4>
          <p>Temperatura: ${data.main.temp}°C</p>
          <p>Clima: ${data.weather[0].description}</p>
        </div>
      `;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      htmlContent += `<p>No se pudo obtener el clima para ${city}.</p>`;
    }
  }

  weatherDiv.innerHTML = htmlContent;
}

async function fetchNews() {
  const response = await fetch(`https://api.currentsapi.services/v1/latest-news?category=sports&language=es&apiKey=${NEWS_API_KEY}`);
  const data = await response.json();
  const newsDiv = document.getElementById('news');

  if (data.news) {
    // Filtrar solo las noticias en español
    const spanishNews = data.news.filter(article => article.language === 'es');
    
    newsDiv.innerHTML = spanishNews.slice(0, 5).map(article => `
      <h5>${article.title}</h5>
      <p>${article.description || 'Sin descripción disponible.'}</p>
      <a href="${article.url}" target="_blank">Leer más</a>
    `).join('');
  } else {
    console.error("No se pudieron obtener las noticias.");
    newsDiv.innerHTML = '<p>No se pudieron cargar las noticias.</p>';
  }
}

// Resultados deportivos
async function fetchSports() {
  try {
    const response = await fetch(`https://www.thesportsdb.com/api/v1/json/${SPORTS_API_KEY}/eventspastleague.php?id=4351`); // ID de Liga MX
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    const sportsDiv = document.getElementById('sports');
    if (!data.events || data.events.length === 0) {
      sportsDiv.innerHTML = '<p>No se encontraron eventos recientes.</p>';
      return;
    }
    sportsDiv.innerHTML = data.events.slice(0, 10).map(event => `
      <h5>${event.strEvent}</h5>
      <p>${event.dateEvent} - ${event.strTime}</p>
      <p>Resultado: ${event.intHomeScore || 'N/A'} - ${event.intAwayScore || 'N/A'}</p>
    `).join('');
  } catch (error) {
    console.error('Error fetching sports data:', error);
    document.getElementById('sports').innerHTML = '<p>No se pudieron cargar los resultados deportivos.</p>';
  }
}


// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  fetchWeather();
  fetchNews();
  fetchSports();
});
