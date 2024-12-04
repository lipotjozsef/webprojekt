function removeBorder() {
    document.getElementById("textInput").style.border = "none";
}

let fpsValue = 30;


const fpsDisplay = document.getElementById("fps");


const decreaseButton = document.getElementById("decrease");
const increaseButton = document.getElementById("increase");

decreaseButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (fpsValue === 60) {
        fpsValue = 30;
    }
    updateDisplay();
});
increaseButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (fpsValue === 30) {
        fpsValue = 60;
    }
    updateDisplay();
});
function updateDisplay() {
    fpsDisplay.textContent = fpsValue;
}
const volumeControl = document.getElementById('volumeControl');
const volumeValue = document.getElementById('volumeValue');


volumeControl.addEventListener('input', function () {

    volumeValue.textContent = volumeControl.value;
});



// Kiválasztjuk az elemet, aminek a szövegét változtatjuk
const textElement = document.getElementById('text');
        
// Az összes lehetséges szöveg, amit megjeleníthetünk
const values = ['Space', 'Left Click'];

// Kezdeti érték: Space
let currentIndex = 0;

// Funkció, ami beállítja az új szöveget az aktuális index alapján
function updateText() {
    textElement.textContent = values[currentIndex];
}

// Bal nyíl kattintás eseménykezelője
document.getElementById('leftArrow').addEventListener('click', function() {
    // Csökkentjük az indexet és körbeérünk, ha túl megyünk
    currentIndex = (currentIndex - 1 + values.length) % values.length;
    updateText();
});

// Jobb nyíl kattintás eseménykezelője
document.getElementById('rightArrow').addEventListener('click', function() {
    // Növeljük az indexet és körbeérünk, ha túl megyünk
    currentIndex = (currentIndex + 1) % values.length;
    updateText();
});

function storeText() {
    var text = document.getElementById("textInput").value;
    localStorage.setItem("storedText", text);
}




// Másik oldalhoz: 
// window.onload = function() {
//     var storedText = localStorage.getItem("storedText");
//     if (storedText) {
//         document.getElementById("output").innerText = storedText;
//     } else {
//         document.getElementById("output").innerText = "Nincs mentett szöveg.";
//     }
// }

//id="output"