
window.addEventListener("load", function()
{
  
  $("#viewTrailer").addEventListener("click", function()
  {
    var query = $("#rubrik").innerText + " " + $("#year").innerText;
    var url  = "https://www.googleapis.com/youtube/v3/search?part=snippet";
        url += "&key=AIzaSyCII7TDbu0ckrYSPzmu0USdAFlLwJ4IJSc";
        url += "&q=trailer+" + encodeURIComponent(query);

    var req = new XMLHttpRequest();
    req.open("get", url);
    req.onreadystatechange = getMovieTrailer; // onload + onerror
    req.send();

    function getMovieTrailer()
    {
      if (req.readyState != 4) return;
      if (req.status != 200) {
        if (!navigator.isOnline)
          console.error("Fetch error: no internet");
        else
          console.error("Fetch error: " + req.status, req);

        $("#trailer").innerText = "Fetch resp: " + req.statusText;
        return;
      }

      // 200 OK
      let data = JSON.parse(req.responseText);
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

      var html = `
        <iframe width="80%" height="80%" class="play" src="${trailer.url}" frameborder="0"></iframe>
      `;

      $("#trailerPopup").style.display = "block";
      $("#trailerPopup").innerHTML = html;

    } // END getMovieTrailer()

  }); // end onClick

  // Hide trailerpopup on click
  $("#trailerPopup").addEventListener("click", function(){
	   $("#trailerPopup").style.display = "none";
   });

}); // en onLoad
