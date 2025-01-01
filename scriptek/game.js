let globalObjectList = [];
let globalAudioList = [];

let startTime;
let elapsedTime = 0;

const WINDOWS = document.getElementById("gameContainer").children;
const GAMECONTAINER = document.getElementById("PlayArea");
const gameRECT = GAMECONTAINER?.getBoundingClientRect();
const PLAYERTAG = document.getElementById("playerNameTag");
const SCORECOUNTER = document.getElementById("ScoreCounter");
const COUNTDOWN = document.getElementById("Countdown");
const GROUNDTILE = document.getElementById("ground");
const BACKGROUNDTREES = document.getElementById("backgroundTrees");
const BACKGROUNDBUILDINGS = document.getElementById("backgroundBuildings");
const BACKGROUNDCLOUDS = document.getElementById("backgroundClouds");
const LEVELUPGIF = document.getElementById("levelUpGIF");
const CONFETTI = document.getElementById("playerConfetti");
const FinalScoreSPAN = document.getElementById("FinalScore");
const COINSSPAN = document.getElementById("coins");
let gameStarted = false;
let gottenCoins = 0;
let multi = 1;
const savedSettings = JSON.parse(localStorage.getItem('settings'));
var MAINVOLUME = savedSettings.volume || 1;
let score = 0;
let tagOffSetX = 0;
let tagOffsetY = -30;
const DEBUGMODE = false;

// ---- _InitDefaultScene()-be állítjuk be őket ----

let PLAYER;
let scoreCounterColl;
let GROUNDCOLLIDER;
let ROOFCOLLIDER;
let PIPEMANAGER;

// -------------------------------------------------

class Vector2 {
    constructor(posX = 0, posY = 0) {
        this.x = posX;
        this.y = posY;
    }
    check(cVec2 = new Vector2()) {
        if (cVec2.x != this.x && cVec2.y != this.y) {
            return false
        }
        return true
    }

    getCurrentLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let currLenght = this.getCurrentLength();
        return new Vector2(this.x / currLenght, this.y / currLenght) 
    }
}

class BaseObject {
    constructor(elementName = "", classNameList = [""], size = new Vector2(), position = new Vector2(), rotation = 0.0) {
        this.root = document.createElement(elementName);
        
        if(classNameList[0] != "") this.root.classList.add(classNameList);

        this.setRotation(rotation)
        this.setSize(size);
        this.setPosition(position);
    }

    setPosition(newPos = new Vector2()) {
        //if (DEBUGMODE) console.info(`[.] (${newPos.x}, ${newPos.y}) new position has been set for ${this.root}`)
        this.position = newPos;
        if(isNaN(newPos.y)) {
            console.log(newPos)
        }
        this.root.style.left = this.position.x + "px";
        this.root.style.top = this.position.y + "px";
    }

    clamp(attribute = 0, min = 0, max = 0) {
        if (attribute > max) return max;
        else if(attribute < min) return min;
        else return attribute;
    }

    setSize(newSize = new Vector2()) {
        if (newSize.y == 0) return;
        if (DEBUGMODE) console.info(`[.] (${newSize.x}, ${newSize.y}) new size has been set for ${this.root}`)
        this.size = newSize;
        this.root.style.height = this.size.y + "px";
        this.root.style.width = this.size.x + "px";
    }

    setRotation(newRot = 0.0) {
        if (DEBUGMODE) console.info(`[.] (${newRot}) new rotation has been set for ${this.root}`)
        this.rotation = newRot;
        this.root.style.transform = "rotate(" + this.rotation + "deg)";
    }

    addChildToRoot(childObject) {
        if (!childObject)
        {
            console.assert("No child was given!");
            return;
        }
        childObject.position = this.position;
        childObject.setRotation(this.rotation);
        if (!childObject.size.check(this.size)) {
            childObject.root.style.left = "50%";
            childObject.root.style.top = "50%";
            childObject.root.style.transform = "translate(-50%, -50%)";
            if(DEBUGMODE) console.warn("A child object been centered.", childObject);
        }
        this.root.appendChild(childObject.root);
    }
    
}

class SpriteImage extends BaseObject{
    constructor(imagePath = "", size = new Vector2()) {
        super("img", ["objectSprite"], size, new Vector2(), 0.0)
        this.imgROOT = this.root;
        this.imagePath = imagePath;
        this.imgROOT.src = this.imagePath;
        if (size.check(new Vector2())) {
            if(DEBUGMODE) console.warn("[!] An Image size has not been set: " + this.imagePath + "\nSize set to inherit 100%");
            this.imgROOT.style.width = "100%";
            this.imgROOT.style.height = "100%";
        }
    }
}

class Object extends BaseObject {
    constructor(sprite_image = new SpriteImage(), size = new Vector2(), position = new Vector2(), rotationDeg = 0.0) {
        super("div", ["object"], size, position, rotationDeg)
        
        this.aduioPlayer;
        this.sprite_image = new SpriteImage(sprite_image.imagePath, sprite_image.size);
        this.rotation = rotationDeg;
        this.velocity = new Vector2();
        this.acceleration = new Vector2();

        this.divROOT = this.root;
        this.divROOT.appendChild(this.sprite_image.imgROOT)
    }

    move() {
        // balra fog elmozogni
    } 

}

class Collider extends BaseObject {
    constructor(size = new Vector2(), pos = new Vector2()) {
        super("div", ["collider"], size, pos);
        this.colliderROOT = this.root;
        this.colliding = false;

        this.setPosition(pos)
    }
    isColliding(withObject) {
        let r1xRight = withObject.position.x + (withObject.size.x / 2);
        let r1yRight = withObject.position.y + (withObject.size.y);

        let r2xRight = this.position.x + (this.size.x / 2);
        let r2yRight = this.position.y + (this.size.y);
        //console.log(withObject.position.y-1 <= r2yRight)
        if (r1xRight >= this.position.x &&
            withObject.position.x <= r2xRight &&
            r1yRight >= this.position.y && 
            withObject.position.y <= r2yRight
        ) {
                if(withObject instanceof Collider) withObject.colliding = true;
                this.colliding = true;
                return true;
        }
        this.colliding = false;
        return false;
    }
    debugDraw() {
        if (this.colliderROOT.classList.contains("debugCollider") && this.colliding) {
            this.colliderROOT.classList.add("debugColliderColliding");
        }
        else {
            if(this.colliderROOT.classList.contains("debugColliderColliding")) this.colliderROOT.classList.remove("debugColliderColliding");
            this.colliderROOT.classList.add("debugCollider");
        }
    }
}

class AudioPlayer {
    constructor(audioPath = "", volume = 1, loop = false) {
        if (audioPath == "") return;
        this.volume = volume ;
        this.settedVolume = volume;
        this.stream = new Audio(audioPath);
        this.stream.volume = volume * MAINVOLUME;
        this.loop = loop;
        this.muted = false;
        this.stream.load();
        globalAudioList.push(this);
    }

    play(delay = 0, canOverLap = false) {
        var self = this;
        if(this.stream.currentTime > 0.2 && canOverLap) this.stream.currentTime = 0;
        setTimeout(() => {
            this.stream.currentTime = 0;
            self.stream.play();
        }, delay);
        if(DEBUGMODE) console.log("Playing ", this.stream.currentSrc);
        if(this.loop) {
            setTimeout(() =>{
                self.play();
            }, this.getDuration()*1000)
        }
    }

    stop() {
        this.stream.pause();
    }

    getDuration() {
        return this.stream.duration;
    }

    setAudio (newPath = "") {
        if(newPath == "") return;
        this.stream.src = newPath;
    }

    setVolume(newVolume = 1) {
        this.volume = newVolume;
        this.settedVolume = newVolume;
        this.stream.volume = newVolume * MAINVOLUME;
        //console.log("New volume: ", this.stream.volume);
    }

    muteToggle() {
        this.muted = !this.muted;
        if (this.muted) this.volume = 0;
        else this.volume = this.setVolume;
    }
}

class Pipe extends Object {
    constructor(sprite_image = new SpriteImage(), size = new Vector2(), position = new Vector2(), rotationDeg = 0.0) {
        super(sprite_image, size, position, rotationDeg)
        this.pipeRoot = this.root;
        this.pipeCollider = new Collider(new Vector2(size.x, size.y-20));
        this.addChildToRoot(this.pipeCollider);
        this.acceleration = new Vector2(-5, 0);
        this.amplitude = 0;
    }
    move () {
        this.pipeCollider.position = this.position;

        if(this.acceleration) {
            this.velocity.x = this.acceleration.x;
        }
        this.position.x += this.velocity.x
        this.position.y += Math.sin(elapsedTime * 0.01) * this.amplitude;
        this.setPosition(this.position);

    }
}

class Player extends Object {
    constructor(sprite_image = new SpriteImage(), size = new Vector2(), position = new Vector2(), rotationDeg = 0.0, collider) {
        super(sprite_image, size, position, rotationDeg)
        this.playerRoot = this.root;
        this.playerCollider = collider;
        this.addChildToRoot(this.playerCollider);
        this.soundEffectsPaths = [
            "hangok/fall.mp3",
            "hangok/hit.mp3",
            "hangok/hop.mp3",
            "hangok/score.mp3"
        ]
        this.playerRoot.style.zIndex = "9";
        this.audioPlayer = new AudioPlayer(this.soundEffectsPaths[2], 1);

        this.gravity = 10;

        this.acceleration.y = this.gravity;
        this.jumpForce = -4.3;
        this.frozen = true;
        this.paused = false;
        this.isDead = false;
        this.isFalling = true;
        this.needToFall = false;
        this.isJumping = false;
        this.x = 0;
        this.fallAnim = 0;
        this.maxVel = new Vector2();

        onkeydown = (ev) => {this._input(ev)}
        onkeyup = (ev) => {this._input(ev)}
    }

    die () {
        if (this.isDead) return;
        this.isDead = true;
        this.audioPlayer.setAudio(this.soundEffectsPaths[1]);
        this.audioPlayer.play();
        setTimeout(() => {
            this.audioPlayer.setAudio(this.soundEffectsPaths[0]);
            this.audioPlayer.play();
            RESTARTMENUMUSIC.play();
            BACKGROUNDMUSIC.stop();
        }, 300);
        
        window.sethighScore(score);
        GAMECONTAINER.classList.add("shakeAnim");
        setTimeout(() => {
            GAMECONTAINER.className = "";
            GAMECONTAINER.classList.add("active");
            GAMECONTAINER.classList.add("gameTransitionOutAnim");
            FinalScoreSPAN.innerText = score;
            COINSSPAN.innerText = gottenCoins;
            SCORECOUNTER.style.visibility = "hidden";
        }, 610);
    }

    move() {
        if(this.frozen) return;
        if(this.acceleration && !this.isJumping) {
            if (!this.isFalling) {
                this.acceleration.y += 0.4;
                if(this.acceleration.y >= 1) {
                    this.isFalling = true;
                }
            }
        } else if(this.isJumping && !this.needToFal) {
            if(this.isFalling) this.acceleration.y = 0;
            if ((this.acceleration.y >= this.jumpForce)) this.acceleration.y -= Math.pow(3*this.x, 2);
            else {
                this.needToFall = true;
                this.isJumping = false;
                return;
            }
            //console.log(this.acceleration.y)
            this.isFalling = false
        }
        if(this.isFalling) {
            if(this.acceleration.y <= this.gravity) this.acceleration.y += 0.4;
        }
        this.velocity.y = this.acceleration.y;
        this.position.y += this.velocity.y;
        if(this.velocity.y > this.maxVel.y) this.maxVel.y = this.velocity.y;
        this.setRotation(this.clamp(35.0 * (this.velocity.y / this.maxVel.y), -35, 35));
        this.setPosition(this.position);
    }

    _input(keyboardEvent) {
        if(!gameStarted) return;
        if(keyboardEvent.type == "keydown") {
            switch(keyboardEvent.keyCode) {
                case 27:
                    this.frozen = !this.frozen;
                    if (this.frozen) {
                        SCORECOUNTER.style.visibility = "hidden";
                        this.paused = true;
                        changeActiveWindow("PauseMenu");
                    }
                    else _Resume();
                    break;
                case 32:
                    if(this.needToFall || this.isDead || this.paused) return;
                    if(this.frozen) this.frozen = false;
                    this.audioPlayer.play(0, true);
                    //console.log("Jumping");
                    this.x+=0.4;
                    this.isJumping = true;
                    break;
            }
        }
        else 
        {
            switch(keyboardEvent.keyCode) {
                case 32:
                    if(this.paused) return;
                    if(this.needToFall) this.needToFall = false;
                    //console.log("NotJumping");
                    this.x=0;
                    this.isJumping = false;
                    break;
            }
        }
        
    }
}

function AddToScene(object) {
    const ROOT = object.root;
    globalObjectList.push(object);
    
    GAMECONTAINER.appendChild(ROOT);
    if (DEBUGMODE) console.log("Added a new object: ", ROOT);
}

const birdIMAGE = new SpriteImage("kepek/game/bird.png");
const pipeIMAGE = new SpriteImage("kepek/game/pipe.png");

class PipeManager {
    constructor(startPos = 0, pipesCount = 0, scoreCounter = new Collider()) {
        this.difficulty = 7;
        this.distBetweenPipes = 500;
        this.audioPlayer = new AudioPlayer("hangok/score.mp3", 0.5);
        this.activePipeIndx = 0;
        this.gap = 200;
        this.newScore = 10;
        this.newY = 0;
        this.scoreCounterColl = scoreCounter;
        this.Pipes = new Array();
        for (var indx = 1; indx <= pipesCount; indx++) {
            let currentDist = startPos + this.distBetweenPipes*(indx-1); // indx - 1, hogy az első pontosan a startPos-on kezdjen
            this.newY = rand_int_range(-350, -450);
            const newUpPipe = new Pipe(pipeIMAGE, new Vector2(125, 500), new Vector2(currentDist, this.newY), 0.0);
            const newBotPipe = new Pipe(pipeIMAGE, new Vector2(125, 500), new Vector2(currentDist, 500+this.newY+this.gap), 180.0);
            this.Pipes.push(newUpPipe);
            this.Pipes.push(newBotPipe);
        }
        this.lastPipe = this.Pipes.slice(-1)[0];
    }

    _SpawnPipes() {
        this.Pipes.forEach((pipe) => {
            AddToScene(pipe);
        });
    }

    _checkOffPipes() {
        let changedCount = 1;
        let upper = true;
        this.Pipes.forEach((pipe) => {
            if(pipe.position.x+pipe.size.x < 0) { // ha képrenyőn kívül van
                if(upper) this.rePositionPipe("upper", pipe);
                else this.rePositionPipe("bottom", pipe);
                upper = !upper;
                if (changedCount == 2) {
                    this.lastPipe = pipe;
                    changedCount = 0;
                }
                changedCount++;
            }
            
            this._positionScoreCounter();
        });
    }

    _positionScoreCounter() {
        let activePipe = this.Pipes[this.activePipeIndx];
        if(activePipe != undefined) this.scoreCounterColl.setPosition(new Vector2(activePipe.position.x, this.scoreCounterColl.position.y));
        else {
            console.log("undefined active PIPE!")
        }
    }

    increaseDifficulty() {
        this.audioPlayer.setAudio("hangok/levelUp.wav");
        if (this.newScore != 100)
        {
            CONFETTI.style.visibility = "visible";
            LEVELUPGIF.style.visibility = "visible";
            CONFETTI.classList.add("confettiAnim");
            LEVELUPGIF.classList.add("levelUpAnim");
            setTimeout(() => { CONFETTI.classList.remove("confettiAnim"); CONFETTI.style.visibility = "hidden"; }, 2100);
            setTimeout(() => { LEVELUPGIF.classList.remove("levelUpAnim"); LEVELUPGIF.style.visibility = "hidden"; }, 3100);
            this.newScore += 10;
            this.difficulty++;
        }
    }

    scored() {
        this.audioPlayer.play();
        calcCoins();
        this.activePipeIndx += 2;
        if(this.activePipeIndx > this.Pipes.length-1) this.activePipeIndx = 0;
        if (score == this.newScore
        ) {
            this.increaseDifficulty();
        } else this.audioPlayer.setAudio("hangok/score.mp3");

    }

    rePositionPipe(checkString = "", pipe){
        let upper = new Array(2);
        let dist = new Array(2);
        let amp = 0;
        switch(this.difficulty){
            case 1:
                upper = [-350, -450];
                dist = [500, 500];
                break;
            case 2:
                upper = [-350, -450];
                dist = [300, 500];
                multi = 2;
                break;
            case 3:
                dist = [200, 300];
                upper = [-350, -450];
                break;
            case 4:
                upper = [-350, -450];
                this.gap = 200;
                break;
            case 5:
                if (pipe.acceleration.x != -10) this.Pipes.forEach((pipe) => {pipe.acceleration.x -= 1});
                upper = [-350, -450];
                multi = 3;
                break;
            case 6:
                upper = [-350, -250];
                dist = [200, 300];
                multi = 4;
                if (pipe.acceleration.x != -7) this.Pipes.forEach((pipe) => {pipe.acceleration.x = -7});
                break;
            case 7:
                upper = [-350, -250];
                dist = [300, 350];
                amp = 3;
                this.gap = 180;
                break;
            case 8:
                amp = 6;
                upper = [-350, -450];
                dist = [300, 500];
                multi = 5;
                break;
            case 9:
                // Rotate the Pipes
                break;
        }
        if (checkString == "upper") {
            if (dist[0] != null) this.distBetweenPipes = rand_int_range(dist[0], dist[1]);
            this.newY = rand_int_range(upper[0], upper[1]);
            pipe.setPosition(new Vector2(this.lastPipe.position.x+this.distBetweenPipes, this.newY == 0 ? pipe.position.y : this.newY));
            if (pipe.amp != amp) this.Pipes.forEach((pipe) => {pipe.amplitude = amp});
        }
        else {
            this.newY = pipe.size.y + this.newY + this.gap;
            pipe.setPosition(new Vector2(this.lastPipe.position.x+this.distBetweenPipes, this.newY == 0 ? pipe.position.y : this.newY));
        }
        
        // console.log(this.newY);
        // console.log(pipe.position)
    }
}

function rand_int_range(min, max) {
    if(isNaN(min) || isNaN(max)) return 0;
    return Math.floor(Math.random()* (max - min + 1) + min);
}

const blipCountDown = new AudioPlayer("hangok/countdownBlip.wav", 0.3);
const blipStart = new AudioPlayer("hangok/startBlip.wav", 0.3);
let startCount;

function _startCountdown() {
    gameStarted = false;
    let currText = Number(COUNTDOWN.innerText);
    currText -= 1
    COUNTDOWN.innerText = currText;
    
    if (currText == 0) {
        COUNTDOWN.style.visibility = "hidden";
        clearInterval(startCount)
        AddToScene(scoreCounterColl);
        AddToScene(GROUNDCOLLIDER);
        AddToScene(ROOFCOLLIDER);
        PIPEMANAGER._SpawnPipes();
        SCORECOUNTER.style.visibility = "visible";
        gameStarted = true;
        blipStart.play();
    } else blipCountDown.play();
}

const BACKGROUNDMUSIC = new AudioPlayer("hangok/royal_days.mp3", 0.2, true);
const MAINMENUMUSIC = new AudioPlayer("hangok/phantom.mp3", 0, true);
const RESTARTMENUMUSIC = new AudioPlayer("hangok/days_off.mp3", 0.2, true);
//if (GAMECONTAINER != null) MAINMENUMUSIC.play();
if(confirm("Főmenü zenejét szeretné lejátszani?")) {
    MAINMENUMUSIC.play()
    MAINMENUMUSIC.setVolume(0.1)
}
let maxVol = BACKGROUNDMUSIC.settedVolume;
let faderFunc;
function fadeBGMusicIn() {
    if (BACKGROUNDMUSIC.settedVolume < maxVol) BACKGROUNDMUSIC.settedVolume += 0.01;
    else clearInterval(faderFunc);
    BACKGROUNDMUSIC.settedVolume = Number(BACKGROUNDMUSIC.settedVolume.toFixed(3));
    BACKGROUNDMUSIC.setVolume(BACKGROUNDMUSIC.settedVolume);
}

function _changeMainVolume(newVal) {
    MAINVOLUME = newVal;
    console.log(MAINVOLUME, "is the new Main volume");
    globalAudioList.forEach((audio) => {
        audio.setVolume(audio.volume);
    })
}

const startBlip = new AudioPlayer("hangok/start.wav", 0.5);

function calcCoins() {
    let coins = Math.round(1 * multi);
    gottenCoins += coins
    window.addCoins(coins)
}

function _Resume() {
    changeActiveWindow("PlayArea");
    PLAYER.paused = false;
    SCORECOUNTER.style.visibility = "visible";
    GAMECONTAINER.classList.add("gameTransitionInAnim")
}

function _Restart() {
    const len = globalObjectList.length;
    gameStarted = false;
    RESTARTMENUMUSIC.stop();
    for(let i = 0; i < len; i++) {
        let obj = globalObjectList.pop();
        if(obj instanceof Object) globalAudioList.pop(globalAudioList.indexOf(obj.audioPlayer));
        GAMECONTAINER.removeChild(obj.root);
    }
    _Start();
    //globalObjectList.forEach((obj) => {console.log(obj.root)})
}

function _Start() {
    MAINMENUMUSIC.stop();
    score = 0;
    multi = 1;
    gottenCoins = 0;
    _changeMainVolume(savedSettings.volume)
    changeActiveWindow("PlayArea");
    startBlip.play();
    GAMECONTAINER.classList.add("gameTransitionInAnim");
    BACKGROUNDMUSIC.play(100, false, true, 0);
    COUNTDOWN.style.visibility = "visible";
    COUNTDOWN.innerText = "3";
    SCORECOUNTER.innerText = "0"
    PLAYERTAG.innerText = savedSettings.name;
    tagOffSetX = (PLAYERTAG.innerText.length > 6) ? -PLAYERTAG.innerText.length * 2 : 0;
    faderFunc = setInterval(fadeBGMusicIn, 100);
    console.log("Game Started -------------------------------")
    GAMECONTAINER.focus();
    startCount = setInterval(_startCountdown, 1000);
    startTime = Date.now();
    _InitDefaultScene();
    _process()
}

function _InitDefaultScene() {
    let PLAYER_COLL = new Collider(new Vector2(50, 30));
    PLAYER = new Player(birdIMAGE, new Vector2(80, 50), new Vector2(50, 250), 0.0, PLAYER_COLL);
    PLAYER.frozen = true
    AddToScene(PLAYER);
    scoreCounterColl = new Collider(new Vector2(100, 800), new Vector2(245, 0));
    GROUNDCOLLIDER = new Collider(new Vector2(gameRECT.width, 200), new Vector2(0, 450));
    ROOFCOLLIDER = new Collider(new Vector2(gameRECT.width, 200), new Vector2(0, -200));

    let startPos = Math.floor(gameRECT.width * 1.2);
    PIPEMANAGER = new PipeManager(startPos, 10, scoreCounterColl);
}

function changeActiveWindow(activeID) {
    for(let i = 0; i < WINDOWS.length; i++) {
        let currWindow = WINDOWS.item(i);
        currWindow.classList = "";
        if(currWindow.id == activeID) currWindow.classList.add("active");
        else currWindow.classList.add("disabled");
    }
}

let paralexVec = new Vector2(0, 0);
function _process() {
    //if(!PLAYER.isDead) console.log(`Time passed: ${(Date.now() - startTime)/1000} sec`)
    elapsedTime = Date.now() - startTime;
    if(!PLAYER.frozen || this.gameStarted) {
        globalObjectList.forEach((obj) => {
            if (obj instanceof Object) obj.move();
            if(obj instanceof Pipe){
                paralexVec.x += obj.velocity.x;
                if (obj.pipeCollider.isColliding(PLAYER)) PLAYER.die();
            }
        })
    }

    if(GROUNDCOLLIDER.isColliding(PLAYER) || ROOFCOLLIDER.isColliding(PLAYER)) PLAYER.die();

    GROUNDTILE.style.backgroundPosition = paralexVec.x + "px 0px";
    BACKGROUNDTREES.style.backgroundPosition = (paralexVec.x * 0.01) + "px 0px";
    BACKGROUNDBUILDINGS.style.backgroundPosition = (paralexVec.x * 0.005) + "px 0px";
    BACKGROUNDCLOUDS.style.backgroundPosition = (paralexVec.x * 0.001) + "px 0px";

    
    PLAYERTAG.style.left = (PLAYER.position.x + tagOffSetX) + "px";
    PLAYERTAG.style.top = (PLAYER.position.y + tagOffsetY) + "px";

    if(scoreCounterColl.isColliding(PLAYER) && !PLAYER.isDead) {
        score++;
        PIPEMANAGER.scored();
    }

    CONFETTI.style.left = PLAYER.position.x +"px";
    CONFETTI.style.top = PLAYER.position.y +"px";

    PIPEMANAGER._checkOffPipes();
    //scoreCounterColl.debugDraw();
    SCORECOUNTER.innerText = score;
    if(PLAYER.position.y < 1500) requestAnimationFrame(_process);
    else changeActiveWindow("RestartMenu");
}