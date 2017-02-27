

let $ = function(str) {
  var els = document.querySelectorAll(str);
  if (els.length === 1 && str.indexOf("#") > -1) return els[0];
  else return Array.from(els);
};

class MovieStorage
{
  constructor() {
    var data = localStorage.getItem("myMovies");

    if (data && data.length > 0)
      this.myMovies = JSON.parse(data); //restore saved
    else
      this.myMovies = {};

    console.log("MovieStorage constructor(): ", this.myMovies);
    this.display();
  }

  add(id, movie) {
    if (this.exists(id)) return;
    this.myMovies[id] = movie;
    console.log("Add: ", this.myMovies);
    this.save();
  }

  remove(id) {
    delete this.myMovies[id];
    this.save();
  }

  get(id) {
    return this.myMovies[id];
  }

  exists(id) {
    //console.log("Exists? " + this.myMovies[id]);
    return Boolean(this.myMovies[id]);
  }

  setRating(el) {

    if (!movie) {
      console.trace("MovieStorage setRating(): no movie?"); return; }

    if (el.id && el.id.substring(0,4) != "star") {
      console.trace("MovieStorage setRating(): rate without star?"); return; }

    // ##### handle HTML CSS #####
    this.clearDisplayRating(); // remove old rating
    el.classList.add("selected"); // add class to display rating
    el.setAttribute("data-toggle", "tooltip");
    el.setAttribute("title", "Click to remove rating");

    // save to localstorage
    let movieId = $("#saveButton").getAttribute("data-id"); // get id from button

    this.add(movieId, movie); // won't be overwritten if already exists
    console.log("MovieStorage setRating(): ", movieId, el.id.substring(4,5));

    let rating = el.id.substring(4,5);
    if (isNaN(rating)) {
      console.error("setRate(): rating isNaN; " + rating); return; }

    console.log("setRate(): ", movieId, rating);
    this.myMovies[movieId].userRating = Number(rating);
    this.save();
  }

  getRating(id) {
    if (!this.myMovies[id]) {
        console.trace("MovieStorage getRating(): not such movie; " + id); return; }
    //if (!this.myMovies[id].userRating) {
    //    console.trace("MovieStorage getRating(): no rating for; " + myMovies[id].Title ); return; }
    if (isNaN(this.myMovies[id].userRating)) {
        console.trace("MovieStorage getRating(): rating is isNaN"); return; }

    console.log("getRating(): ", id, this.myMovies[id] );
    return this.myMovies[id].userRating;
  }

  clearDisplayRating() {
    let el = $("#movie .stars-container");
    let siblings = Array.from(el.querySelectorAll("*"));
    if (siblings && siblings.length > 0)
      siblings.forEach(sib => {
        sib.classList.remove("selected");
        sib.removeAttribute("data-toggle");
        sib.removeAttribute("title");
      });

    // save to localstorage
    console.log("Rating cleared from DOM");
  }

  save() {
    var datastring = JSON.stringify(this.myMovies);
    console.log("MovieStorage Save: ", this.myMovies);
    //console.log("Save (str): ", datastring);
    localStorage.setItem("myMovies", datastring);
    this.display(); // replaces all event listners???
  }

  display() {
    let html = "";

    if (Object.keys(this.myMovies).length !== 0)
      Object.keys(this.myMovies).forEach( key =>
      {
        let movie = this.myMovies[key];
        console.log("MovieStorage Display: ", movie);

        html += `
          <div class="savedMovies">
            <div class="flex-container">
              <div class="flex-item movie"
                data-id=${movie.imdbID}>
                ${movie.Title} (${movie.Year})
                <button type="button" class="close" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
          </div>
        `;
      });

    $("#myMovies").innerHTML = html;

    var movies = Array.from(document.getElementsByClassName("movie"));
    movies.forEach(function(movie2) {
        console.log("eventListener:", movie2);
        movie2.addEventListener("click", getMovieData); // end of addEventListener
    });

    console.log("MovieStorage Display finished: " + Object.keys(this.myMovies).length);
  }

} // end of class

/* Funktionalitet för knappen [Titta senare]
  - spara filmen till localstorage
  - lägg till property "userSaved" i objektet (ingen rating får finnas)

  Funktionalitet för Rating
  - spara filmen till localstorage
  - lägg till property "userRating" i objektet
*/

var movieStorage;

window.addEventListener("load", function()
{
  movieStorage = new MovieStorage();
  //movieRating = new MovieRating();

  // addEventListener on click saveButton
  $("#saveButton").addEventListener("click", function()
  {
    let movieId = this.getAttribute("data-id"); //get movieID from attribute
    console.log("click titta senare", movieId);
    movieStorage.add(movieId, movie);
  });

  // addEventListener on click Rating star
  $(".rate").forEach(el => el.addEventListener("click", function()
  {
    if (!this.classList.contains("selected")) // remove rating
      movieStorage.setRating(this);
    else
      movieStorage.clearDisplayRating(this);
  }));

  // addEventListener on click Remove movie
  $("div[class='flex-item movie'] button").forEach( el => el.addEventListener("click", function(event) {
      let movieId = el.parentElement.getAttribute("data-id"); // where the data-id is
      console.log("Remove movie: ", movieId);
      movieStorage.remove(movieId);
      event.stopPropagation(); // prevent trigger of parent click event

      setTimeout(function() {
         scrollTo(document.body, 0, 485);
      }, 200);
  }));

}); // LOAD end

function scrollTo(element, to, duration) {
      if (duration <= 0) return;
      var difference = to - element.scrollTop;
      var perTick = difference / duration * 10;

      setTimeout(function() {
          element.scrollTop = element.scrollTop + perTick;
          if (element.scrollTop === to) return;
          scrollTo(element, to, duration - 10);
      }, 10);
}
