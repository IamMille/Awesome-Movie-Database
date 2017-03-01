var movie;

window.addEventListener("load", function()
{
  var movies = Array.from(document.getElementsByClassName("movie"));
  movies.forEach(function(movie2) {
      console.log("eventListener:", movie2);
      movie2.addEventListener("click", getMovieData); // end of addEventListener
  }); // end of forEach movie
});

function getMovieData() {

  //console.log("eventListener movie run:", this);
  var movieId = this.getAttribute("data-id");
  // DOM-element som vi kommer att behöva
  let rubrik = document.getElementById("rubrik");
  let plot = document.getElementById("plot");
  let year = document.getElementById("year");
  let genre = document.getElementById("genre");
  let actors = document.getElementById("actors");
  let poster = document.getElementById("poster");

  //göm sökresultat
  let hide=document.getElementById('searchResult');
  hide.style.display='none';

  let searchB=document.getElementById("searchBar");
  searchB.value="";

  // Skapa URL med querystring
  let url = 'https://www.omdbapi.com/?i=';
  url += movieId;  // ändra denna
  url += '&plot=short&r=json';

  let ajax = new XMLHttpRequest();
  ajax.open('get', url);
  ajax.onreadystatechange = function(){
    if (ajax.status == 200 && ajax.readyState == 4) {
      //console.log(ajax.responseText);
      movie = JSON.parse(ajax.responseText);
      let posterUrl = movie.Poster;

  		rubrik.innerHTML = `${movie.Title}`;
  		year.innerHTML = `${movie.Year} `;
  		plot.innerHTML = `${movie.Plot}`;
  		actors.innerHTML = `${movie.Actors}`;
  		genre.innerHTML = `${movie.Genre}`;
			poster.innerHTML = `<img src="${movie.Poster}" width="150" />`;

			if (movie.Poster == "N/A")
				{
					poster.innerHTML = `<img src="noPoster.jpg" width="150" />`;
				}
			else
				{
					poster.innerHTML = `<img src="${movie.Poster}" width="150" />`;
				}

      // uppdaterar movieId i HTML-elementen
      $("#saveButton").setAttribute("data-id", movie.imdbID);
      $("#viewTrailer").setAttribute("data-id", movie.imdbID);
      //<button id="saveButton" data-id="">TITTA SENARE</button>

      movieStorage.clearRatingDisplay();

      if (movieStorage.exists(movieId) &&
          movieStorage.getRating(movieId) > 0)
            $("#movie #star" + movieStorage.getRating(movieId)).click();

      setTimeout(function() {
         scrollTo( document.getElementById("header") , 0, 485);
      }, 200);
    }
  };
  ajax.send();
  let show=document.getElementById("movie");
  show.style.display='block';
}

function scrollTo(element, to, duration) {
      //if (true) return;
      if (duration <= 0) return;
      var difference = to - element.scrollTop;
      var perTick = difference / duration * 10;

      setTimeout(function() {
          element.scrollTop = element.scrollTop + perTick;
          if (element.scrollTop === to) return;
          scrollTo(element, to, duration - 10);
      }, 10);
}
