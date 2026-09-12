/**
 * KUNJIRAMAN AI — Meme Image Engine
 * Curated database of meme-famous Malayalam cinema scenes + expanded TMDB image search.
 * Searches for movie backdrops, stills, and character-specific images — NOT just actor headshots.
 */

const dotenv = require('dotenv');
dotenv.config();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w780';

// ---------------------------------------------------------------------------
// Curated Database: Meme-Famous Malayalam Cinema Scenes
// Each entry maps an emotion/topic to specific MOVIE + CHARACTER combos
// that are iconic in Kerala meme culture.
// ---------------------------------------------------------------------------
const MEME_FAMOUS_SCENES = {
  exam: [
    { actor: 'Jagathy Sreekumar', movie: 'Nadodikattu', query: 'Nadodikattu Malayalam' },
    { actor: 'Salim Kumar', movie: 'Chinthavishtayaya Shyamala', query: 'Salim Kumar comedy' },
    { actor: 'Suraj Venjaramoodu', movie: 'Kalyanaraman', query: 'Kalyanaraman Malayalam' },
    { actor: 'Innocent', movie: 'Ramji Rao Speaking', query: 'Ramji Rao Speaking' },
    { actor: 'Mukesh', movie: 'In Harihar Nagar', query: 'In Harihar Nagar Malayalam' },
    { actor: 'Harisree Ashokan', movie: 'Meesha Madhavan', query: 'Meesha Madhavan Malayalam' },
  ],
  panic: [
    { actor: 'Jagathy Sreekumar', movie: 'CID Moosa', query: 'CID Moosa Malayalam' },
    { actor: 'Kuthiravattam Pappu', movie: 'Ramji Rao Speaking', query: 'Kuthiravattam Pappu' },
    { actor: 'Salim Kumar', movie: 'Pulival Kalyanam', query: 'Pulival Kalyanam' },
    { actor: 'Harisree Ashokan', movie: 'Punjabi House', query: 'Punjabi House Malayalam' },
    { actor: 'Dileep', movie: 'Pandippada', query: 'Pandippada Malayalam' },
  ],
  confusion: [
    { actor: 'Innocent', movie: 'Ramji Rao Speaking', query: 'Innocent Malayalam actor' },
    { actor: 'Sreenivasan', movie: 'Sandesham', query: 'Sandesham Malayalam' },
    { actor: 'Mukesh', movie: 'Sandesham', query: 'Mukesh Malayalam actor' },
    { actor: 'Jagathy Sreekumar', movie: 'Mannar Mathai Speaking', query: 'Mannar Mathai Speaking' },
    { actor: 'Nedumudi Venu', movie: 'Kilukkam', query: 'Nedumudi Venu' },
  ],
  mass: [
    { actor: 'Mohanlal', movie: 'Drishyam', query: 'Mohanlal Drishyam' },
    { actor: 'Mammootty', movie: 'The Great Father', query: 'Mammootty The Great Father' },
    { actor: 'Fahadh Faasil', movie: 'Kumbalangi Nights', query: 'Fahadh Faasil' },
    { actor: 'Suresh Gopi', movie: 'Commissioner', query: 'Suresh Gopi Commissioner' },
    { actor: 'Mohanlal', movie: 'Lucifer', query: 'Lucifer Malayalam' },
    { actor: 'Prithviraj', movie: 'Ayyappanum Koshiyum', query: 'Ayyappanum Koshiyum' },
    { actor: 'Dulquer Salmaan', movie: 'Charlie', query: 'Dulquer Salmaan Charlie' },
  ],
  villain: [
    { actor: 'Fahadh Faasil', movie: 'Trance', query: 'Fahadh Faasil Trance' },
    { actor: 'Thilakan', movie: 'Kireedam', query: 'Thilakan Malayalam' },
    { actor: 'Suresh Gopi', movie: 'Lelam', query: 'Suresh Gopi Lelam' },
    { actor: 'Lal', movie: 'Pulimurugan', query: 'Lal Malayalam actor' },
  ],
  awkward: [
    { actor: 'Mukesh', movie: 'Vandanam', query: 'Vandanam Malayalam' },
    { actor: 'Sreenivasan', movie: 'Varavelpu', query: 'Varavelpu Malayalam' },
    { actor: 'Suraj Venjaramoodu', movie: 'Kunjiramayanam', query: 'Kunjiramayanam Malayalam' },
    { actor: 'Jagadish', movie: 'Vadakkumnathan', query: 'Jagadish Malayalam actor' },
    { actor: 'Dileep', movie: 'Marykundoru Kunjadu', query: 'Dileep Malayalam' },
  ],
  sadness: [
    { actor: 'Kalabhavan Mani', movie: 'Vasanthiyum Lakshmiyum Pinne Njanum', query: 'Kalabhavan Mani' },
    { actor: 'Salim Kumar', movie: 'Adaminte Makan Abu', query: 'Salim Kumar drama' },
    { actor: 'Mohanlal', movie: 'Kireedam', query: 'Kireedam Malayalam' },
  ],
  celebration: [
    { actor: 'Nivin Pauly', movie: 'Premam', query: 'Premam Malayalam' },
    { actor: 'Dulquer Salmaan', movie: 'Bangalore Days', query: 'Bangalore Days Malayalam' },
    { actor: 'Mohanlal', movie: 'Spadikam', query: 'Spadikam Malayalam' },
    { actor: 'Tovino Thomas', movie: 'Minnal Murali', query: 'Minnal Murali' },
  ],
  shock: [
    { actor: 'Salim Kumar', movie: 'Chinthavishtayaya Shyamala', query: 'Salim Kumar' },
    { actor: 'Jagathy Sreekumar', movie: 'Nadodikattu', query: 'Jagathy Sreekumar' },
    { actor: 'Suraj Venjaramoodu', movie: 'Two Countries', query: 'Suraj Venjaramoodu' },
    { actor: 'Harisree Ashokan', movie: 'Meesha Madhavan', query: 'Harisree Ashokan' },
    { actor: 'Innocent', movie: 'Godfather', query: 'Innocent Malayalam Godfather' },
    { actor: 'Cochin Haneefa', movie: 'Vietnam Colony', query: 'Cochin Haneefa' },
  ],
  thinking: [
    { actor: 'Innocent', movie: 'Ramji Rao Speaking', query: 'Innocent Ramji Rao' },
    { actor: 'Jagathy Sreekumar', movie: 'Mannar Mathai Speaking', query: 'Jagathy Sreekumar comedy' },
    { actor: 'Sreenivasan', movie: 'Varavelpu', query: 'Sreenivasan Malayalam' },
    { actor: 'Nedumudi Venu', movie: 'Kilukkam', query: 'Kilukkam Malayalam' },
  ],
  college: [
    { actor: 'Nivin Pauly', movie: 'Premam', query: 'Premam Malayalam' },
    { actor: 'Dulquer Salmaan', movie: 'Ustad Hotel', query: 'Ustad Hotel Malayalam' },
    { actor: 'Fahadh Faasil', movie: 'Bangalore Days', query: 'Fahadh Faasil Bangalore Days' },
    { actor: 'Mohanlal', movie: 'Thoovanathumbikal', query: 'Thoovanathumbikal' },
    { actor: 'Dileep', movie: 'Meesa Madhavan', query: 'Dileep Meesha Madhavan' },
  ]
};

// In-Memory Cache
const imageCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000;

function getCached(key) {
  const entry = imageCache.get(key);
  if (entry && (Date.now() - entry.ts < CACHE_TTL_MS)) return entry.data;
  return null;
}

function setCache(key, data) {
  imageCache.set(key, { data, ts: Date.now() });
}

/**
 * Detect emotion/topic from user message
 */
function detectEmotion(message, mode) {
  const msg = String(message || '').toLowerCase();

  if (mode === 'cinema') return 'mass';
  if (mode === 'teacher') return 'confusion';
  if (mode === 'brutal') return 'panic';

  if (msg.includes('exam') || msg.includes('pass') || msg.includes('padik') || msg.includes('പഠി') || msg.includes('test')) return 'exam';
  if (msg.includes('assignment') || msg.includes('record') || msg.includes('lab') || msg.includes('copy')) return 'confusion';
  if (msg.includes('college') || msg.includes('bunk') || msg.includes('attendance') || msg.includes('class')) return 'college';
  if (msg.includes('viva') || msg.includes('teacher') || msg.includes('sir') || msg.includes('mark')) return 'panic';
  if (msg.includes('mass') || msg.includes('entry') || msg.includes('hero') || msg.includes('win')) return 'mass';
  if (msg.includes('sad') || msg.includes('cry') || msg.includes('fail') || msg.includes('loss')) return 'sadness';
  if (msg.includes('party') || msg.includes('celebrate') || msg.includes('win') || msg.includes('happy')) return 'celebration';
  if (msg.includes('fight') || msg.includes('angry') || msg.includes('villain')) return 'villain';
  if (msg.includes('confused') || msg.includes('what') || msg.includes('how') || msg.includes('why')) return 'thinking';
  if (msg.includes('awkward') || msg.includes('cringe') || msg.includes('embarrass')) return 'awkward';

  return 'shock';
}

/**
 * Pick a random meme scene entry for the given emotion
 */
function pickMemeScene(emotion) {
  const scenes = MEME_FAMOUS_SCENES[emotion] || MEME_FAMOUS_SCENES['shock'];
  return scenes[Math.floor(Math.random() * scenes.length)];
}

/**
 * Search TMDB for a movie and return backdrop/poster image
 */
async function searchTMDBMovie(query) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey || apiKey === 'your_tmdb_api_key_here' || apiKey === 'YOUR_TMDB_API_KEY') return null;

  const cacheKey = `movie_${query.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    // Try multiple results for variety
    const results = (data.results || []).filter(m => m.backdrop_path || m.poster_path);
    if (results.length === 0) return null;

    const movie = results[Math.floor(Math.random() * Math.min(3, results.length))];
    const imgPath = movie.backdrop_path || movie.poster_path;

    const result = {
      url: `${TMDB_IMAGE_BASE}${imgPath}`,
      title: movie.title || movie.original_title,
      type: movie.backdrop_path ? 'backdrop' : 'poster'
    };
    setCache(cacheKey, result);
    return result;
  } catch (err) {
    console.error('TMDB Movie search error:', err.message);
    return null;
  }
}

/**
 * Search TMDB for movie images (stills/backdrops) by movie ID
 */
async function getTMDBMovieImages(movieId) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey || apiKey === 'your_tmdb_api_key_here') return null;

  const cacheKey = `movie_imgs_${movieId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const url = `${TMDB_BASE_URL}/movie/${movieId}/images?api_key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    // Prefer backdrops over posters for meme-style images
    const images = [...(data.backdrops || []), ...(data.posters || [])].filter(i => i.file_path);
    if (images.length === 0) return null;

    const pick = images[Math.floor(Math.random() * Math.min(5, images.length))];
    const result = { url: `${TMDB_IMAGE_BASE}${pick.file_path}` };
    setCache(cacheKey, result);
    return result;
  } catch (err) {
    console.error('TMDB Movie Images error:', err.message);
    return null;
  }
}

/**
 * Search TMDB for actor person profile photo
 */
async function searchTMDBPerson(personName) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey || apiKey === 'your_tmdb_api_key_here') return null;

  const cacheKey = `person_${personName.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const url = `${TMDB_BASE_URL}/search/person?api_key=${apiKey}&query=${encodeURIComponent(personName)}&include_adult=false&language=en-US&page=1`;
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
        personId: person.id,
      };
      setCache(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.error('TMDB Person search error:', err.message);
  }
  return null;
}

/**
 * Discover popular Malayalam movies from TMDB
 */
async function discoverMalayalamMovie() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey || apiKey === 'your_tmdb_api_key_here') return null;

  const cacheKey = `discover_ml_${Math.floor(Math.random() * 5)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const page = Math.floor(Math.random() * 3) + 1;
    const url = `${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&with_original_language=ml&sort_by=popularity.desc&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const movies = (data.results || []).filter(m => m.backdrop_path || m.poster_path);
    if (movies.length === 0) return null;

    const movie = movies[Math.floor(Math.random() * movies.length)];
    const imgPath = movie.backdrop_path || movie.poster_path;
    const result = {
      url: `${TMDB_IMAGE_BASE}${imgPath}`,
      title: movie.title || movie.original_title,
      personName: 'Malayalam Cinema'
    };
    setCache(cacheKey, result);
    return result;
  } catch (err) {
    console.error('TMDB Discover error:', err.message);
    return null;
  }
}

/**
 * Main function: Get a meme-worthy image for the given context
 * Tries multiple strategies in order:
 * 1. Search for specific meme-famous movie scene
 * 2. Search for the actor from that scene
 * 3. Discover random popular Malayalam movie
 */
async function getMemeImage(userMessage, emotion) {
  const scene = pickMemeScene(emotion);

  // Strategy 1: Search for the specific meme-famous movie
  const movieResult = await searchTMDBMovie(scene.query);
  if (movieResult && movieResult.url) {
    return {
      url: movieResult.url,
      title: scene.movie,
      personName: scene.actor,
      emotion: emotion,
      source: 'TMDB Movie Search'
    };
  }

  // Strategy 2: Search for the actor profile
  const personResult = await searchTMDBPerson(scene.actor);
  if (personResult && personResult.url) {
    return {
      url: personResult.url,
      title: personResult.title || scene.movie,
      personName: personResult.personName || scene.actor,
      emotion: emotion,
      source: 'TMDB Actor Profile'
    };
  }

  // Strategy 3: Try a different random scene from the same emotion
  const allScenes = MEME_FAMOUS_SCENES[emotion] || MEME_FAMOUS_SCENES['shock'];
  for (const altScene of allScenes) {
    if (altScene.actor === scene.actor) continue;
    const altPerson = await searchTMDBPerson(altScene.actor);
    if (altPerson && altPerson.url) {
      return {
        url: altPerson.url,
        title: altPerson.title || altScene.movie,
        personName: altPerson.personName || altScene.actor,
        emotion: emotion,
        source: 'TMDB Actor Profile'
      };
    }
  }

  // Strategy 4: Discover popular Malayalam movie as fallback
  const discoverResult = await discoverMalayalamMovie();
  if (discoverResult && discoverResult.url) {
    return {
      ...discoverResult,
      emotion: emotion,
      source: 'TMDB Discover'
    };
  }

  return null;
}

module.exports = {
  MEME_FAMOUS_SCENES,
  detectEmotion,
  pickMemeScene,
  getMemeImage,
  searchTMDBMovie,
  searchTMDBPerson,
  discoverMalayalamMovie
};
