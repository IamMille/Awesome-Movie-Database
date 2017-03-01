window.onload=function(){
  var tit=document.getElementById("searchBar");
  var ent=document.getElementById("myButt");
  var httpRequest;
  
  
 document.getElementById("myButt").onclick=function minRequest() {
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
      alert('NOW you broke the Internet. Do NOT do that again you twat');
      return false;
    }
try{
    httpRequest.onreadystatechange = mSvar;
	//console.log('https://www.omdbapi.com/?s='+tit.value+'&r=json')
    httpRequest.open('GET', 'https://www.omdbapi.com/?s='+tit.value+'&type=movie&r=json');
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send();
}catch(e){ console.log('Något gick fel..')
			httpRequest.abort();
		}
  }
  tit.addEventListener("keypress", function(event){
	  if (event.keyCode==13)
		  ent.click();
  });
  tit.onkeyup=function(){
	  if (tit.value===""){
		let hide=document.getElementById('searchResult');
		hide.style.display='none';
		}else{
		ent.click();}
	  }

  function mSvar() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
try{
    if (httpRequest.status === 200) {		
	  let show=document.getElementById('searchResult');
	  show.style.display='block';
	  jObj = JSON.parse(this.responseText);

	  
	if (jObj.Search===undefined){
		console.log('the property is not available...');
		
	}else{
		
	  document.getElementById('sug1').innerHTML=JSON.stringify(jObj.Search[0].Title)+" - "+(jObj.Search[0].Year);
	  if (jObj.Search[1]!==undefined){
	  document.getElementById('sug2').innerHTML=JSON.stringify(jObj.Search[1].Title)+" - "+(jObj.Search[1].Year);
	  }
	  if (jObj.Search[2]!==undefined){
	  document.getElementById('sug3').innerHTML=JSON.stringify(jObj.Search[2].Title)+" - "+(jObj.Search[2].Year);
	  }
	  if (jObj.Search[0]!==undefined){
	  let id1=(jObj.Search[0].imdbID);
	  let attID=document.getElementById('sug1');
	  attID.setAttribute('data-id', id1);
	  }
	  if (jObj.Search[1]!==undefined){
	  let id2=(jObj.Search[1].imdbID);
	  let attID1=document.getElementById('sug2');
	  attID1.setAttribute('data-id', id2);
	  }
	  if (jObj.Search[2]!==undefined){
	  let id3=(jObj.Search[2].imdbID);
	  let attID2=document.getElementById('sug3');
	  attID2.setAttribute('data-id', id3);
	 
	  }
	}
    }else if (httpRequest.status === 500) {
		httpRequest.abort();
	}else {
      alert('Now you broke the Internet. Do NOT do that again you twat');
    }
}catch(e){console.log('något gick fel');}
  }
}
}
