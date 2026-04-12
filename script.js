const container = document.getElementById("container");
const favContainer = document.getElementById("favContainer");
const favCountEl = document.getElementById("favCount");

let allMovies = [];
let favMovies = [];

// Dark mode toggle
const btn = document.getElementById("themeToggle");

btn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Fetch Top Movies
fetch("https://jsonfakery.com/movies/paginated")
  .then(res => res.json())
  .then(data => {
    allMovies = data.data;
    display(allMovies);
  })
  .catch(err => {
    container.innerHTML = `<div class="empty-state"><p>Oops! Failed to load movies.</p></div>`;
  });

// Display movies
function display(movies) {
  if (movies.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>No movies found matching your criteria.</p></div>`;
    return;
  }

  container.innerHTML = "";

  movies.forEach(movie => {
    const div = document.createElement("div");
    div.className = "card";

    // Format rating cleanly
    const rating = parseFloat(movie.vote_average).toFixed(1);

    div.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${movie.poster_path}" alt="${movie.original_title}" loading="lazy" />
        <div class="card-overlay"></div>
      </div>
      <button class="favBtn ${favMovies.some(fm => fm.id === movie.id) ? 'added' : ''}" title="Save to Favorites">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      </button>
      <div class="card-content">
        <h3>${movie.original_title}</h3>
        <div class="card-meta">
          <span class="rating">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            ${rating}
          </span>
        </div>
      </div>
    `;

    const favBtn = div.querySelector(".favBtn");

    favBtn.addEventListener("click", () => {
      // Functional approach without mutable loops
      const isAlreadyFav = favMovies.some(fm => fm.id === movie.id);
      
      if (!isAlreadyFav) {
        favMovies = [...favMovies, movie];
        favBtn.classList.add("added");
      } else {
        favMovies = favMovies.filter(fm => fm.id !== movie.id);
        favBtn.classList.remove("added");
      }
      displayFav();
    });

    container.appendChild(div);
  });
}

// Display favorites
function displayFav() {
  favCountEl.innerText = favMovies.length;

  if (favMovies.length === 0) {
    favContainer.innerHTML = `
      <div class="empty-state">
        <p>No favorites yet. Start exploring and save some!</p>
      </div>`;
    return;
  }

  favContainer.innerHTML = "";

  favMovies.forEach((movie) => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${movie.poster_path}" alt="${movie.original_title}" loading="lazy" />
        <div class="card-overlay"></div>
      </div>
      <button class="removeBtn" title="Remove">
         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div class="card-content">
        <h3>${movie.original_title}</h3>
      </div>
    `;

    div.querySelector(".removeBtn").addEventListener("click", () => {
      favMovies = favMovies.filter(fm => fm.id !== movie.id);
      
      // Selectively update main grid to revert the heart icon state
      const mainGridCards = Array.from(container.querySelectorAll('.card'));
      const cardToUpdate = mainGridCards.find(card => card.querySelector('h3').innerText === movie.original_title);
      
      if(cardToUpdate) {
          cardToUpdate.querySelector('.favBtn').classList.remove('added');
      }

      displayFav();
    });

    favContainer.appendChild(div);
  });
}

// Search feature using filter
document.getElementById("search").addEventListener("input", e => {
  const val = e.target.value.toLowerCase().trim();

  const filtered = allMovies.filter(movie =>
    movie.original_title.toLowerCase().includes(val)
  );

  display(filtered);
});

// Sort feature using a shallow copy spread operator and sort
document.getElementById("sort").addEventListener("change", e => {
  const val = document.getElementById("search").value.toLowerCase().trim();
  const currentList = val ? allMovies.filter(movie => movie.original_title.toLowerCase().includes(val)) : [...allMovies];

  if (e.target.value === "low") {
    currentList.sort((a, b) => parseFloat(a.vote_average) - parseFloat(b.vote_average));
  } else if (e.target.value === "high") {
    currentList.sort((a, b) => parseFloat(b.vote_average) - parseFloat(a.vote_average));
  }

  display(currentList);
});