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
  if (div.style.marginRight == "75px"){
      div.style.marginLeft = "75px";
      div.style.marginRight = "0";

      document.querySelector('label[for="gomb"]').innerText = "világosmód";
      

      GameCont.style.border = "4px solid white";
      keret.style.backgroundColor ="#e5e5e5";
      keret.style.borderBottom= "4px solid white";
      document.getElementById("hs").style.color = "black";

      keret2.style.borderBottom = "4px solid white";
      keret2.style.backgroundColor = "#e5e5e5";
      CosmOpt.style.border = "4px solid white";

      GombHatter.style.backgroundColor = "white";
      div.style.backgroundColor = "gray";
      Tema.style.backgroundColor= "white";

      Header.style.border = "2px solid white";

  }
  else {
      div.style.marginLeft = "0";
      div.style.marginRight = "75px";

      document.querySelector('label[for="gomb"]').innerText = "sötétmód";
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
  let fileName = document.querySelector('select').value;

  document.getElementById("gameContainer").style.backgroundImage = `url(/kepek/${fileName})`;

  number = 1;

}
