

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

    if (Object.keys(this.myMovies).length)
      Object.keys(this.myMovies).forEach( key => {
        let movie = this.myMovies[key];
        this.add(key, movie, movie.userRating, true);

      });
  }

  store() {
    var datastring = JSON.stringify(this.myMovies);
    console.log("MovieStorage Store: ", this.myMovies);
    //console.log("Save (str): ", datastring);
    localStorage.setItem("myMovies", datastring);
    //this.display(); // replaces all event listners???
  }

  exists(id) {
    //console.log("Exists? " + this.myMovies[id]);
    return Boolean(this.myMovies[id]);
  }

  add(id, movie, rating, force) {
    if (this.exists(id) && force !== true) return;

    // add to localStorage
    console.log("MovieStorage Add: ", movie);
    this.myMovies[id] = movie;
    this.myMovies[id].userRating = rating;
    this.store();

    // add to DOM
    let div = document.createElement('div');
    div.classList.add('savedMovies');

    if (!rating)
    {
      div.innerHTML = `
        <div class="flex-container">
          <div class="flex-item movie"
            data-id=${movie.imdbID}>
            ${movie.Title} (${movie.Year})
            <button type="button" class="close" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      `;

      div.querySelector('.movie button').addEventListener('click', onClickCloseButton);
      $("#myMovies").appendChild(div);
    }

    if (rating) {
      div.innerHTML = `
        <div class="flex-container">
        <div class="flex-item movie"
          data-id=${movie.imdbID}>
          ${movie.Title} (${movie.Year})
        </div>
        <div class="flex-item">
          <div class="rating">
              <span class="stars-container stars-container-view">
                <span class="star "></span>
                <span class="star"></span>
                <span class="star"></span>
                <span class="star"></span>
                <span class="star selected"></span>
              </span>
          </div>
        </div>
      `;

      if (!$("#myMoviesRated").querySelector(`div[data-id="${id}"]`))
        $("#myMoviesRated").appendChild(div);
    }

    // add eventListener to above
    div.querySelector('.movie').addEventListener('click', getMovieData);

  }

  delete(id) {

    let movieDiv = $("#myMovies").querySelector(`div[data-id="${id}"]`);
    if (movieDiv) movieDiv
                  .parentElement   // .flex-container
                  .parentElement   // .savedMovies
                  .outerHTML = ''; // MSIE emove element

    // delete from localStorage
    delete this.myMovies[id];
    this.store();
  }

  get(id) {
    return this.myMovies[id];
  }

  setRating(el) {

    if (!movie) {
      console.trace("MovieStorage setRating(): no movie?"); return; }

    if (el.id && el.id.substring(0,4) != "star") {
      console.trace("MovieStorage setRating(): rate without star?"); return; }

    // ##### handle HTML CSS #####
    this.clearRatingDisplay(); // remove old rating
    el.classList.add("selected"); // add class to display rating
    el.setAttribute("data-toggle", "tooltip");
    el.setAttribute("title", "Click to remove rating");

    // save to localstorage
    let movieId = $("#saveButton").getAttribute("data-id"); // get id from button
    console.log("MovieStorage setRating(): ", movieId, el.id.substring(4,5));

    let rating = el.id.substring(4,5);
    if (isNaN(rating)) {
      console.error("setRate(): rating isNaN; " + rating); return; }

    console.log("setRate(): ", movieId, rating);
    this.delete(movieId);
    this.add(movieId, movie, Number(rating), true ); // won't be overwritten if already exists
    this.store();
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

  clearRating() {
    this.clearRatingDisplay();
    delete this.myMovies[id].userRating;
    this.store();
  }
  clearRatingDisplay() {
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
      movieStorage.clearRating(this);
  }));

  // addEventListener on click Remove movie
  $("div[class='flex-item movie'] button").forEach(
    el => el.addEventListener("click", onClickCloseButton)
  );

}); // LOAD end
function onClickCloseButton(event) {
  let el = event.target.parentElement;
  let movieId = el.parentElement.getAttribute("data-id"); // where the data-id is

  console.log("Movie close button: ", movieId);

  //$("#myMovies").querySelector(`div[data-id="tt0137523"]`)
  movieStorage.delete(movieId);
  event.stopPropagation(); // prevent trigger of parent click event

  setTimeout(function() {
     scrollTo(document.body, 0, 485);
  }, 200);
}

function scrollTo(element, to, duration) {
      if (true) return;
      if (duration <= 0) return;
      var difference = to - element.scrollTop;
      var perTick = difference / duration * 10;

      setTimeout(function() {
          element.scrollTop = element.scrollTop + perTick;
          if (element.scrollTop === to) return;
          scrollTo(element, to, duration - 10);
      }, 10);
}
