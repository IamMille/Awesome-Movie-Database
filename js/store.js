

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

  put(id, movie) {
    this.myMovies[id] = movie;
    console.log("Put: ", this.myMovies);
    this.save();
  }

  rem(id) {
    delete this.myMovies[id];
    this.save();
  }

  get(id) {
    return this.myMovies[id];
  }

  exists(id) {
    console.log("Exists? " + this.myMovies[id]);
    return Boolean(this.myMovies[id]);
  }

  save() {
    var datastring = JSON.stringify(this.myMovies);
    console.log("MovieStorage Save: ", this.myMovies);
    //console.log("Save (str): ", datastring);
    localStorage.setItem("myMovies", datastring);
    this.display();
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
    console.log("MovieStorage Display finished");
  }

} // end of class


/* Funktionalitet för knappen [Titta senare]
  - spara filmen till localstorage
  - lägg till property "userSaved" i objektet (ingen rating får finnas)

  Funktionalitet för Rating
  - spara filmen till localstorage
  - lägg till property "userRating" i objektet
*/

class MovieRating
{
  set(el) {
    this.rem(el);
    el.classList.add("selected");
    el.setAttribute("data-toggle", "tooltip");
    el.setAttribute("title", "Click to remove rating");

    // save to localstorage
    console.log("Rated: " + el.id);
  }

  rem(el) {
    let siblings = Array.from(el.parentElement.querySelectorAll("*"));
    siblings.forEach(sib => sib.classList.remove("selected"));
    el.removeAttribute("data-toggle");
    el.removeAttribute("title");

    // save to localstorage
    console.log("Rating removed: " + el.id);
  }
}

var movieStorage;
var movieRating;

window.addEventListener("load", function()
{
  movieStorage = new MovieStorage();
  movieRating = new MovieRating();

  // addEventListener on click saveButton
  $("#saveButton").addEventListener("click", function()
  {
    let movieId = this.getAttribute("data-id"); //get movieID from attribute
    console.log("click titta senare", movieId);
    movieStorage.put(movieId, movie);
    movieStorage.display();
  });

  // addEventListener on click Rating star
  $(".rate").forEach(el => el.addEventListener("click", function()
  {
    if (!this.classList.contains("selected")) // remove rating
      movieRating.set(this);
    else
      movieRating.rem(this);
  }));

  // addEventListener on click Remove movie
  $("div[class='flex-item movie'] button").forEach( el => el.addEventListener("click", function(event) {
      let movieId = el.parentElement.getAttribute("data-id"); // where the data-id is
      console.log("Remove movie: ", movieId);
      movieStorage.rem(movieId);
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
