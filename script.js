import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mtfvxyndtheviqrtaiqg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10ZnZ4eW5kdGhldmlxcnRhaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxODA3NzQsImV4cCI6MjA2ODc1Njc3NH0.QFKossdi2RyqakQjxmG-ONFGBmr9WKbbGzD1A9py5fk';
const tmdbApiKey = '44983101bc2e8821e3a20c61a9df7a4a';

export const supabase = createClient(supabaseUrl, supabaseKey);

// TMDB API Configuration
const API_KEY = tmdbApiKey;
const TMDB_READ_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDk4MzEwMWJjMmU4ODIxZTNhMjBjNjFhOWRmN2E0YSIsIm5iZiI6MTc1MzE3OTkzNi44NzgsInN1YiI6IjY4N2Y2NzIwZmQ5NDU1MzFlZThhNTMyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KPOxOvKG-Qxx7pguBfFSfhN9fDlevJRRtI3QB3y4KZ0';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Custom Alert System
function showAlert(type, title, message, duration = 5000) {
  const alertContainer = document.getElementById('alert-container');
  
  const alertElement = document.createElement('div');
  alertElement.className = `alert ${type}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };
  
  alertElement.innerHTML = `
    <div class="alert-icon">${icons[type] || 'ℹ️'}</div>
    <div class="alert-content">
      <div class="alert-title">${title}</div>
      <div class="alert-message">${message}</div>
    </div>
    <button class="alert-close" onclick="this.parentElement.remove()">×</button>
  `;
  
  alertContainer.appendChild(alertElement);
  
  // Trigger animation
  setTimeout(() => {
    alertElement.classList.add('show');
  }, 100);
  
  // Auto remove after duration
  setTimeout(() => {
    alertElement.classList.remove('show');
    setTimeout(() => {
      if (alertElement.parentElement) {
        alertElement.remove();
      }
    }, 300);
  }, duration);
}

// DOM Elements d
const moviesGrid = document.getElementById('movies-grid');
const tvShowsGrid = document.getElementById('tvshows-grid');
const trendingGrid = document.getElementById('trending-grid');
const heroSlider = document.getElementById('hero-slider');
const searchInput = document.getElementById('search');
const mobileSearchInput = document.getElementById('mobile-search');
const genreSelect = document.getElementById('genre-select');
const mobileGenreSelect = document.getElementById('mobile-genre-select');
const contentType = document.getElementById('content-type');
const mobileContentType = document.getElementById('mobile-content-type');
const homeLink = document.getElementById('home');
const moviesLink = document.getElementById('movies');
const tvShowsLink = document.getElementById('tvshows');
const animeLink = document.getElementById('anime');
const profileLink = document.getElementById('profile');
const themeToggle = document.getElementById('theme-toggle');
const main = document.getElementById('main');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileSidebarMenu = document.getElementById('mobile-sidebar-menu');
const closeMobileMenuButton = document.querySelector('.close-mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Toggle mobile menu
mobileMenuToggle.addEventListener('click', () => {
    mobileSidebarMenu.classList.add('active');
});

// Close mobile menu
closeMobileMenuButton.addEventListener('click', () => {
    mobileSidebarMenu.classList.remove('active');
});

// Close mobile menu when clicking outside
mobileSidebarMenu.addEventListener('click', (e) => {
    if (e.target === mobileSidebarMenu) {
        mobileSidebarMenu.classList.remove('active');
    }
});

// Handle mobile navigation links
mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        
        // Update active state for mobile nav
        mobileNavLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Update active state for desktop nav
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        document.getElementById(page).classList.add('active');
        
        // Close mobile menu and display content
        mobileSidebarMenu.classList.remove('active');
        displayContent(page);
    });
});

// Watchlist functions
async function addToWatchlist(item, type) {
    if (!currentUser) {
        showAlert('error', 'Login Required', 'Please login to add items to your watchlist');
        return;
    }

    try {
        const { error } = await supabase
            .from('user_watchlist')
            .insert({
                user_id: currentUser.id,
                content_id: item.id.toString(),
                content_type: type,
                title: type === 'movie' ? item.title : item.name,
                poster_path: item.poster_path,
                genres: item.genres ? item.genres.map(g => g.name || g) : []
            });

        if (error) throw error;
        
        showAlert('success', 'Added to Watchlist!', `${type === 'movie' ? item.title : item.name} has been added to your watchlist.`);
    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            showAlert('info', 'Already in Watchlist', 'This item is already in your watchlist');
        } else {
            console.error('Error adding to watchlist:', error);
            showAlert('error', 'Failed to Add', 'Failed to add to watchlist');
        }
    }
}

async function removeFromWatchlist(contentId, contentType) {
    if (!currentUser) return;

    try {
        const { error } = await supabase
            .from('user_watchlist')
            .delete()
            .eq('user_id', currentUser.id)
            .eq('content_id', contentId)
            .eq('content_type', contentType);

        if (error) throw error;
        showAlert('success', 'Removed from Watchlist!', 'Item has been removed from your watchlist.');
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        showAlert('error', 'Failed to Remove', 'Failed to remove from watchlist');
    }
}

async function addToWatchHistory(item, type, watchDuration = 0, completed = false) {
    if (!currentUser) return;

    try {
        const { error } = await supabase
            .from('user_watch_history')
            .upsert({
                user_id: currentUser.id,
                content_id: item.id.toString(),
                content_type: type,
                title: type === 'movie' ? item.title : item.name,
                poster_path: item.poster_path,
                genres: item.genres ? item.genres.map(g => g.name || g) : [],
                watch_duration: watchDuration,
                completed: completed,
                watched_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,content_id,content_type'
            });

        if (error) throw error;
    } catch (error) {
        console.error('Error adding to watch history:', error);
    }
}

// Authentication state
let currentUser = null;

// Check initial auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  currentUser = session?.user || null;
  updateAuthUI(currentUser);
});

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  currentUser = session?.user || null;
  updateAuthUI(currentUser);
});

// Authentication functions
async function handleSignup(e) {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
      
    });
    
    if (error) throw error;

    // Sign out immediately to prevent auto-login
    await supabase.auth.signOut();

    alert("Signup successful! Please check your email to confirm.");
  } catch (error) {
    alert(error.message);
  }
}

    
    showAlert('success', 'Account Created!', 'Please check your email for the confirmation link, then log in.');
    document.getElementById('signup-modal').style.display = 'none';
    e.target.reset();
    
  } catch (error) {
    showAlert('error', 'Signup Failed', error.message);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Check if email is confirmed
    if (!data.user.email_confirmed_at) {
      await supabase.auth.signOut();
      showAlert('error', 'Email Not Verified', 'Please verify your email address before logging in. Check your inbox for the confirmation link.');
      return;
    }
    
    showAlert('success', 'Welcome Back!', `Successfully logged in as ${data.user.email}`);
    document.getElementById('login-modal').style.display = 'none';
    e.target.reset();
    updateAuthUI(data.user);
    
  } catch (error) {
    showAlert('error', 'Login Failed', error.message);
  }
}

async function handleLogout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    showAlert('success', 'Logged Out', 'You have been successfully logged out.');
    updateAuthUI(null);
    
    // Redirect to home if on profile page
    if (currentPage === 'profile') {
      displayContent('home');
    }
    
  } catch (error) {
    showAlert('error', 'Logout Failed', error.message);
  }
}

function updateAuthUI(user) {
  const authContainer = document.querySelector('.auth-container');
  const userInfo = document.querySelector('.user-info');
  const mobileAuthButtons = document.querySelector('.mobile-auth-buttons');
  const mobileUserInfo = document.querySelector('.mobile-user-info');
  
  if (user) {
    // Desktop
    authContainer.style.display = 'none';
    userInfo.style.display = 'flex';
    document.querySelector('.user-email').textContent = user.email;
    
    // Mobile
    mobileAuthButtons.style.display = 'none';
    mobileUserInfo.style.display = 'block';
    document.querySelector('.mobile-user-email').textContent = user.email;
  } else {
    // Desktop
    authContainer.style.display = 'flex';
    userInfo.style.display = 'none';
    
    // Mobile
    mobileAuthButtons.style.display = 'flex';
    mobileUserInfo.style.display = 'none';
  }
}

// State
let currentPage = 'home';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let comments = JSON.parse(localStorage.getItem('comments')) || {};
let ratings = JSON.parse(localStorage.getItem('ratings')) || {};
let navigationStack = [];

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    themeToggle.textContent = document.body.dataset.theme === 'dark' ? '' : '';
});

// Fetch content from API
async function fetchContent(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching content:', error);
        return null;
    }
}

// Filter anime content to ensure only anime shows
function filterAnimeContent(results) {
    const animeKeywords = [
        'anime', 'manga', 'japanese', 'studio', 'shounen', 'shoujo', 'seinen', 'josei',
        'mecha', 'isekai', 'slice of life', 'magical girl', 'otaku', 'kawaii'
    ];
    
    const animeOriginCountries = ['JP']; // Japan
    
    return results.filter(item => {
        // Check if origin country is Japan
        if (item.origin_country && item.origin_country.some(country => animeOriginCountries.includes(country))) {
            return true;
        }
        
        // Check if title or overview contains anime-related keywords
        const title = (item.name || item.title || '').toLowerCase();
        const overview = (item.overview || '').toLowerCase();
        
        return animeKeywords.some(keyword => 
            title.includes(keyword) || overview.includes(keyword)
        );
    });
}

// Load genres for both movies and TV shows
async function loadGenres() {
    const movieGenres = await fetchContent('/genre/movie/list');
    const tvGenres = await fetchContent('/genre/tv/list');
    
    const allGenres = [...new Set([...movieGenres.genres, ...tvGenres.genres].map(g => JSON.stringify(g)))];
    const uniqueGenres = allGenres.map(g => JSON.parse(g));
    
    // Populate both desktop and mobile genre selects
    [genreSelect, mobileGenreSelect].forEach(select => {
        // Clear existing options except the first one
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        uniqueGenres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            select.appendChild(option);
        });
    });
}

// Create content card
function createContentCard(item, type = 'movie') {
    const title = type === 'movie' ? item.title : item.name;
    const rating = item.vote_average ? `⭐ ${item.vote_average.toFixed(1)}` : 'No rating';
    
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
        <div class="movie-poster-container">
            <img src="${item.poster_path ? IMAGE_BASE_URL + item.poster_path : 'https://via.placeholder.com/500x750'}" 
                 alt="${title}"
                 class="movie-poster">
            ${currentUser ? `
                <div class="card-actions">
                    <button class="action-btn watchlist-btn" onclick="addToWatchlist(${JSON.stringify(item).replace(/"/g, '&quot;')}, '${type}')" title="Add to Watchlist">
                        📋
                    </button>
                </div>
            ` : ''}
        </div>
        <div class="movie-info">
            <h3>${title}</h3>
            <p class="rating">${rating}</p>
        </div>
    `;

    card.addEventListener('click', (e) => {
        // Don't navigate if clicking on action buttons
        if (e.target.classList.contains('action-btn')) {
            e.stopPropagation();
            return;
        }
        navigationStack.push({ page: currentPage });
        showDetails(item.id, type);
    });

    return card;
}

// Show actor details
async function showActorDetails(actorId) {
    const [actor, credits] = await Promise.all([
        fetchContent(`/person/${actorId}`),
        fetchContent(`/person/${actorId}/combined_credits`)
    ]);

    if (!actor || !credits) return;

    navigationStack.push({ page: 'details' });

    main.innerHTML = `
        <div class="details-container">
            <button class="back-button">← Back</button>
            <div class="actor-details">
                <div class="actor-info">
                    <img src="${actor.profile_path ? IMAGE_BASE_URL + actor.profile_path : 'https://via.placeholder.com/300x450'}" 
                         alt="${actor.name}" 
                         class="actor-image">
                    <div class="actor-bio">
                        <h1>${actor.name}</h1>
                        <p class="birth-info">Born: ${actor.birthday || 'N/A'}</p>
                        <p class="place-of-birth">Place of Birth: ${actor.place_of_birth || 'N/A'}</p>
                        <p class="biography">${actor.biography || 'No biography available.'}</p>
                    </div>
                </div>
                <div class="filmography">
                    <h2>Filmography</h2>
                    <div class="movies-grid">
                        ${credits.cast
                            .sort((a, b) => b.popularity - a.popularity)
                            .slice(0, 20)
                            .map(credit => {
                                const type = credit.media_type;
                                const title = type === 'movie' ? credit.title : credit.name;
                                const rating = credit.vote_average ? `⭐ ${credit.vote_average.toFixed(1)}` : 'No rating';
                                return `
                                    <div class="movie-card" onclick="showDetails(${credit.id}, '${type}')">
                                        <img src="${credit.poster_path ? IMAGE_BASE_URL + credit.poster_path : 'https://via.placeholder.com/500x750'}" 
                                             alt="${title}" 
                                             class="movie-poster">
                                        <div class="movie-info">
                                            <h3>${title}</h3>
                                            <p class="character">${credit.character || 'Unknown Role'}</p>
                                            <p class="rating">${rating}</p>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    const backButton = document.querySelector('.back-button');
    backButton.addEventListener('click', () => {
        navigationStack.pop();
        const previous = navigationStack[navigationStack.length - 1];
        if (previous.type === 'content') {
            showDetails(previous.id, previous.contentType);
        } else {
            displayContent(previous.page);
        }
    });
}

// Show details function with VidSrc streaming
async function showDetails(id, type) {
    const [details, credits, videos, externalIds] = await Promise.all([
        fetchContent(`/${type}/${id}`),
        fetchContent(`/${type}/${id}/credits`),
        fetchContent(`/${type}/${id}/videos`),
        fetchContent(`/${type}/${id}/external_ids`)
    ]);
    
    if (!details || !credits) return;

    const title = type === 'movie' ? details.title : details.name;
    const releaseDate = type === 'movie' ? details.release_date : details.first_air_date;
    const runtime = type === 'movie' ? `${details.runtime} minutes` : `${details.number_of_seasons} seasons`;
    const userRating = ratings[`${type}-${id}`] || 0;
    const contentComments = comments[`${type}-${id}`] || [];
    const rating = details.vote_average ? `⭐ ${details.vote_average.toFixed(1)}` : 'No rating';

    // Get trailer
    const trailer = videos?.results?.find(video => 
        video.type === 'Trailer' && video.site === 'YouTube'
    );

    // Get IMDb ID for streaming
    const imdbId = externalIds?.imdb_id;
    
    // Construct VidSrc URL based on content type
    const getVidsrcUrl = (season = null, episode = null) => {
        if (!imdbId) return null;
        if (type === 'movie') {
            return `https://vidsrc.icu/embed/movie/${imdbId}`;
        } else {
            const s = season || 1;
            const e = episode || 1;
            return `https://vidsrc.icu/embed/tv/${imdbId}/${s}/${e}`;
        }
    };
    
    const initialVidsrcUrl = getVidsrcUrl();

    main.innerHTML = `
        <div class="details-container">
            <div class="details-backdrop" style="background-image: url(${BACKDROP_BASE_URL}${details.backdrop_path})">
                <div class="details-content">
                    <div class="details-poster">
                        <button class="back-button">← Back</button>
                        <img src="${IMAGE_BASE_URL}${details.poster_path}" alt="${title}">
                    </div>
                    <div class="details-info">
                        <h1>${title}</h1>
                        <p class="release-date">Release Date: ${releaseDate}</p>
                        <p class="runtime">Runtime: ${runtime}</p>
                        <p class="rating">Rating: ${rating}</p>
                        <p class="overview">${details.overview}</p>
                        <div class="genres">
                            ${details.genres.map(genre => `<span class="genre">${genre.name}</span>`).join('')}
                        </div>
                        
                        <div class="user-rating">
                            <h3>Your Rating</h3>
                            <div class="stars">
                                ${Array.from({ length: 5 }, (_, i) => `
                                    <span class="star ${i < userRating ? 'active' : ''}" data-rating="${i + 1}">⭐</span>
                                `).join('')}
                            </div>
                        </div>
                        
                        ${currentUser ? `
                            <div class="content-actions">
                                <button class="action-button watchlist-button" onclick="addToWatchlist(${JSON.stringify(details).replace(/"/g, '&quot;')}, '${type}')">
                                    📋 Add to Watchlist
                                </button>
                                <button class="action-button" id="share-btn">
                                    <span>🔗</span> Share
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <div class="content-section">
                ${(trailer || initialVidsrcUrl) ? `
                    <section class="video-player-section">
                        <div class="video-controls">
                            <button class="video-btn ${!trailer ? 'disabled' : ''}" id="watch-trailer" ${!trailer ? 'disabled' : ''}>
                                🎬 Watch Trailer
                            </button>
                            <button class="video-btn ${!initialVidsrcUrl ? 'disabled' : ''}" id="watch-content" ${!initialVidsrcUrl ? 'disabled' : ''}>
                                ▶️ ${type === 'movie' ? 'Watch Movie' : 'Watch Episode'}
                            </button>
                        </div>
                        ${type === 'tv' && details.seasons && details.seasons.length > 0 ? `
                            <div class="episode-selection">
                                <div class="selection-group">
                                    <label for="season-select">Season:</label>
                                    <select id="season-select">
                                        ${details.seasons
                                            .filter(season => season.season_number > 0)
                                            .map(season => `
                                                <option value="${season.season_number}">
                                                    Season ${season.season_number}
                                                </option>
                                            `).join('')}
                                    </select>
                                </div>
                                <div class="selection-group">
                                    <label for="episode-select">Episode:</label>
                                    <select id="episode-select">
                                        <option value="1">Episode 1</option>
                                    </select>
                                </div>
                            </div>
                        ` : ''}
                        <div class="video-container">
                            <iframe id="video-player" 
                                    src="${trailer ? `https://www.youtube.com/embed/${trailer.key}` : ''}"
                                    frameborder="0" 
                                    allowfullscreen>
                            </iframe>
                        </div>
                    </section>
                ` : ''}

                <section class="cast-section">
                    <h2>Cast</h2>
                    <div class="cast-grid">
                        ${credits.cast.slice(0, 8).map(actor => `
                            <div class="cast-card" onclick="showActorDetails(${actor.id})">
                                <img src="${actor.profile_path ? IMAGE_BASE_URL + actor.profile_path : 'https://via.placeholder.com/300x450'}" 
                                     alt="${actor.name}">
                                <h4>${actor.name}</h4>
                                <p>${actor.character}</p>
                            </div>
                        `).join('')}
                    </div>
                </section>

                <section class="comments-section">
                    <h2>comment<h2>
                    <div class="comments">
                        ${contentComments.map(comment => `
                            <div class="comment">
                                <p>${comment.text}</p>
                                <span>${new Date(comment.date).toLocaleDateString()}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="add-comment">
                        <textarea class="comment-input" placeholder="Add your comment..."></textarea>
                        <button class="submit-comment">Submit Comment</button>
                    </div>
                </section>
            </div>
        </div>
    `;

    const backButton = document.querySelector('.back-button');
    backButton.addEventListener('click', () => {
        navigationStack.pop();
        const previous = navigationStack[navigationStack.length - 1];
        displayContent(previous.page);
    });

    // Helper function to update video source
    const updateVideoSource = (src) => {
        const videoPlayer = document.getElementById('video-player');
        if (videoPlayer && src) {
            videoPlayer.src = src;
        }
    };

    // Season and Episode selection for TV shows
    if (type === 'tv' && details.seasons && details.seasons.length > 0) {
        const seasonSelect = document.getElementById('season-select');
        const episodeSelect = document.getElementById('episode-select');
        
        // Function to load episodes for a season
        const loadEpisodes = async (seasonNumber) => {
            try {
                const seasonData = await fetchContent(`/tv/${id}/season/${seasonNumber}`);
                if (seasonData && seasonData.episodes) {
                    // Clear existing episodes
                    episodeSelect.innerHTML = '';
                    
                    // Populate episodes
                    seasonData.episodes.forEach(episode => {
                        const option = document.createElement('option');
                        option.value = episode.episode_number;
                        option.textContent = `Episode ${episode.episode_number}${episode.name ? ` - ${episode.name}` : ''}`;
                        episodeSelect.appendChild(option);
                    });
                    
                    // Update video source to first episode of the season
                    const newUrl = getVidsrcUrl(seasonNumber, 1);
                    if (newUrl) {
                        updateVideoSource(newUrl);
                    }
                }
            } catch (error) {
                console.error('Error loading episodes:', error);
            }
        };
        
        // Load initial episodes for first season
        if (seasonSelect.value) {
            loadEpisodes(parseInt(seasonSelect.value));
        }
        
        // Season change handler
        seasonSelect.addEventListener('change', () => {
            const selectedSeason = parseInt(seasonSelect.value);
            loadEpisodes(selectedSeason);
        });
        
        // Episode change handler
        episodeSelect.addEventListener('change', () => {
            const selectedSeason = parseInt(seasonSelect.value);
            const selectedEpisode = parseInt(episodeSelect.value);
            const newUrl = getVidsrcUrl(selectedSeason, selectedEpisode);
            if (newUrl) {
                updateVideoSource(newUrl);
            }
        });
    }

    // Add event listeners for rating stars
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            ratings[`${type}-${id}`] = rating;
            localStorage.setItem('ratings', JSON.stringify(ratings));
            
            stars.forEach((s, i) => {
                s.classList.toggle('active', i < rating);
            });
        });
    });

    // Add event listener for comment submission
    const commentInput = document.querySelector('.comment-input');
    const submitButton = document.querySelector('.submit-comment');
    
    submitButton.addEventListener('click', () => {
        const text = commentInput.value.trim();
        if (text) {
            const comment = {
                text,
                date: new Date().toISOString()
            };
            
            if (!comments[`${type}-${id}`]) {
                comments[`${type}-${id}`] = [];
            }
            
            comments[`${type}-${id}`].unshift(comment);
            localStorage.setItem('comments', JSON.stringify(comments));
            
            // Update comments list
            const commentsList = document.querySelector('.comments-list');
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <p>${comment.text}</p>
                <span>${new Date(comment.date).toLocaleDateString()}</span>
            `;
            commentsList.insertBefore(commentElement, commentsList.firstChild);
            
            commentInput.value = '';
        }
    });

    // Add video player controls
    const watchTrailerBtn = document.getElementById('watch-trailer');
    const watchContentBtn = document.getElementById('watch-content');
    const videoPlayer = document.getElementById('video-player');

    if (watchTrailerBtn && !watchTrailerBtn.disabled) {
        watchTrailerBtn.addEventListener('click', () => {
            videoPlayer.src = `https://www.youtube.com/embed/${trailer.key}`;
            
            // Update button states
            watchTrailerBtn.classList.add('active');
            if (watchContentBtn) watchContentBtn.classList.remove('active');
        });
    }

    if (watchContentBtn && !watchContentBtn.disabled) {
        watchContentBtn.addEventListener('click', async () => {  
          const { data: { session } } = await supabase.auth.getSession();

          if (!session) {
              showAlert('error', 'Login Required', 'Please login to Watch the Movies');
              return; // Stop execution if user is not logged in
}
            // Add to watch history when user starts watching
            addToWatchHistory(details, type);
            
            let contentUrl;
            if (type === 'tv') {
                const seasonSelect = document.getElementById('season-select');
                const episodeSelect = document.getElementById('episode-select');
                const selectedSeason = seasonSelect ? parseInt(seasonSelect.value) : 1;
                const selectedEpisode = episodeSelect ? parseInt(episodeSelect.value) : 1;
                contentUrl = getVidsrcUrl(selectedSeason, selectedEpisode);
            } else {
                contentUrl = getVidsrcUrl();
            }
            
            if (contentUrl) {
                videoPlayer.src = contentUrl;
            }
            
            // Update button states
            watchContentBtn.classList.add('active');
            if (watchTrailerBtn) watchTrailerBtn.classList.remove('active');
        });
    }

    // Share button functionality
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: details.title || details.name,
                text: `Check out "${details.title || details.name}" - ${details.overview ? details.overview.substring(0, 100) + '...' : 'A great movie/show to watch!'}`,
                url: `${window.location.origin}${window.location.pathname}#details/${type}/${details.id}`
            };

            try {
                // Check if Web Share API is supported
                if (navigator.share) {
                    await navigator.share(shareData);
                    showAlert('success', 'Shared!', 'Content shared successfully!');
                } else {
                    // Fallback: Copy to clipboard
                    const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
                    
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(shareText);
                        showAlert('success', 'Copied!', 'Link copied to clipboard!');
                    } else {
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = shareText;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        showAlert('success', 'Copied!', 'Link copied to clipboard!');
                    }
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    // User didn't cancel the share, so there was an actual error
                    console.error('Error sharing:', error);
                    showAlert('error', 'Share Failed', 'Failed to share content. Please try again.');
                }
            }
        });
    }

    // Set initial active state
    if (watchContentBtn && !watchContentBtn.disabled) {
        watchContentBtn.classList.add('active');
        // Set initial video source for TV shows
        if (type === 'tv' && initialVidsrcUrl) {
            videoPlayer.src = initialVidsrcUrl;
        }
    } else if (watchTrailerBtn && !watchTrailerBtn.disabled) {
        watchTrailerBtn.classList.add('active');
    }
}

// Personalized Recommendations
async function loadPersonalizedRecommendations() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        // Hide recommendations section for non-authenticated users
        const recommendationsSection = document.getElementById('recommendations-section');
        if (recommendationsSection) {
            recommendationsSection.style.display = 'none';
        }
        return;
    }

    try {
        // Show loading state
        const recommendationsGrid = document.getElementById('recommendations-grid');
        if (recommendationsGrid) {
            recommendationsGrid.innerHTML = '<div class="loading">Loading personalized recommendations...</div>';
        }

        // Get user preferences from database
        const userPreferences = await getUserPreferences(user.id);
        
        // Get recommendations based on preferences
        const recommendations = await generateRecommendations(userPreferences, user.id);
        
        // Display recommendations
        displayRecommendations(recommendations);
        
    } catch (error) {
        console.error('Error loading recommendations:', error);
        const recommendationsGrid = document.getElementById('recommendations-grid');
        if (recommendationsGrid) {
            recommendationsGrid.innerHTML = '<div class="error-state"><h3>Unable to load recommendations</h3><p>Please try again later.</p></div>';
        }
    }
}

async function getUserPreferences(userId) {
    try {
        // Get user's watch history
        const { data: watchHistory, error: historyError } = await supabase
            .from('user_watch_history')
            .select('content_type, genres')
            .eq('user_id', userId)
            .limit(50);

        if (historyError) throw historyError;

        // Get user's ratings
        const { data: ratings, error: ratingsError } = await supabase
            .from('user_ratings')
            .select('content_type, genres, rating')
            .eq('user_id', userId)
            .gte('rating', 4) // Only consider highly rated content
            .limit(50);

        if (ratingsError) throw ratingsError;

        // Get explicit preferences if available
        const { data: explicitPrefs, error: prefsError } = await supabase
            .from('user_preferences')
            .select('preferred_genres, preferred_content_types')
            .eq('user_id', userId)
            .maybeSingle();

        // Analyze preferences
        const preferences = analyzeUserPreferences(watchHistory, ratings, explicitPrefs);
        return preferences;
        
    } catch (error) {
        console.error('Error fetching user preferences:', error);
        return {
            preferredGenres: [],
            preferredContentTypes: ['movie', 'tv'],
            confidence: 0
        };
    }
}

function analyzeUserPreferences(watchHistory, ratings, explicitPrefs) {
    const genreCount = {};
    const contentTypeCount = {};
    
    // Process watch history
    watchHistory?.forEach(item => {
        // Count content types
        contentTypeCount[item.content_type] = (contentTypeCount[item.content_type] || 0) + 1;
        
        // Count genres
        if (item.genres && Array.isArray(item.genres)) {
            item.genres.forEach(genre => {
                genreCount[genre] = (genreCount[genre] || 0) + 1;
            });
        }
    });
    
    // Process ratings (give more weight to highly rated content)
    ratings?.forEach(item => {
        const weight = item.rating === 5 ? 3 : 2; // 5-star ratings get more weight
        
        contentTypeCount[item.content_type] = (contentTypeCount[item.content_type] || 0) + weight;
        
        if (item.genres && Array.isArray(item.genres)) {
            item.genres.forEach(genre => {
                genreCount[genre] = (genreCount[genre] || 0) + weight;
            });
        }
    });
    
    // Sort and get top preferences
    const topGenres = Object.entries(genreCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([genre]) => genre);
    
    const topContentTypes = Object.entries(contentTypeCount)
        .sort(([,a], [,b]) => b - a)
        .map(([type]) => type);
    
    // Use explicit preferences if available, otherwise use inferred
    const preferredGenres = explicitPrefs?.preferred_genres?.length > 0 
        ? explicitPrefs.preferred_genres 
        : topGenres;
    
    const preferredContentTypes = explicitPrefs?.preferred_content_types?.length > 0 
        ? explicitPrefs.preferred_content_types 
        : topContentTypes.length > 0 ? topContentTypes : ['movie', 'tv'];
    
    return {
        preferredGenres,
        preferredContentTypes,
        confidence: Math.min((watchHistory?.length || 0) + (ratings?.length || 0), 10) / 10
    };
}

async function generateRecommendations(preferences, userId) {
    const recommendations = [];
    const seenContent = await getSeenContent(userId);
    
    // Get genre IDs for TMDB API
    const genreMap = await getGenreMap();
    const genreIds = preferences.preferredGenres
        .map(genreName => genreMap[genreName])
        .filter(id => id)
        .slice(0, 3); // Limit to top 3 genres
    
    // Generate recommendations for each preferred content type
    for (const contentType of preferences.preferredContentTypes.slice(0, 2)) {
        try {
            const endpoint = contentType === 'movie' ? 'discover/movie' : 'discover/tv';
            const params = new URLSearchParams({
                api_key: API_KEY,
                sort_by: 'popularity.desc',
                'vote_average.gte': '6.5',
                'vote_count.gte': '100',
                page: '1'
            });
            
            if (genreIds.length > 0) {
                params.append('with_genres', genreIds.join(','));
            }
            
            const response = await fetch(`${API_BASE_URL}/${endpoint}?${params}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Trending content fetch failed:', response.status, errorText);
                return [];
            }
            
            const data = await response.json();
            
            if (data.results) {
                // Filter out content user has already seen
                const unseenContent = data.results.filter(item => {
                    const contentId = item.id.toString();
                    return !seenContent.has(`${contentId}-${contentType}`);
                });
                
                // Add content type for consistency
                unseenContent.forEach(item => {
                    item.content_type = contentType;
                });
                
                recommendations.push(...unseenContent.slice(0, 6));
            }
        } catch (error) {
            console.error(`Error fetching ${contentType} recommendations:`, error);
        }
    }
    
    // If we don't have enough recommendations, add some trending content
    if (recommendations.length < 8) {
        try {
            const trendingResponse = await fetch(`${API_BASE_URL}/trending/all/week?api_key=${API_KEY}`);
            const trendingData = await trendingResponse.json();
            
            if (trendingData.results) {
                const unseenTrending = trendingData.results.filter(item => {
                    const contentId = item.id.toString();
                    const contentType = item.media_type;
                    return !seenContent.has(`${contentId}-${contentType}`) && 
                           !recommendations.some(rec => rec.id === item.id);
                });
                
                recommendations.push(...unseenTrending.slice(0, 8 - recommendations.length));
            }
        } catch (error) {
            console.error('Error fetching trending content:', error);
        }
    }
    
    return recommendations.slice(0, 12); // Limit to 12 recommendations
}

async function getSeenContent(userId) {
    const seenContent = new Set();
    
    try {
        // Get watched content
        const { data: watchHistory } = await supabase
            .from('user_watch_history')
            .select('content_id, content_type')
            .eq('user_id', userId);
        
        watchHistory?.forEach(item => {
            seenContent.add(`${item.content_id}-${item.content_type}`);
        });
        
        // Get rated content
        const { data: ratings } = await supabase
            .from('user_ratings')
            .select('content_id, content_type')
            .eq('user_id', userId);
        
        ratings?.forEach(item => {
            seenContent.add(`${item.content_id}-${item.content_type}`);
        });
        
        // Get watchlist content
        const { data: watchlist } = await supabase
            .from('user_watchlist')
            .select('content_id, content_type')
            .eq('user_id', userId);
        
        watchlist?.forEach(item => {
            seenContent.add(`${item.content_id}-${item.content_type}`);
        });
        
    } catch (error) {
        console.error('Error fetching seen content:', error);
    }
    
    return seenContent;
}

async function getGenreMap() {
    // Create a mapping of genre names to IDs for TMDB API
    const genreMap = {};
    
    try {
        // Get movie genres
        const movieGenresResponse = await fetch(`${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        const movieGenres = await movieGenresResponse.json();
        
        // Get TV genres
        const tvGenresResponse = await fetch(`${API_BASE_URL}/genre/tv/list?api_key=${API_KEY}`);
        const tvGenres = await tvGenresResponse.json();
        
        // Combine and map genres
        [...(movieGenres.genres || []), ...(tvGenres.genres || [])].forEach(genre => {
            genreMap[genre.name] = genre.id;
        });
        
    } catch (error) {
        console.error('Error fetching genre map:', error);
    }
    
    return genreMap;
}

function displayRecommendations(recommendations) {
    const recommendationsGrid = document.getElementById('recommendations-grid');
    const recommendationsSection = document.getElementById('recommendations-section');
    
    if (!recommendationsGrid || !recommendationsSection) return;
    
    if (recommendations.length === 0) {
        recommendationsSection.style.display = 'none';
        return;
    }
    
    recommendationsSection.style.display = 'block';
    recommendationsGrid.innerHTML = '';
    
    recommendations.forEach(item => {
        const card = createContentCard(item, item.content_type || (item.title ? 'movie' : 'tv'));
        recommendationsGrid.appendChild(card);
    });
}

// Display content based on current page
async function displayContent(page) {
    currentPage = page;
    navigationStack = [{ page }];
    
    if (page === 'profile') {
        if (!currentUser) {
            main.innerHTML = `
                <div class="content-section">
                    <div class="auth-required">
                        <h2>Login Required</h2>
                        <p>Please login to view your profile</p>
                        <button class="auth-btn" onclick="document.getElementById('login-modal').style.display='block'">Login</button>
                    </div>
                </div>
            `;
            return;
        }
        
        main.innerHTML = `
            <div class="content-section">
                <div class="profile-header">
                    <h1>My Profile</h1>
                    <p>Welcome back, ${currentUser.email}</p>
                </div>
                
                <div class="profile-tabs">
                    <button class="tab-btn active" data-tab="watchlist">My Watchlist</button>
                    <button class="tab-btn" data-tab="history">Watch History</button>
                </div>
                
                <div class="tab-content">
                    <div id="watchlist-tab" class="tab-pane active">
                        <div class="section-header">
                            <h2>My Watchlist</h2>
                            <p>Items you want to watch later</p>
                        </div>
                        <div class="movies-grid" id="watchlist-grid">
                            <div class="loading">Loading watchlist...</div>
                        </div>
                    </div>
                    
                    <div id="history-tab" class="tab-pane">
                        <div class="section-header">
                            <h2>Watch History</h2>
                            <p>Content you've recently watched</p>
                        </div>
                        <div class="movies-grid" id="history-grid">
                            <div class="loading">Loading watch history...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Setup tab functionality
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active tab pane
                tabPanes.forEach(pane => pane.classList.remove('active'));
                document.getElementById(`${tabName}-tab`).classList.add('active');
                
                // Load content for the selected tab
                if (tabName === 'watchlist') {
                    loadWatchlist();
                } else if (tabName === 'history') {
                    loadWatchHistory();
                }
            });
        });
        
        // Load initial watchlist
        loadWatchlist();
        
    } else if (page === 'movies') {
        main.innerHTML = `
            <div class="hero-section splide">
                <div class="splide__track">
                    <div class="splide__list" id="hero-slider"></div>
                </div>
            </div>
            <div class="content-section">
                <h2>Trending Movies</h2>
                <div class="movies-grid" id="trending-grid"></div>
                
                <h2>Popular Movies</h2>
                <div class="movies-grid" id="movies-grid"></div>
            </div>
        `;
    } else if (page === 'tvshows') {
        main.innerHTML = `
            <div class="hero-section splide">
                <div class="splide__track">
                    <div class="splide__list" id="hero-slider"></div>
                </div>
            </div>
            <div class="content-section">
                <h2>Trending TV Shows</h2>
                <div class="movies-grid" id="trending-grid"></div>
                
                <h2>Popular TV Shows</h2>
                <div class="movies-grid" id="tvshows-grid"></div>
            </div>
        `;
    } else if (page === 'anime') {
        main.innerHTML = `
            <div class="hero-section splide">
                <div class="splide__track">
                    <div class="splide__list" id="hero-slider"></div>
                </div>
            </div>
            <div class="content-section">
                <h2>Trending Anime</h2>
                <div class="movies-grid" id="trending-grid"></div>
                
                <h2>Popular Anime</h2>
                <div class="movies-grid" id="anime-grid"></div>
            </div>
        `;
    } else {
        main.innerHTML = `
            <div class="hero-section splide">
                <div class="splide__track">
                    <div class="splide__list" id="hero-slider"></div>
                </div>
            </div>
            <div class="content-section">
                <div id="recommendations-section" style="display: none;">
                    <h2>Recommended for You</h2>
                    <div class="movies-grid" id="recommendations-grid"></div>
                </div>
                
                <h2>Trending Now</h2>
                <div class="movies-grid" id="trending-grid"></div>
                
                <h2>Popular Movies</h2>
                <div class="movies-grid" id="movies-grid"></div>
                
                <h2>Popular TV Shows</h2>
                <div class="movies-grid" id="tvshows-grid"></div>
            </div>
        `;
    }

    const heroSlider = document.getElementById('hero-slider');
    const trendingGrid = document.getElementById('trending-grid');
    const moviesGrid = document.getElementById('movies-grid');
    const tvShowsGrid = document.getElementById('tvshows-grid');
    const animeGrid = document.getElementById('anime-grid');

    switch(page) {
        case 'home':
            const trending = await fetchContent('/trending/all/week');
            const movies = await fetchContent('/movie/popular');
            const tvShows = await fetchContent('/tv/popular');
            
            // Setup hero slider for home
            trending.results.slice(0, 5).forEach(item => {
                const slide = document.createElement('div');
                slide.className = 'splide__slide';
                slide.innerHTML = `
                    <div class="hero-slide" style="background-image: url(${BACKDROP_BASE_URL}${item.backdrop_path})">
                        <div class="hero-content">
                            <h2>${item.title || item.name}</h2>
                            <p>${item.overview}</p>
                            <div class="hero-buttons">
                                <button class="hero-btn primary" data-id="${item.id}" data-type="${item.title ? 'movie' : 'tv'}">
                                    Watch Now
                                </button>
                                <button class="hero-btn secondary" data-id="${item.id}" data-type="${item.title ? 'movie' : 'tv'}">
                                    More Info
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                heroSlider.appendChild(slide);
            });

            // Initialize Splide slider
            new Splide('.splide', {
                type: 'fade',
                rewind: true,
                autoplay: true,
                interval: 5000,
            }).mount();

            // Load personalized recommendations
            loadPersonalizedRecommendations();

            // Display content in grids
            trending.results.forEach(item => {
                const type = item.media_type || (item.title ? 'movie' : 'tv');
                trendingGrid.appendChild(createContentCard(item, type));
            });

            movies.results.forEach(movie => {
                moviesGrid.appendChild(createContentCard(movie, 'movie'));
            });

            tvShows.results.forEach(show => {
                tvShowsGrid.appendChild(createContentCard(show, 'tv'));
            });
            break;

        case 'movies':
            const trendingMovies = await fetchContent('/trending/movie/week');
            const popularMovies = await fetchContent('/movie/popular');
            
            // Setup hero slider for Movies
            popularMovies.results.slice(0, 5).forEach(movie => {
                const slide = document.createElement('div');
                slide.className = 'splide__slide';
                slide.innerHTML = `
                    <div class="hero-slide" style="background-image: url(${BACKDROP_BASE_URL}${movie.backdrop_path})">
                        <div class="hero-content">
                            <h2>${movie.title}</h2>
                            <p>${movie.overview}</p>
                            <div class="hero-buttons">
                                <button class="hero-btn primary" data-id="${movie.id}" data-type="movie">
                                    Watch Now
                                </button>
                                <button class="hero-btn secondary" data-id="${movie.id}" data-type="movie">
                                    More Info
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                heroSlider.appendChild(slide);
            });

            // Initialize Splide slider for Movies
            new Splide('.splide', {
                type: 'fade',
                rewind: true,
                autoplay: true,
                interval: 5000
            }).mount();

            // Display trending movies
            trendingMovies.results.forEach(movie => {
                trendingGrid.appendChild(createContentCard(movie, 'movie'));
            });

            // Display popular movies
            popularMovies.results.forEach(movie => {
                moviesGrid.appendChild(createContentCard(movie, 'movie'));
            });
            break;

        case 'tvshows':
            const trendingTVShows = await fetchContent('/trending/tv/week');
            const popularTVShows = await fetchContent('/tv/popular');
            
            // Setup hero slider for TV shows
            popularTVShows.results.slice(0, 5).forEach(show => {
                const slide = document.createElement('div');
                slide.className = 'splide__slide';
                slide.innerHTML = `
                    <div class="hero-slide" style="background-image: url(${BACKDROP_BASE_URL}${show.backdrop_path})">
                        <div class="hero-content">
                            <h2>${show.name}</h2>
                            <p>${show.overview}</p>
                            <div class="hero-buttons">
                                <button class="hero-btn primary" data-id="${show.id}" data-type="tv">
                                    Watch Now
                                </button>
                                <button class="hero-btn secondary" data-id="${show.id}" data-type="tv">
                                    More Info
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                heroSlider.appendChild(slide);
            });

            // Initialize Splide slider for TV shows
            new Splide('.splide', {
                type: 'fade',
                rewind: true,
                autoplay: true,
                interval: 5000
            }).mount();

            // Display trending TV shows
            trendingTVShows.results.forEach(show => {
                trendingGrid.appendChild(createContentCard(show, 'tv'));
            });

            // Display popular TV shows
            popularTVShows.results.forEach(show => {
                tvShowsGrid.appendChild(createContentCard(show, 'tv'));
            });
            break;

        case 'anime':
            // Fetch anime content using multiple strategies for better filtering
            const [
                animationGenreContent,
                japaneseContent,
                animeKeywordContent
            ] = await Promise.all([
                fetchContent('/discover/tv?with_genres=16&sort_by=popularity.desc&with_origin_country=JP'),
                fetchContent('/discover/tv?with_origin_country=JP&sort_by=popularity.desc'),
                fetchContent('/discover/tv?with_keywords=210024|287928&sort_by=popularity.desc') // anime keywords
            ]);
            
            // Combine and filter results to get only anime
            const allAnimeResults = [
                ...(animationGenreContent?.results || []),
                ...(japaneseContent?.results || []),
                ...(animeKeywordContent?.results || [])
            ];
            
            // Remove duplicates and filter for anime content
            const uniqueAnime = allAnimeResults.filter((item, index, self) => 
                index === self.findIndex(t => t.id === item.id)
            );
            
            const filteredAnime = filterAnimeContent(uniqueAnime);
            
            // Get trending anime
            const trendingAnimeRaw = await fetchContent('/trending/tv/week?with_origin_country=JP');
            const trendingAnime = filterAnimeContent(trendingAnimeRaw?.results || []);
            
            // Setup hero slider for Anime
            filteredAnime.slice(0, 5).forEach(anime => {
                const slide = document.createElement('div');
                slide.className = 'splide__slide';
                slide.innerHTML = `
                    <div class="hero-slide" style="background-image: url(${BACKDROP_BASE_URL}${anime.backdrop_path})">
                        <div class="hero-content">
                            <h2>${anime.name}</h2>
                            <p>${anime.overview}</p>
                            <div class="hero-buttons">
                                <button class="hero-btn primary" data-id="${anime.id}" data-type="tv">
                                    Watch Now
                                </button>
                                <button class="hero-btn secondary" data-id="${anime.id}" data-type="tv">
                                    More Info
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                heroSlider.appendChild(slide);
            });

            // Initialize Splide slider for Anime
            new Splide('.splide', {
                type: 'fade',
                rewind: true,
                autoplay: true,
                interval: 5000
            }).mount();

            // Display trending anime
            trendingAnime.slice(0, 20).forEach(anime => {
                trendingGrid.appendChild(createContentCard(anime, 'tv'));
            });

            // Display popular anime
            filteredAnime.slice(0, 20).forEach(anime => {
                animeGrid.appendChild(createContentCard(anime, 'tv'));
            });
            break;

        case 'favorites':
            favorites.forEach(item => {
                const grid = item.contentType === 'movie' ? moviesGrid : tvShowsGrid;
                grid.appendChild(createContentCard(item, item.contentType));
            });
            break;
    }

    // Add event listeners for hero buttons
    const heroButtons = document.querySelectorAll('.hero-btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const type = button.dataset.type;
            navigationStack.push({ type: 'content', id, contentType: type });
            showDetails(id, type);
        });
    });
}

// Load user's watchlist
async function loadWatchlist() {
    if (!currentUser) return;
    
    const watchlistGrid = document.getElementById('watchlist-grid');
    if (!watchlistGrid) return;
    
    try {
        const { data: watchlist, error } = await supabase
            .from('user_watchlist')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('added_at', { ascending: false });

        if (error) throw error;

        watchlistGrid.innerHTML = '';
        
        if (watchlist.length === 0) {
            watchlistGrid.innerHTML = `
                <div class="empty-state">
                    <h3>Your watchlist is empty</h3>
                    <p>Add movies and TV shows you want to watch later</p>
                </div>
            `;
            return;
        }

        watchlist.forEach(item => {
            const card = createWatchlistCard(item);
            watchlistGrid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading watchlist:', error);
        watchlistGrid.innerHTML = `
            <div class="error-state">
                <h3>Error loading watchlist</h3>
                <p>Please try again later</p>
            </div>
        `;
    }
}

// Load user's watch history
async function loadWatchHistory() {
    if (!currentUser) return;
    
    const historyGrid = document.getElementById('history-grid');
    if (!historyGrid) return;
    
    try {
        const { data: history, error } = await supabase
            .from('user_watch_history')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('watched_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        historyGrid.innerHTML = '';
        
        if (history.length === 0) {
            historyGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No watch history</h3>
                    <p>Start watching content to see your history here</p>
                </div>
            `;
            return;
        }

        history.forEach(item => {
            const card = createHistoryCard(item);
            historyGrid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading watch history:', error);
        historyGrid.innerHTML = `
            <div class="error-state">
                <h3>Error loading watch history</h3>
                <p>Please try again later</p>
            </div>
        `;
    }
}

// Create watchlist card
function createWatchlistCard(item) {
    const card = document.createElement('div');
    card.className = 'movie-card watchlist-card';
    card.innerHTML = `
        <div class="movie-poster-container">
            <img src="${item.poster_path ? IMAGE_BASE_URL + item.poster_path : 'https://via.placeholder.com/500x750'}" 
                 alt="${item.title}"
                 class="movie-poster">
            <div class="card-actions">
                <button class="action-btn remove-btn" onclick="removeFromWatchlistAndRefresh('${item.content_id}', '${item.content_type}')" title="Remove from Watchlist">
                    ❌
                </button>
            </div>
        </div>
        <div class="movie-info">
            <h3>${item.title}</h3>
            <p class="added-date">Added ${new Date(item.added_at).toLocaleDateString()}</p>
            <div class="genres">
                ${item.genres.slice(0, 2).map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
            </div>
        </div>
    `;

    card.addEventListener('click', (e) => {
        if (e.target.classList.contains('action-btn')) {
            e.stopPropagation();
            return;
        }
        navigationStack.push({ page: currentPage });
        showDetails(item.content_id, item.content_type);
    });

    return card;
}

// Create history card
function createHistoryCard(item) {
    const card = document.createElement('div');
    card.className = 'movie-card history-card';
    card.innerHTML = `
        <div class="movie-poster-container">
            <img src="${item.poster_path ? IMAGE_BASE_URL + item.poster_path : 'https://via.placeholder.com/500x750'}" 
                 alt="${item.title}"
                 class="movie-poster">
            ${item.completed ? '<div class="completed-badge">✓</div>' : ''}
        </div>
        <div class="movie-info">
            <h3>${item.title}</h3>
            <p class="watch-date">Watched ${new Date(item.watched_at).toLocaleDateString()}</p>
            ${item.watch_duration > 0 ? `<p class="duration">Duration: ${Math.floor(item.watch_duration / 60)}m</p>` : ''}
            <div class="genres">
                ${item.genres.slice(0, 2).map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
            </div>
        </div>
    `;

    card.addEventListener('click', () => {
        navigationStack.push({ page: currentPage });
        showDetails(item.content_id, item.content_type);
    });

    return card;
}

// Remove from watchlist and refresh
async function removeFromWatchlistAndRefresh(contentId, contentType) {
    await removeFromWatchlist(contentId, contentType);
    loadWatchlist(); // Refresh the watchlist
}

// Search functionality for both desktop and mobile
function setupSearchFunctionality(searchInput, contentTypeSelect, genreSelectElement) {
    searchInput.addEventListener('input', debounce(async (e) => {
        const query = e.target.value.trim();
        const type = contentTypeSelect.value;
        const selectedGenre = genreSelectElement.value;
        
        if (!query && !selectedGenre) {
            displayContent(currentPage);
            return;
        }

        let endpoint = '/discover';
        let params = [];
        
        if (type !== 'all') {
            endpoint += `/${type}`;
        } else {
            endpoint += '/movie';
        }

        if (selectedGenre) {
            params.push(`with_genres=${selectedGenre}`);
        }

        if (query) {
            params.push(`&query=${encodeURIComponent(query)}`);
            endpoint = `/search/${type === 'all' ? 'multi' : type}`;
        }

        const data = await fetchContent(`${endpoint}?${params.join('&')}`);
        if (data && data.results) {
            displaySearchResults(data.results, type);
        }
    }, 500));
}

// Setup search for both desktop and mobile
setupSearchFunctionality(searchInput, contentType, genreSelect);
setupSearchFunctionality(mobileSearchInput, mobileContentType, mobileGenreSelect);

// Display search results
function displaySearchResults(results, type) {
    main.innerHTML = `
        <div class="content-section">
            <h2>Search Results</h2>
            <div class="movies-grid" id="search-results"></div>
        </div>
    `;

    const searchResults = document.getElementById('search-results');
    results.forEach(item => {
        if (type === 'all' || item.media_type === type || !item.media_type) {
            searchResults.appendChild(createContentCard(item, item.media_type || type));
        }
    });
}

// Navigation event listeners
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    homeLink.classList.add('active');
    displayContent('home');
});

moviesLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    moviesLink.classList.add('active');
    displayContent('movies');
});

tvShowsLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    tvShowsLink.classList.add('active');
    displayContent('tvshows');
});

animeLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    animeLink.classList.add('active');
    displayContent('anime');
});

profileLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    profileLink.classList.add('active');
    displayContent('profile');
});

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Toggle favorite
function toggleFavorite(item, type) {
    const index = favorites.findIndex(fav => fav.id === item.id);
    if (index === -1) {
        favorites.push({...item, contentType: type});
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Make functions globally accessible
window.showDetails = showDetails;
window.showActorDetails = showActorDetails;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleLogout = handleLogout;
window.addToWatchlist = addToWatchlist;
window.removeFromWatchlist = removeFromWatchlist;
window.removeFromWatchlistAndRefresh = removeFromWatchlistAndRefresh;

// Theme toggle
themeToggle.addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.body.setAttribute('data-theme', newTheme);
  themeToggle.textContent = newTheme === 'dark' ? '' : '';
  
  localStorage.setItem('theme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '' : '';

// Close modals when clicking outside
window.addEventListener('click', (e) => {
  const loginModal = document.getElementById('login-modal');
  const signupModal = document.getElementById('signup-modal');
  
  if (e.target === loginModal) {
    loginModal.style.display = 'none';
  }
  if (e.target === signupModal) {
    signupModal.style.display = 'none';
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadGenres();
    displayContent('home');
    loadPersonalizedRecommendations();
});
