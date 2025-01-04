function setCookie(cname, cvalue, exdays = 1000) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + "SameSite=None; Secure" + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}


function animacio()
{
// if (document.getElementById("cosmeticBase").style.visibility != "hidden"){
  const GameCont = document.getElementById('gameContainer');
  const keret = document.querySelector(".keret");
  const keret2 = document.querySelector(".keret2");
  const CosmOpt = document.getElementById("CosmeticMenu");
  const GombHatter = document.getElementById("gombAlap");
  const Header = document.querySelector(".titleDiv");
  const Tema = document.querySelector('select[name="temajeloles"]')
  const div = document.getElementById("gomb");
  const balance = document.getElementById("balance");
  const visszagomb = document.querySelector(".visszagomb");


  if (div.style.marginRight == "75px"){
      div.style.marginLeft = "75px";
      div.style.marginRight = "0";

      document.querySelector('label[for="gomb"]').innerText = "világos mód";
      document.querySelector('label[for="gomb"]').style.marginLeft = "-30px";

      document.querySelector("hr").style.border = "1px solid gray";

      GameCont.style.border = "4px solid black";
      keret.style.backgroundColor ="white";
      keret.style.borderBottom= "4px solid gray";
      document.getElementById("hs").style.color = "black";

      keret2.style.borderBottom = "4px solid gray";
      keret2.style.backgroundColor = "white";
      CosmOpt.style.border = "4px solid black";
      
      GombHatter.style.backgroundColor = "white";
      div.style.backgroundColor = "gray";
      Tema.style.backgroundColor= "white";
      
      Header.style.backgroundColor = "lightgreen";
      Header.style.border = "2px solid white";
      balance.style.color = "gray";

      visszagomb.style.border = "2px solid gray";
      visszagomb.style.color = "white";
      visszagomb.style.backgroundColor = "lightgreen";

  }
  else {
      div.style.marginLeft = "0";
      div.style.marginRight = "75px";

      document.querySelector('label[for="gomb"]').innerText = "sötét mód";
      document.querySelector('label[for="gomb"]').style.marginLeft = "0";

      document.querySelector("hr").style.border = "1px solid black";
      GameCont.style.border = "5px solid black";
      keret.style.backgroundColor ="gray";
      keret.style.borderBottom= "4px solid black";
      document.getElementById("hs").style.color = "orange";

      keret2.style.borderBottom = "4px solid black";
      keret2.style.backgroundColor = "gray";
      CosmOpt.style.border = "4px solid black";

      GombHatter.style.backgroundColor = "gray";
      div.style.backgroundColor = "rgb(54,52,52)";
      Tema.style.backgroundColor= "gray";

      Header.style.border = "2px solid black";
      Header.style.backgroundColor = "green";
      balance.style.color = "white";

      visszagomb.style.border = "2px solid black";
      visszagomb.style.color = "white";
      visszagomb.style.backgroundColor = "green";
    }

}

function borderRadiusChange(){
  let div = document.querySelector("select");
  
  if (div.style.borderBottomLeftRadius == "0vh"){
    div.style.borderRadius = "2vh";
  }
  
  else{
    div.style.borderBottomLeftRadius = "0vh";
    div.style.borderBottomRightRadius = "0vh";
    
  }
}


function backgroundChange(){

  const MegnyitottFelulet = document.querySelector(".overlay-window");
  let fileName = document.querySelector('select').value;
  
    MegnyitottFelulet.style.backgroundImage = `url(/kepek/${fileName})`;
    document.getElementById("PlayArea").style.backgroundImage = `url(/kepek/${fileName})`;  

}

function megnyitas(){
  document.querySelector(".overlay-window").style.zIndex= 2;
  document.getElementById("cosmeticBase").style.visibility = "visible";



}



function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev, id) {
  ev.dataTransfer.setData("text", ev.target.id);

}


function drop(ev, id) {
  let elementCount = document.getElementById(id).childNodes.length;
  var data = ev.dataTransfer.getData("text");

  if ((elementCount == 0 && (id == "div1" || id == "div2")))
    {
      
      if (id == "div1" && data.includes("hat")){
        ev.preventDefault();
        ev.target.appendChild(document.getElementById(data));
        
      }
      else if (id == "div2" && data.includes("wing")){
        ev.preventDefault();
        ev.target.appendChild(document.getElementById(data));
        
      }
    }
    /// ha az id utolsó karaktere benne van a datában 
    let index = id.length - 1;
    let lastChar = id.charAt(index);
    
    let index2 = data.length - 1;
    let lastChar2 = data.charAt(index2);
    if (id != "div1" && (id != "div2") && (lastChar == lastChar2)){
      ev.preventDefault();
      ev.target.appendChild(document.getElementById(data));
      
    }
    console.log(ev.target.childNodes.length);
    
  }
  function kinezet(){
    const div1 = document.getElementById("div1");
    const div2 = document.getElementById("div2");
    const div1Nodes = div1.childNodes.length;
    const div2Nodes = div2.childNodes.length;

    console.log(div1Nodes);
    let bird = document.getElementById("bird-skin");
    if (div1Nodes == 0 && div2Nodes == 0){
      bird.src = "kepek/flappybird.png";
      setCookie("flappybird","kepek/flappybird.png");
    }
    if(div1Nodes == 0 && div2Nodes != 0){
      let id1 = "_";
      let id2 = div2.getElementsByTagName("img")[0].id;
      
      let kepSrc = "kepek/" + id1 + id2 + ".png" ;
      bird.src = kepSrc;
      setCookie("flappybird",kepSrc);
    }
    if (div1Nodes != 0 && div2Nodes == 0){
      let id2 = "_";
      let id1 = div1.getElementsByTagName("img")[0].id;
      
      let kepSrc = "kepek/" + id1 + id2 + ".png" ;
      bird.src = kepSrc;
      setCookie("flappybird",kepSrc);
    }
    if (div1Nodes != 0 && div2Nodes != 0){
      let id1 = div1.getElementsByTagName("img")[0].id;
      let id2 = div2.getElementsByTagName("img")[0].id;

      let kepSrc = "kepek/" + id1 + id2 + ".png" ;
      bird.src = kepSrc;
      setCookie("flappybird",kepSrc);
    }


  }