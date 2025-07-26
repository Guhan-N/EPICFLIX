# 🎬 EPICFLIX
<img width="1895" height="901" alt="image" src="https://github.com/user-attachments/assets/2ae4c593-5db6-44ff-9ad8-541ca1f50cf8" />

## 📚 Table of Contents

* [About The Project](#about-the-project)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Database Schema](#database-schema)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Environment Variables](#environment-variables)
  * [Running the Project](#running-the-project)
* [Ad-Free Viewing Suggestion](#ad-free-viewing-suggestion)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## 📝 About The Project

**EPICFLIX** is a comprehensive entertainment discovery platform that brings together movies, TV shows, and anime in one seamless experience. Built with modern web technologies and powered by TMDB API, EPICFLIX offers personalized recommendations, detailed content information, and social features to enhance your entertainment journey. Whether you're looking for the latest blockbusters, hidden gems, or tracking your viewing progress, EPICFLIX provides an intuitive and engaging platform for all your entertainment needs.

---

## 🚀 Features

### 🔍 Content Discovery

* Browse trending and popular movies, TV shows, and anime.
* Search and filter by genre and type.
* Featured content slider on homepage.
* Share content with direct links to movies and shows.
* Detailed content pages with cast, crew, trailers, and streaming availability.

### 🔐 User Authentication

* Secure registration and login.
* Session management with Supabase Auth.
* Profile management with personalized dashboard.

### 🎯 Personalized Experience

* **Watchlist** management.
* **Watch history** tracking with completion status.
* **Ratings** (1–5 stars).
* **Smart recommendations** based on viewing history and preferences.
* **User preferences** for genres, actors, and content types.

### 📄 Detailed Content Pages

* Comprehensive overview with plot summaries and metadata.
* Cast and crew information with detailed profiles.
* High-quality trailers and video content.
* Streaming availability across different platforms.
* User ratings and community engagement features.

### 💡 UI/UX

* Fully responsive (mobile, tablet, desktop).
* Interactive card actions (add/remove from watchlist, update status).
* **Mobile-first design** with intuitive sidebar navigation.
* **Smart alert system** with success, error, and info notifications.
* **Smooth animations** and micro-interactions for enhanced user experience.

---

## 🛠 Technologies Used

### Frontend

* HTML5
* CSS3 (with CSS variables)
* Vanilla JavaScript (ES6+)
* Responsive Design with Mobile-First Approach

### Libraries

* [@splidejs/splide](https://splidejs.com/) – Hero/content slider functionality
* [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript) – Database and authentication

### Backend & Database

* [Supabase](https://supabase.com/)
  * PostgreSQL database
  * Authentication
  * Row Level Security (RLS)
  * Real-time subscriptions

### External API

* [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api) – Movie, TV show, and anime metadata
* [YouTube API](https://developers.google.com/youtube/v3) – Trailer and video content

---

## 🗃️ Database Schema

**Supabase PostgreSQL Tables:**

### `profiles`

Stores user profile information and usernames.

### `user_watch_history`

Tracks what users have watched.

### `user_ratings`

Stores user ratings for each content item.

### `user_preferences`

Saves preferred genres, actors, content types, and other preferences for personalized recommendations.

### `user_watchlist`

Holds content users have added to their watchlist.

**All tables are secured with Row Level Security (RLS) policies to ensure users can only access their own data.**

---

## 🛠️ Getting Started

Follow these steps to run the project locally.

### ✅ Prerequisites

* Modern web browser (Chrome, Firefox, Safari, Edge)
* Internet connection for API access
* For development: Any local web server or live server extension

### 📦 Installation

```bash
git clone https://github.com/your-username/epicflix.git
cd epicflix
```

### 🔐 Environment Variables

The project uses environment variables that are already configured in the `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** TMDB API key is handled server-side for security.

### ▶️ Running the Project

#### Option 1: Using a local web server

```bash
# Using Python (if installed)
python -m http.server 3000

# Using Node.js (if installed)
npx http-server -p 3000

# Using PHP (if installed)
php -S localhost:3000
```

#### Option 2: Using VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

#### Option 3: Direct file access

Simply open `index.html` in your web browser (some features may be limited due to CORS restrictions).

Visit `http://localhost:3000` (or your chosen port) to view the app.

---

## 🧼 Ad-Free Viewing Suggestion

To ensure a smoother, distraction-free experience while browsing or watching trailers (which may come from external platforms like YouTube), we recommend:

- 🛡️ Installing an ad blocker extension such as **[uBlock Origin](https://ublockorigin.com/)**
- 🦁 Or using a privacy-focused browser like **[Brave](https://brave.com/)**

> EPICFLIX does **not serve ads**, but external links (e.g., trailers from YouTube or embeds from TMDB) may show ads.  
> Using the above tools ensures a cleaner viewing experience.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help improve EPICFLIX:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/amazing-feature`).
3. Make your changes and commit them (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

### 🐛 Bug Reports

If you find a bug, please create an issue with:
- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)

### 💡 Feature Requests

We welcome feature suggestions! Please create an issue with:
- A clear description of the feature
- Why it would be useful
- Any implementation ideas you might have

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**Project Author**: [Guhan.N]  
**GitHub**: [@Guhan-N](https://github.com/Guhan-N)  
**Live Demo**: [https://epicflix007.netlify.app/](https://epicflix007.netlify.app/)  
**Email**: guhan6575@gmail.com

---

## 🙏 Acknowledgments

* [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing comprehensive movie and TV show data
* [Supabase](https://supabase.com/) for the excellent backend-as-a-service platform
* [Splide.js](https://splidejs.com/) for the smooth carousel functionality
* All contributors and users who help make EPICFLIX better

---

> **Thanks for checking out EPICFLIX!** ⭐ If you find this project helpful, please consider giving it a star on GitHub and sharing it with others who might enjoy it!

---
