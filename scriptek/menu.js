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

    volumeValue.textContent = Math.floor(volumeControl.value * 100);
});




const textElement = document.getElementById('text');
        

const values = ['Space', 'Left Click'];


let currentIndex = 0;


function updateText() {
    textElement.textContent = values[currentIndex];
}


document.getElementById('leftArrow').addEventListener('click', function() {
    
    currentIndex = (currentIndex - 1 + values.length) % values.length;
    updateText();
});


document.getElementById('rightArrow').addEventListener('click', function() {
    
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

document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('input', () => {
        document.getElementById('saveButton').style.display = 'block';
    });
});

function saveSettings() {
    const settings = {
        name: document.getElementById('textInput').value,
        fps: document.getElementById('fps').textContent,
        quality: document.getElementById('priority').value,
        volume: document.getElementById('volumeControl').value,
    };

    localStorage.setItem('settings', JSON.stringify(settings));
    document.getElementById('saveButton').style.display = 'none'; 
}

window.onload = function () {
    const savedSettings = JSON.parse(localStorage.getItem('settings'));
    if (savedSettings) {
        document.getElementById('textInput').value = savedSettings.name || '';
        document.getElementById('fps').textContent = savedSettings.fps || '30';
        document.getElementById('priority').value = savedSettings.quality || 'low';
        document.getElementById('volumeControl').value = savedSettings.volume || '50';
        document.getElementById('volumeValue').textContent = savedSettings.volume || '50';
    }
};