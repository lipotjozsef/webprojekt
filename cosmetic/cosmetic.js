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

      document.querySelector('label[for="gomb"]').innerText = "világosmód";
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

      document.querySelector('label[for="gomb"]').innerText = "sötétmód";
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

function vissza(){
  document.querySelector(".overlay-window").style.zIndex = -1;
  document.getElementById("cosmeticBase").style.visibility = "hidden";
}

