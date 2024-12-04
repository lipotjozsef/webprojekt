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


  if (div.style.marginRight == "75px"){
      div.style.marginLeft = "75px";
      div.style.marginRight = "0";

      document.querySelector('label[for="gomb"]').innerText = "világosmód";
      document.querySelector('label[for="gomb"]').style.marginLeft = "-30px";

      document.querySelector("hr").style.border = "1px solid gray";

      GameCont.style.border = "4px solid gray";
      keret.style.backgroundColor ="white";
      keret.style.borderBottom= "4px solid gray";
      document.getElementById("hs").style.color = "black";

      keret2.style.borderBottom = "4px solid gray";
      keret2.style.backgroundColor = "white";
      CosmOpt.style.border = "4px solid gray";

      GombHatter.style.backgroundColor = "white";
      div.style.backgroundColor = "gray";
      Tema.style.backgroundColor= "white";

      Header.style.border = "2px solid white";
      balance.style.color = "gray";
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
      balance.style.color = "white";
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

