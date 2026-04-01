const container = document.getElementById("container");

container.innerHTML = "<h2>Loading...</h2>";

fetch("https://jsonfakery.com/movies/paginated")
  .then(res => res.json())
  .then(result => {
    container.innerHTML = "";

    const movies = result.data; // 🔥 IMPORTANT

    movies.forEach(movie => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${movie.original_title}</h3>
        <img src="${movie.poster_path}" width="150"/>
        <p>Rating: ${movie.vote_average}</p>
      `;

      container.appendChild(div);
    });
  })
  .catch(() => {
    container.innerHTML = "<h2>Failed to load data</h2>";
  });