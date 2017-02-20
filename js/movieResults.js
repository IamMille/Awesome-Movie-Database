var movie;

window.addEventListener("load", function(){

  var movies = Array.from(document.getElementsByClassName("movie"));

  movies.forEach(function(movie) {
      var movieId = movie.getAttribute("data-id");

      movie.addEventListener("click", function() {

          // DOM-element som vi kommer att behöva
          let rubrik = document.getElementById("rubrik");
          let plot = document.getElementById("plot");
          let year = document.getElementById("year");
          let genre = document.getElementById("genre");
          let actors = document.getElementById("actors");
          let poster = document.getElementById("poster");

          // Skapa URL med querystring
          let url = 'http://www.omdbapi.com/?i=';
          url += movieId;  // ändra denna
          url += '&plot=short&r=json';

          console.log(url);

          let ajax = new XMLHttpRequest();
          ajax.open('get', url);
          ajax.onreadystatechange = function(){
          	if (ajax.status == 200 && ajax.readyState == 4) {
          	  //console.log(ajax.responseText);
          		movie = JSON.parse(ajax.responseText);
          		let posterUrl = movie.Poster;
          		/*console.log(posterUrl);

          		console.log(movie);
          		console.log(movie.Title);
          		console.log(ajax.responseText);*/

          		rubrik.innerHTML = `${movie.Title}` ;
          		year.innerHTML = `${movie.Year} `;
          		plot.innerHTML = `${movie.Plot}`;
          		actors.innerHTML = `${movie.Actors}`;
          		genre.innerHTML = `${movie.Genre}`;
          		poster.innerHTML = `<img src="${movie.Poster}" />`;

          	}
          };
          ajax.send();

      }); // end of addEventListener
  }); // end of forEach movie
});
