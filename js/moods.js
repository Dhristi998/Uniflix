'use strict';

// Maps each emotion that face-api.js can detect to the movie genres we suggest.
// Genre IDs are TMDB's official movie genre IDs.
// Multiple genres are joined with "|" so TMDB returns movies matching ANY of them.

export const MOODS = {
    happy: {
        label: "happy",
        genres: [{ id: 35, name: "Comedy" }, { id: 12, name: "Adventure" }],
        pitch: "Let's keep the good vibes going."
    },
    sad: {
        label: "sad",
        genres: [{ id: 35, name: "Comedy" }, { id: 10751, name: "Family" }],
        pitch: "Here's something to lift your spirits."
    },
    angry: {
        label: "angry",
        genres: [{ id: 35, name: "Comedy" }, { id: 16, name: "Animation" }],
        pitch: "Time to cool down with something light."
    },
    surprised: {
        label: "surprised",
        genres: [{ id: 53, name: "Thriller" }, { id: 9648, name: "Mystery" }],
        pitch: "You're in the mood for twists and turns."
    },
    fearful: {
        label: "fearful",
        genres: [{ id: 16, name: "Animation" }, { id: 10751, name: "Family" }],
        pitch: "Something comforting and safe."
    },
    disgusted: {
        label: "disgusted",
        genres: [{ id: 14, name: "Fantasy" }, { id: 12, name: "Adventure" }],
        pitch: "Escape to another world."
    },
    neutral: {
        label: "calm",
        genres: [{ id: 18, name: "Drama" }, { id: 878, name: "Science Fiction" }],
        pitch: "A good time for a story that pulls you in."
    }
};

export function getMood(emotion) {
    return MOODS[emotion] || null;
}

export function genreNames(mood) {
    return mood.genres.map(g => g.name).join(" & ");
}

export function genreQuery(mood) {
    return mood.genres.map(g => g.id).join("|");
}
