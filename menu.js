function removeBorder() {
    document.getElementById("myInput").style.border = "none";
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