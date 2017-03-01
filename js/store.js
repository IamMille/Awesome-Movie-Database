

let $ = function(str) {
  var els = document.querySelectorAll(str);
  if (els.length === 1 && str.indexOf("#") > -1) return els[0];
  else if (els.length > 0) return Array.from(els);
  else return [ document.createElement('xyz'),
                document.createElement('xyz'),
                document.createElement('xyz') ]; // dummy elements for forEach
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
    //console.log("MovieStorage Store: ", this.myMovies);
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
    //console.log("MovieStorage Add: ", movie);
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
                <span class="star"></span>
                <span class="star"></span>
                <span class="star"></span>
                <span class="star"></span>
                <span class="star"></span>
              </span>
          </div>
        </div>
      `;

      let ratingInverted = (6 - movie.userRating);
      div.querySelector(`.stars-container-view span:nth-child(${ratingInverted})`)
         .classList.add('selected');

      if (!$("#myMoviesRated").querySelector(`div[data-id="${id}"]`))
        $("#myMoviesRated").appendChild(div);
    }

    // add eventListener to above
    div.querySelector('.movie').addEventListener('click', getMovieData);

  }

  delete(id) {

    //console.log("Delete: ", id);

    let myMovies = $("#myMovies")
                  .querySelector(`div[data-id="${id}"]`);
    if (myMovies) myMovies
                  .parentElement   // .flex-container
                  .parentElement   // .savedMovies
                  .outerHTML = ''; // MSIE emove element

    let myMoviesRated = $("#myMoviesRated")
                  .querySelector(`div[data-id="${id}"]`);
    if (myMoviesRated) myMoviesRated
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
    //console.log("MovieStorage setRating(): ", movieId, el.id.substring(4,5));

    let rating = el.id.substring(4,5);
    if (isNaN(rating)) {
      console.error("setRate(): rating isNaN; " + rating); return; }

    this.delete(movieId);
    this.add(movieId, movie, Number(rating) ); // won't be overwritten if already exists
    this.store();
  }

  getRating(id) {
    if (!this.myMovies[id]) {
        console.trace("MovieStorage getRating(): not such movie; " + id); return; }
    //if (!this.myMovies[id].userRating) {
    //    console.trace("MovieStorage getRating(): no rating for; " + myMovies[id].Title ); return; }
    if (isNaN(this.myMovies[id].userRating)) {
        console.trace("MovieStorage getRating(): rating is isNaN"); return; }

    //console.log("getRating(): ", id, this.myMovies[id] );
    return this.myMovies[id].userRating;
  }

  clearRating(el) {
    //console.log("clearRating()");
    this.clearRatingDisplay();
    let movieId = $("#saveButton").getAttribute("data-id");
    delete this.myMovies[movieId].userRating;
    this.delete(movieId);
    this.add(movieId, this.myMovies[movieId]);
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
    //console.log("Rating cleared from DOM");
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
    //console.log("click titta senare", movieId);
    movieStorage.add(movieId, movie);
  });

  // addEventListener on click Rating star
  $(".rate").forEach(el => el.addEventListener("click", function(event)
  {
    //console.log(".rate click", event.target.id);
    if (!this.classList.contains("selected")) // remove rating
      movieStorage.setRating(this);
    else
      movieStorage.clearRating(this); //this runs on re-rate
  }));

  // addEventListener on click Remove movie
  $("div[class='flex-item movie'] button").forEach(
    el => el.addEventListener("click", onClickCloseButton)
  );

}); // LOAD end
function onClickCloseButton(event) {
  let el = event.target.parentElement;
  let movieId = el.parentElement.getAttribute("data-id"); // where the data-id is

  //console.log("Movie close button: ", movieId);

  //$("#myMovies").querySelector(`div[data-id="tt0137523"]`)
  movieStorage.delete(movieId);
  event.stopPropagation(); // prevent trigger of parent click event
}
