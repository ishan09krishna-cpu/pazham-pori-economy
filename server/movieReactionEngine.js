/**
 * KUNJIRAMAN AI - TMDB Movie Character Reaction Engine
 * Exclusively searches TMDB API for authentic Malayalam cinema actor profiles and movie images.
 * NO SVG placeholders, NO robot emoji graphics.
 */

const dotenv = require('dotenv');
dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// In-Memory Server Cache with 1-hour TTL
const tmdbCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getFromCache(key) {
  const cached = tmdbCache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }
  return null;
}

function setCache(key, data) {
  tmdbCache.set(key, { data, timestamp: Date.now() });
}

// Malayalam Cinema Comedy & Character Stars Catalog
const MALAYALAM_STARS = {
  shock: ['Salim Kumar', 'Jagathy Sreekumar', 'Suraj Venjaramoodu', 'Harisree Ashokan', 'Cochin Haneefa'],
  panic: ['Jagathy Sreekumar', 'Harisree Ashokan', 'Salim Kumar', 'Kuthiravattam Pappu'],
  confusion: ['Innocent', 'Sreenivasan', 'Mukesh', 'Kuthiravattam Pappu'],
  mass: ['Mohanlal', 'Mammootty', 'Fahadh Faasil', 'Suresh Gopi'],
  villain: ['Fahadh Faasil', 'Thilakan', 'Suresh Gopi'],
  awkward: ['Mukesh', 'Sreenivasan', 'Suraj Venjaramoodu', 'Jagadish'],
  sadness: ['Kalabhavan Mani', 'Salim Kumar', 'Dileep'],
  celebration: ['Nivin Pauly', 'Dulquer Salmaan', 'Mohanlal', 'Tovino Thomas'],
  thinking: ['Innocent', 'Jagathy Sreekumar', 'Sreenivasan', 'Nedumudi Venu']
};

/**
 * Fetch real actor profile image from TMDB by person search
 */
async function searchTMDBPerson(personName) {
  const activeApiKey = (process.env.TMDB_API_KEY && process.env.TMDB_API_KEY !== 'your_tmdb_api_key_here' && process.env.TMDB_API_KEY !== 'YOUR_TMDB_API_KEY') ? process.env.TMDB_API_KEY : null;
  if (!activeApiKey) return null;

  const cacheKey = `person_${personName.toLowerCase()}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const url = `${TMDB_BASE_URL}/search/person?api_key=${activeApiKey}&query=${encodeURIComponent(personName)}&include_adult=false&language=en-US&page=1`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const person = data.results?.[0];

    if (person && person.profile_path) {
      const knownMovie = person.known_for?.[0]?.title || person.known_for?.[0]?.name || 'Malayalam Cinema';
      const result = {
        url: `${TMDB_IMAGE_BASE}${person.profile_path}`,
        personName: person.name,
        title: knownMovie,
        popularity: person.popularity
      };
      setCache(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.error('TMDB Person Search error:', err.message);
  }
  return null;
}

/**
 * Discover popular Malayalam movies from TMDB
 */
async function discoverTMDBMalayalamMovie() {
  const activeApiKey = (process.env.TMDB_API_KEY && process.env.TMDB_API_KEY !== 'your_tmdb_api_key_here' && process.env.TMDB_API_KEY !== 'YOUR_TMDB_API_KEY') ? process.env.TMDB_API_KEY : null;
  if (!activeApiKey) return null;

  const cacheKey = 'discover_ml_movie';
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const url = `${TMDB_BASE_URL}/discover/movie?api_key=${activeApiKey}&with_original_language=ml&sort_by=popularity.desc&page=1`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const movie = data.results?.[Math.floor(Math.random() * Math.min(5, data.results.length))];

    if (movie && (movie.poster_path || movie.backdrop_path)) {
      const imgPath = movie.poster_path || movie.backdrop_path;
      const result = {
        url: `${TMDB_IMAGE_BASE}${imgPath}`,
        title: movie.title || movie.original_title,
        personName: 'Malayalam Cinema'
      };
      setCache(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.error('TMDB Movie Discover error:', err.message);
  }
  return null;
}

/**
 * Generate original witty Malayalam/Manglish caption based on topic/emotion
 */
function generateOriginalCaption(userMessage, emotion) {
  const msg = String(userMessage || '').toLowerCase();

  if (msg.includes('exam') || msg.includes('pass') || msg.includes('padik')) {
    return 'Nale EXAM aanennu innanu arinjath... 💀';
  }
  if (msg.includes('assignment') || msg.includes('copy') || msg.includes('record')) {
    return 'Assignment submit cheyyan maranna aah nimisham! 😭';
  }
  if (msg.includes('college') || msg.includes('bunk') || msg.includes('attendance')) {
    return 'Attendance 74.9% aayennu arinja aah tragic moment! 🛑';
  }
  if (msg.includes('viva') || msg.includes('teacher') || msg.includes('mark')) {
    return 'Viva-ykk sir chodyam chodhichappol ulla marupadi... 🤐';
  }
  if (emotion === 'mass' || msg.includes('mass') || msg.includes('entry')) {
    return 'Backbenchers-nte mass entry in campus! 🔥';
  }

  return 'Chinchu bro-nte aah mass marupadi kettappol! 🎭';
}

/**
 * Main Movie Reaction Generator Engine
 * Exclusively returns authentic TMDB images or null (NO SVG / NO ROBOT GRAPHICS)
 */
async function getMovieReaction(userMessage, emotion = 'panic') {
  const category = MALAYALAM_STARS[emotion] ? emotion : 'shock';
  const actorsList = MALAYALAM_STARS[category];
  
  // Shuffle actors list to try multiple candidates
  const candidates = [...actorsList].sort(() => Math.random() - 0.5);

  const caption = generateOriginalCaption(userMessage, category);

  // 1. Iterate candidates and search TMDB for real profile image
  for (const actorName of candidates) {
    const personData = await searchTMDBPerson(actorName);
    if (personData && personData.url) {
      return {
        url: personData.url,
        title: personData.title,
        personName: personData.personName,
        caption: caption,
        emotion: category,
        source: 'TMDB API'
      };
    }
  }

  // 2. Try discovering popular Malayalam movie poster from TMDB
  const movieData = await discoverTMDBMalayalamMovie();
  if (movieData && movieData.url) {
    return {
      url: movieData.url,
      title: movieData.title,
      personName: movieData.personName,
      caption: caption,
      emotion: category,
      source: 'TMDB API'
    };
  }

  // 3. NO PLACEHOLDER / NO ROBOT GRAPHICS: If TMDB returns no image, return null cleanly!
  return null;
}

module.exports = {
  getMovieReaction,
  searchTMDBPerson,
  discoverTMDBMalayalamMovie
};
