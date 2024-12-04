let globalObjectList = [];

let startTime;
const GAMECONTAINER = document.getElementById("PlayArea");
const SCORECOUNTER = document.getElementById("ScoreCounter");
let score = 0;

const DEBUGMODE = false;

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
}

class BaseObject {
    constructor(elementName = "", classNameList = [""], size = new Vector2(), position = new Vector2(), rotation = 0.0) {
        this.root = document.createElement(elementName);
        this.root.classList.add(classNameList);

        this.setRotation(rotation)
        this.setSize(size);
        this.setPosition(position);
    }

    setPosition(newPos = new Vector2()) {
        //if (DEBUGMODE) console.info(`[.] (${newPos.x}, ${newPos.y}) new position has been set for ${this.root}`)
        this.position = newPos;
        this.root.style.left = this.position.x + "px";
        this.root.style.top = this.position.y + "px";
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

class Pipe extends Object {
    constructor(sprite_image = new SpriteImage(), size = new Vector2(), position = new Vector2(), rotationDeg = 0.0) {
        super(sprite_image, size, position, rotationDeg)
        this.pipeRoot = this.root;
        this.pipeCollider = new Collider(new Vector2(size.x, size.y-20));
        this.addChildToRoot(this.pipeCollider);
        this.acceleration = new Vector2(-5, 0);
    }
    move () {
        this.pipeCollider.position = this.position;

        if(this.acceleration) {
            this.velocity.x = this.acceleration.x;
            this.velocity.y = this.acceleration.y;
        }
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.setPosition(this.position);

    }
}

document.addEventListener("keydown", (ev) => {
    PLAYER._input(ev);
})

document.addEventListener("keyup", (ev) => {
    PLAYER._input(ev);
})

class Player extends Object {
    constructor(sprite_image = new SpriteImage(), size = new Vector2(), position = new Vector2(), rotationDeg = 0.0, collider) {
        super(sprite_image, size, position, rotationDeg)
        this.pipeRoot = this.root;
        this.pipeCollider = collider;
        this.addChildToRoot(this.pipeCollider);

        this.gravity = 10;

        this.acceleration.y = this.gravity;
        this.jumpForce = -4.3;
        this.isDead = false;
        this.isFalling = true;
        this.needToFall = false;
        this.isJumping = false;
        this.x = 0;
    }

    move() {
        if(this.isDead) return;
        if(this.acceleration && !this.isJumping) {
            if (!this.isFalling) {
                this.acceleration.y += 0.4;
                if(this.acceleration.y >= 1) {
                    this.isFalling = true;
                }
            }
        } else if(this.isJumping && !this.needToFall) {
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

        this.setPosition(this.position);
    }

    _input(keyboardEvent) {
        if(keyboardEvent.type == "keydown") {
            switch(keyboardEvent.keyCode) {
                case 32:
                    if(this.needToFall) return;
                    //console.log("Jumping");
                    this.x+=0.4;
                    this.isJumping = true;
            }
        }
        else 
        {
            switch(keyboardEvent.keyCode) {
                case 32:
                    if(this.needToFall) this.needToFall = false;
                    //console.log("NotJumping");
                    this.x=0;
                    this.isJumping = false;
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

const birdIMAGE = new SpriteImage("kepek/bird.png");
const pipeIMAGE = new SpriteImage("kepek/pipe.png")

class PipeManager {
    constructor(startPos = 0, pipesCount = 0, scoreCounter = new Collider()) {
        this.difficulty = 1;
        this.distBetweenPipes = 500;
        this.activePipeIndx = 0;
        this.scoreCounterColl = scoreCounter;
        this.Pipes = new Array();
        for (var indx = 1; indx <= pipesCount; indx++) {
            let currentDist = startPos + this.distBetweenPipes*(indx-1); // indx - 1, hogy az első pontosan a startPos-on kezdjen
            const newUpPipe = new Pipe(pipeIMAGE, new Vector2(125, 300), new Vector2(currentDist, -100+(Math.floor(Math.random()*-100))), 0.0);
            const newBotPipe = new Pipe(pipeIMAGE, new Vector2(125, 300), new Vector2(currentDist, 350+(Math.floor(Math.random()*50))), 180.0);
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
        if(activePipe != undefined) this.scoreCounterColl.setPosition(activePipe.position);
        else {
            console.log("undie")
        }
    }

    scored() {
        this.activePipeIndx += 2;
        if(this.activePipeIndx > this.Pipes.length-1) this.activePipeIndx = 0;
        if (score > 10) this.difficulty++;
    }

    rePositionPipe(checkString = "", pipe){
        switch(this.difficulty){
            case 1:
                if(checkString == "upper") pipe.setPosition(new Vector2(this.lastPipe.position.x+this.distBetweenPipes, -100+(Math.floor(Math.random()*-100))));
                if(checkString == "bottom") pipe.setPosition(new Vector2(this.lastPipe.position.x+this.distBetweenPipes, 350+(Math.floor(Math.random()*50))));
                break;
            case 2:
                if(checkString == "upper") pipe.setPosition(new Vector2(this.lastPipe.position.x+this.distBetweenPipes, -100+(Math.floor(Math.random()*-100))));
                if(checkString == "bottom") pipe.setPosition(new Vector2(this.lastPipe.position.x+this.distBetweenPipes, 350+(Math.floor(Math.random()*50))));
                break;
        }
    }
}

const PLAYER_COLL = new Collider(new Vector2(50, 30));
const PLAYER = new Player(birdIMAGE, new Vector2(80, 50), new Vector2(50, 0), 0.0, PLAYER_COLL);


const scoreCounterColl = new Collider(new Vector2(20, 800), new Vector2(245, 0));
let startPos = GAMECONTAINER.getBoundingClientRect().width * 0.6;
const PIPEMANAGER = new PipeManager(startPos, 6, scoreCounterColl);
console.log(startPos);
function _Start(button) {
    button.style.visibility = "hidden";
    SCORECOUNTER.style.visibility = "visible";
    console.log("Game Started -------------------------------")
    GAMECONTAINER.focus();
    AddToScene(PLAYER);
    AddToScene(scoreCounterColl);
    PIPEMANAGER._SpawnPipes();
    
    startTime = Date.now();
    _process()
}


function _process() {
    //if(!PLAYER.isDead) console.log(`Time passed: ${(Date.now() - startTime)/1000} sec`)
    globalObjectList.forEach((obj) => {
        if (obj instanceof Object) obj.move();
        if(obj instanceof Pipe){
            if (obj.pipeCollider.isColliding(PLAYER)) PLAYER.isDead = true;
            obj.pipeCollider.debugDraw();
        }
    })

    if(scoreCounterColl.isColliding(PLAYER)) {
        PIPEMANAGER.scored();
        score++;
    }

    PIPEMANAGER._checkOffPipes();
    scoreCounterColl.debugDraw();
    PLAYER_COLL.debugDraw();
    SCORECOUNTER.innerText = score;
    requestAnimationFrame(_process)
}