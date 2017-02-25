var movie;

window.addEventListener("load", function(){

  var movies = Array.from(document.getElementsByClassName("movie"));

  movies.forEach(function(movie2) {

      movie2.addEventListener("click", function() {

        var movieId = movie2.getAttribute("data-id");
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
        		/*console.log(posterUrl);

        		console.log(movie);
        		console.log(movie.Title);
        		console.log(ajax.responseText);*/

        		rubrik.innerHTML = `${movie.Title}`;
        		year.innerHTML = `${movie.Year} `;
        		plot.innerHTML = `${movie.Plot}`;
        		actors.innerHTML = `${movie.Actors}`;
        		genre.innerHTML = `${movie.Genre}`;
        		poster.innerHTML = `<img src="${movie.Poster}" width="150" />`;

            // uppdaterar movieId i HTML-elementen
            $("#saveButton").setAttribute("data-id", movie.imdbID);
            $("#viewTrailer").setAttribute("data-id", movie.imdbID);
            //<button id="saveButton" data-id="">TITTA SENARE</button>
        	}
        };
        ajax.send();

      }); // end of addEventListener
  }); // end of forEach movie
});
