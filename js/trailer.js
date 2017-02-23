
window.addEventListener("load", function()
{
  let $ = function(str) { // local func to not polute global namespace
    var els = document.querySelectorAll(str);
    if (els.length === 1) return els[0];
    else return Array.from(els);
  };

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
        url: "https://www.youtube.com/watch?v=" + firstMatch.id.videoId || "",
        url2: "https://www.youtube.com/embed/" + firstMatch.id.videoId + "?autoplay=1",
        kind: firstMatch.id.kind,
        title: firstMatch.snippet.title,
        thumb_low: firstMatch.snippet.thumbnails.default.url, // 120x90§
        thumb_med: firstMatch.snippet.thumbnails.medium.url,  // 320x180
        thumb_hig: firstMatch.snippet.thumbnails.high.url     // 480x360
      };

      let html = `
        <p><a href="${trailer.url}" target="_blank" class="video">
          <img src="${trailer.thumb_med}" alt="${trailer.title}" />
        </a></p>
      `; //data-lity

      $("#trailer").innerHTML = html;
      //console.log( $(".video") );

      let $j = jQuery.noConflict();
      $j(".video").magnificPopup({
        type: 'iframe',
        iframe:{patterns:{youtube:{src:'https://www.youtube.com/embed/%id%?autoplay=1'}}}
      });

      //$("pre").text( JSON.stringify(data, null, 2) ); // print json

    } // end getMovieTrailer

  }); // end onClick

}); // en onLoad
