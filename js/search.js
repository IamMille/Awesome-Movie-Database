window.onload=function(){
  var tit=document.getElementById("searchBar");
  var ent=document.getElementById("myButt");
  var httpRequest;
  
 document.getElementById("myButt").onclick=function minRequest() {
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
      alert('Jag ger upp');
      return false;
    }
    httpRequest.onreadystatechange = mSvar;
	console.log('https://www.omdbapi.com/?s='+tit.value+'&r=json')
    httpRequest.open('GET', 'https://www.omdbapi.com/?s='+tit.value+'&r=json');
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send();

  }
  tit.addEventListener("keypress", function(event){
	  if (event.keyCode==13)
		  myButt.click();
  });
  tit.onkeyup=function(){
	  if (tit.value===""){
		let hide=document.getElementById('searchResult');
		hide.style.display='none';
		}else{
		myButt.click();}
	  }

  function mSvar() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {		
	  let show=document.getElementById('searchResult');
	  show.style.display='block';
	  jObj = JSON.parse(this.responseText);

	  //console.log('search är: ', jObj.Search);
	if (jObj.Search===undefined){
		console.log('the property is not available...');
	}else{
		
	  document.getElementById('sug1').innerHTML=JSON.stringify(jObj.Search[0].Title)+" - "+(jObj.Search[0].Year);
	  document.getElementById('sug2').innerHTML=JSON.stringify(jObj.Search[1].Title)+" - "+(jObj.Search[1].Year);
	  document.getElementById('sug3').innerHTML=JSON.stringify(jObj.Search[2].Title)+" - "+(jObj.Search[2].Year);
	  let id1=(jObj.Search[0].imdbID);
	  let attID=document.getElementById('sug1');
	  attID.setAttribute('data-id', id1);
	  
	  let id2=(jObj.Search[1].imdbID);
	  let attID1=document.getElementById('sug2');
	  attID1.setAttribute('data-id', id2);
	  
	  let id3=(jObj.Search[2].imdbID);
	  let attID2=document.getElementById('sug3');
	  attID2.setAttribute('data-id', id3);
	 //console.log(search);
	}
    } else {
      alert('Fel igen.');
    }
  }
}
}
