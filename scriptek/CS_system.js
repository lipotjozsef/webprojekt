var globalCoinCount = 0;
var globalHighscore = 0;

if(getCookie("coinCount") != "") {
    globalCoinCount = Number(getCookie("coinCount"));
    console.log("Remembered coin count! ", globalCoinCount)
} else setCookie("coinCount", 0);

if(getCookie("savedHighscore") != "") {
    globalHighscore = Number(getCookie("savedHighscore"));
    console.log("Remembered highscore! ", globalHighscore)
} else setCookie("savedHighscore", 0);

if(getCookie("flappybird") != "") {
    console.log("Init flappybird image.")
} else setCookie("flappybird", "../kepek/flappybird.png");

function saveCoins() {
    setCookie("coinCount", globalCoinCount);
}

function saveHighscore() {
    setCookie("savedHighscore", globalHighscore);
    console.log("Saved Highscore: ", globalHighscore);
}

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

function sethighScore(newHG) {
    if (globalHighscore < newHG) {
        globalHighscore = newHG;
        saveHighscore();
    }
}

function addCoins(amount) {
    globalCoinCount += amount;
    saveCoins();
}

function subCoins(amount) {
    if (globalCoinCount - amount < 0) return false;
    else { 
        globalCoinCount -= amount
        saveCoins();
        return true;
    }
}