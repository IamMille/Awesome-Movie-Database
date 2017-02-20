window.addEventListener("load", function(){
 
	var movie;
	
	let clicked = document.getElementById("tt0137523");
			clicked.addEventListener('click', function() {
				// DOM-element som vi kommer att behöva
				let rubrik = document.getElementById("rubrik");
				let plot = document.getElementById("handling");
				let year = document.getElementById("year");
				let genre = document.getElementById("genre");
				let actors = document.getElementById("actors");
				let poster = document.getElementById("poster");
			
				
				
				// Skapa URL med querystring
				let url = 'http://www.omdbapi.com/?i=';
				url += "tt0137523";  // ändra denna
				url += '&plot=short&r=json';
				
				console.log(url);
				
				let ajax = new XMLHttpRequest();
				ajax.open('get', url);
				ajax.onreadystatechange = function(){
					if (ajax.status == 200 && ajax.readyState == 4) {
					console.log(ajax.responseText);
						movie = JSON.parse(ajax.responseText);
						let posterUrl = movie.Poster; 
						console.log(posterUrl);
						
						console.log(movie);
						console.log(movie.Title);
						console.log(ajax.responseText);
						
						rubrik.innerHTML = `Titel: ${movie.Title}` ;
						year.innerHTML = `År: ${movie.Year} `;
						plot.innerHTML = `Handling: ${movie.Plot}`;
						actors.innerHTML = `Skådespelare: ${movie.Actors}`;
						genre.innerHTML = `Genre: ${movie.Genre}` ;
						poster.innerHTML = `<img src='${movie.Poster}'>`; 
					}
				}
				ajax.send();
			});
});
	
	