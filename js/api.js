'use strict';

const imageBaseURL = "https://image.tmdb.org/t/p/";

// Builds a URL for our own /api/tmdb proxy (see api/tmdb.js).
// The TMDB API key stays on the server and is never sent to the browser.
const tmdbUrl = function (path, params = {}) {
    const query = new URLSearchParams({ path, ...params });
    return `/api/tmdb?${query}`;
};

// Fetches JSON from `url` and passes it to `callback`,
// along with an optional extra parameter.
const fetchDataFromServer = function (url, callback, optionalParam) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Request failed: ${response.status}`);
            return response.json();
        })
        .then(data => callback(data, optionalParam))
        .catch(error => console.error("UniFlix data error:", error));
};

export {
    imageBaseURL,
    tmdbUrl,
    fetchDataFromServer
};
