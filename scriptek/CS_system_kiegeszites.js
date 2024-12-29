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
    
    /////
    const div = document.getElementById('balance');
    
    div.innerText = globalCoinCount; 
    ////
}

function subCoins(amount) {
    if (globalCoinCount - amount < 0) return false;
    else { 
        globalCoinCount -= amount
        saveCoins();
        
        ////
        const div = document.getElementById('balance');
        
        div.innerText = globalCoinCount; 
        ////
        
        return true;
    }
    
}


/////
addCoins(1);
function moneyAppear(){
    const div = document.getElementById('balance');
    globalCoinCount = getCookie("coinCount")
    div.innerText = globalCoinCount; 
    
}
let boughtlist = [];
let string_of_id = "0";

if(getCookie("BoughtItems") != "") {
    string_of_id = getCookie("BoughtItems");
} else {
    setCookie("BoughtItems", 0);
}


function buy(value){
    let globalCoin = getCookie("coinCount");
    if (globalCoin < Number(value)){
        alert("Nem elegendő pénzösszeg!");
    }
    if (globalCoin >= Number(value)){
        let azonositok =  document.querySelectorAll(`[id='${value}']`);
        for (let j = 0; j < azonositok.length; j++){
            azonositok[j].style.visibility = "hidden";
        }
        subCoins(Number(value));
        console.log("Money deducted!");

        boughtlist.push(value);
        saveBoughtItems(boughtlist);
        
    }
}

function saveBoughtItems(lista) {
    if (lista.length != 0){
        for(let i = 0; i < lista.length; i++){
            if (string_of_id.length == 1){
                string_of_id += "-";
            }
            string_of_id += (`${JSON.stringify(lista[i])}-`);
        }
    }
    setCookie("BoughtItems", string_of_id);
    console.log("Saved Bought Items: (by id)", string_of_id);
}


function alreadybought(){
    string_of_id = getCookie("BoughtItems");
    let data = string_of_id.split("-");
    for (let i = 0; i < data.length; i++){
        var azonositok = document.querySelectorAll(`[id='${data[i]}']`);
       for (let j = 0; j < azonositok.length;j++){
        azonositok[j].style.display='none';
       }
    }
    
}
