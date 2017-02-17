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
