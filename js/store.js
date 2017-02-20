
class MovieStorage
{
  constructor() {
    var data = sessionStorage.getItem("myMovies");

    if (data && data.length > 0)
      this.myMovies = JSON.parse(data); //restore saved
    else
      this.myMovies = {};

    console.log("MyMovies: ", this.myMovies);
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
    console.log("Save (obj): ", this.myMovies);
    //console.log("Save (str): ", datastring);
    $("pre").innerText = datastring;
    sessionStorage.setItem("myMovies", datastring);
    this.display();
  }

  display() {
    let html = "";

    if (Object.keys(this.myMovies).length !== 0)
      Object.keys(this.myMovies).forEach( key =>
      {
        let movie = this.myMovies[key];
        html += `
            <h2>${movie.Title} (${movie.Year})
              <a href="#" data-id=${movie.imdbID} onClick="rem(this)">Remove</a>
            </h2>
            <p>${movie.Actors}</p>
            <p><img src="${movie.Poster}" width="100px" alt="" /></p>
        `;
      });

    $("#myMovies").innerHTML = html;

  }

} // end of class
class MovieRating
{
  set(el) {
    this.rem(el);
    el.classList.add("selected");
    el.setAttribute("data-toggle", "tooltip");
    el.setAttribute("title", "Click to remove rating");

    // save to sessionStorage
    console.log("Rated: " + el.id);
  }

  rem(el) {
    let siblings = Array.from(el.parentElement.querySelectorAll("*"));
    siblings.forEach(sib => sib.classList.remove("selected"));
    el.removeAttribute("data-toggle");
    el.removeAttribute("title");

    // save to sessionStorage
    console.log("Rating removed: " + el.id);
  }
}

/* Funktionalitet för knappen [Titta senare]
  - spara filmen till localstorage
  - lägg till property "userSaved" i objektet (ingen rating får finnas)

  Funktionalitet för Rating
  - spara filmen till localstorage
  - lägg till property "userRating" i objektet
*/

var movieRating = new MovieRating();

window.addEventListener("load", function()
{

  let $ = function(str) { // local func to not polute global namespace
    var els = document.querySelectorAll(str);
    if (els.length === 1) return els[0];
    else return Array.from(els);
  };

  // addEventListener on click Rating star
  $(".star").forEach(el => el.addEventListener("click", function()
  {
    if (!this.classList.contains("selected")) // remove rating
      movieRating.set(this);
    else
      movieRating.rem(this);
  }));

  // addEventListener on click saveButton
  $("#saveButton").addEventListener("click", function()
  {
    let movieId = this.getAttribute('data-id'); //get movieID from attribute
    console.log("click titta senare", movieId);
    //marked as saved to global Object (saved by Janie)
  });

}); // LOAD end
