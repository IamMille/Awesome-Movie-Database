
window.addEventListener("load", function()
{
  let $ = function(str) { // local func to not polute global namespace
    var els = document.querySelectorAll(str);
    if (els.length === 1) return els[0];
    else return Array.from(els);
  };

  $("#viewTrailer").addEventListener("click", function()
  {
	  $("#trailerPopup").style.display = "block";
	  
    console.log("viewTrailer");
    var query = "titanic 1994"; // HARDCODED
    var url  = "https://www.googleapis.com/youtube/v3/search?part=snippet";
        url += "&key=AIzaSyCII7TDbu0ckrYSPzmu0USdAFlLwJ4IJSc";
        url += "&q=trailer+" + encodeURIComponent(query);

    fetch( url )
      .then( resp => resp.json() )
      .then( data => {

      let firstMatch = data.items[0];
      let trailer = {
        query: query,
        id: firstMatch.id.videoId,
        urlbasic: "https://www.youtube.com/watch?v=" + firstMatch.id.videoId || "",
        url: "https://www.youtube.com/embed/" + firstMatch.id.videoId + "?autoplay=1",
        kind: firstMatch.id.kind,
        title: firstMatch.snippet.title,
        thumb_low: firstMatch.snippet.thumbnails.default.url, // 120x90§
        thumb_med: firstMatch.snippet.thumbnails.medium.url,  // 320x180
        thumb_hig: firstMatch.snippet.thumbnails.high.url     // 480x360
      };
      console.log(trailer);

     var html = `
       <iframe width="80%" height="80%" class="play" src="${trailer.url}" frameborder="0"></iframe>
      `;

      $("#trailerPopup").innerHTML = html;
   
   
   
    })
    .catch( err => {
      console.error("Fetch error ", err);
      $("#trailer").innerText = "Fetch " + err.statusText;
    }); // end of fetch

  }); // end onClick

  
  // Hide trailerpopup on click 
  
  $("#trailerPopup").addEventListener("click", function(){
	   
	   $("#trailerPopup").style.display = "none";
	   
   });
  
}); // en onLoad
