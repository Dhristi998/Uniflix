'use strict';

import { tmdbUrl, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./moviecard.js";
import { search } from "./search.js";
import { getMood, genreNames, genreQuery } from "./moods.js";

// Work out which movies to show.
// 1. movielist.html?mood=happy  -> genres picked by the mood detector
// 2. otherwise                  -> genre/language last clicked in the sidebar
const pageParams = new URLSearchParams(window.location.search);
const mood = getMood(pageParams.get("mood"));

let listName;
const discoverParams = {
    sort_by: "popularity.desc",
    include_adult: false
};

if (mood) {
    listName = genreNames(mood);
    discoverParams.with_genres = genreQuery(mood);
} else {
    listName = window.localStorage.getItem("genreName") || "Popular";
    const savedParam = window.localStorage.getItem("urlParam");
    if (savedParam) {
        for (const [key, value] of new URLSearchParams(savedParam)) {
            discoverParams[key] = value;
        }
    }
}

const pageContent = document.querySelector("[page-content]");

sidebar();

let currentPage = 1;
let totalPages = 0;
let movieListEle;

document.title = `${listName} Movies - UniFlix`;
fetchMovies(currentPage);

function fetchMovies(page) {
    fetchDataFromServer(tmdbUrl("/discover/movie", { ...discoverParams, page }), ({ results: movieList, total_pages }) => {
        totalPages = total_pages;

        if (!movieListEle) {
            movieListEle = createMovieListElement();
            pageContent.appendChild(movieListEle);
        }

        const grid = movieListEle.querySelector(".grid-list");
        movieList.forEach(movie => grid.appendChild(createMovieCard(movie)));

        const loadMoreButton = movieListEle.querySelector("[load-more]");
        loadMoreButton.classList.remove("loading");
        if (currentPage >= totalPages) loadMoreButton.style.display = "none";
    });
}

function createMovieListElement() {
    const section = document.createElement("section");
    section.classList.add("movie-list", "genre-list");
    section.setAttribute("aria-label", `${listName} Movies`);

    const heading = mood
        ? `Because you look ${mood.label}: ${listName}`
        : `All ${listName} Movies`;

    section.innerHTML = `
        <div class="title-wrapper">
            <h1 class="heading"></h1>
        </div>
        <div class="grid-list"></div>
        <button class="button load-more" load-more>Load More</button>
    `;
    section.querySelector(".heading").textContent = heading;

    section.querySelector("[load-more]").addEventListener("click", function () {
        if (currentPage >= totalPages) {
            this.style.display = "none";
            return;
        }
        currentPage++;
        this.classList.add("loading");
        fetchMovies(currentPage);
    });

    return section;
}

search();
