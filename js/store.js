
/* Funktionalitet för knappen [Titta senare]
  - spara filmen till localstorage
  - lägg till property "sparad" i objektet (ingen rating får finnas)

  Funktionalitet för Rating
  - spara filmen till localstorage
  - lägg till property "ownRating" i objektet
*/

window.addEventListener("load", function()
{

  let $ = function(str) { // local func to not polute global namespace
    var els = document.querySelectorAll(str);
    if (els.length === 1) return els[0];
    else return Array.from(els);
  };

  // addEventListener on click saveButton
  $("#saveButton").addEventListener("click", function(event)
  {
    let el = event.target;
    let movieId = el.getAttribute('data-id'); //get movieID from attribute
    console.log("click titta senare", movieId);
    //marked as saved to global Object (saved by Janie)
  });

  // addEventListener on click viewTrailer
  $("#viewTrailer").addEventListener("click", function(event)
  {
    let el = event.target;
    let movieId = el.getAttribute('data-id'); //get movieID from attribute
    console.log("click trailer", movieId);
  });

}); // LOAD end
