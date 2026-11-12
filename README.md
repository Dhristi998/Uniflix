# UniFlix: Movies That Match Your Mood

UniFlix reads your facial expression through your webcam with in-browser machine learning and recommends movies that suit how you feel.

**Live demo:** _add your Vercel link here_

## What it does

- **Mood detection:** a pre-trained CNN (face-api.js, built on TensorFlow.js) finds your face, maps 68 facial landmarks and classifies your expression in real time. It smooths predictions over about one second of frames and shows a confidence score.
- **Mood-to-genre matching:** each of the 7 detectable emotions maps to genres that suit it. TMDB's Discover API then returns popular movies in those genres.
- **Movie browsing:** a Netflix-style home page with popular, trending, upcoming and top-rated rows. It also has genre and language filters, live search, and a detail page for each movie with cast, director, trailers and similar titles.
- **Accounts:** email sign-up, sign-in and password reset with Firebase Authentication. A guest mode lets visitors try everything without signing up.
- **Privacy:** all face analysis runs on your own device. No camera frames are uploaded or stored.

| Detected emotion | Suggested genres |
|---|---|
| Happy | Comedy, Adventure |
| Sad | Comedy, Family |
| Angry | Comedy, Animation |
| Surprised | Thriller, Mystery |
| Fearful | Animation, Family |
| Disgusted | Fantasy, Adventure |
| Neutral (calm) | Drama, Science Fiction |

## How it works

```
Webcam ──► face-api.js (in browser)
           ├─ Tiny Face Detector      → finds the face
           ├─ 68-point landmark model → maps facial features
           └─ Expression classifier   → 7 emotion probabilities
                      │
                      ▼
           Dominant emotion (averaged over recent frames)
                      │
                      ▼
           js/moods.js: emotion → TMDB genre IDs
                      │
                      ▼
Browser ──► /api/tmdb (Vercel serverless function, holds the API key) ──► TMDB API
```

The TMDB API key lives only on the server, as a Vercel environment variable. The browser calls `/api/tmdb`, which adds the key and forwards the request. Only an allow-list of TMDB endpoints is accepted.

## Tech stack

| Layer | Tools |
|---|---|
| Machine learning | face-api.js (TensorFlow.js): Tiny Face Detector, 68-point landmarks, expression classifier |
| Front end | HTML, CSS, vanilla JavaScript (ES modules) |
| Movie data | TMDB API |
| Backend | Vercel serverless function (Node.js) |
| Auth | Firebase Authentication (email and password) |
| Hosting | Vercel |

## Project structure

```
├── UniFlix.html          Landing page (served at /)
├── signup.html           Sign in / create account (Firebase)
├── main.html             Movie home page
├── moodDetector.html     Webcam mood detector  ← core feature
├── emotion.html          Shows detected mood + suggested genres
├── movielist.html        Movies for a mood, genre or language
├── detail.html           Single movie page
├── profile.html          Signed-in user profile
├── mood.js               Face detection + emotion logic
├── auth.js               Sign-in / sign-up logic
├── js/
│   ├── moods.js          Emotion → genre mapping
│   ├── api.js            Helper for calling /api/tmdb
│   ├── firebase-config.js  Your Firebase web config
│   └── ...               Home page, search, sidebar, cards, detail page
├── api/tmdb.js           Serverless TMDB proxy (keeps the key secret)
├── models/               Pre-trained face-api.js model weights
├── dev-server.js         Local development server
└── vercel.json           Vercel routing
```

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer and a free [TMDB API key](https://www.themoviedb.org/settings/api).

```bash
git clone https://github.com/Dhristi998/uniflix.git
cd uniflix
cp .env.example .env        # then paste your TMDB key into .env
npm run dev
```

Open http://localhost:3000. The camera works on `localhost` and on any `https` site.

## Deploy your own

1. Fork this repo.
2. Import it at [vercel.com/new](https://vercel.com/new). Leave Framework Preset as **Other** and leave the build settings empty.
3. Add the environment variable `TMDB_API_KEY`, then deploy.
4. Optional, for accounts: create a Firebase project and turn on **Email/Password** sign-in. Paste your web config into `js/firebase-config.js`, then add your Vercel domain under **Authentication → Settings → Authorized domains**.

## Future improvements

- More emotion categories (boredom, excitement, nostalgia)
- Group "watch party" mode that blends several viewers' moods
- Save favourite movies and mood history per user
- Streaming-availability info by region

## Acknowledgements

- [face-api.js](https://github.com/justadudewhohacks/face-api.js) for the face detection and expression models
- [TMDB](https://www.themoviedb.org/) for movie data. This product uses the TMDB API but is not endorsed or certified by TMDB.
- [Firebase](https://firebase.google.com/) for authentication
