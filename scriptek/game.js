let globalObjectList = [];
let pipesToAdd = [];

let activeSnapIdx = 0;
let pipesToSnap = [];

let startTime;
const GAMECONTAINER = document.getElementById("PlayArea");

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

    isOffScreen() {
        if(this.position.x + this.size.x <= 0) return true;
        return false;
    }

    setPosition(newPos = new Vector2()) {
        if (DEBUGMODE) console.info(`[.] (${newPos.x}, ${newPos.y}) new position has been set for ${this.root}`)
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
        pipesToAdd.push(this);
    }
    move () {
        // if(this.isOffScreen()) {
        //     this.setPosition(new Vector2(1000, this.position.y));
        //     this.pipeCollider.position = this.position;
        // }

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

        this.gravity = 8;

        this.acceleration.y = this.gravity;
        this.jumpForce = -6;
        this.isDead = true;
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

class Pipes {
    constructor(posX = 0, UpperY, BottomY){
        this.UpperPipe = new Pipe(pipeIMAGE, new Vector2(100, 200), new Vector2(posX, UpperY), 0.0);
        this.BottomPipe = new Pipe(pipeIMAGE, new Vector2(100, 200), new Vector2(posX, BottomY), 180);
    }
}

class PipeSpawner {
    constructor() {
        this.difficulty = 1;
        this.currentDistance = 400;
        this.distanceBetween = 200;
    }
    spawn() {
        console.log("Spawned!");
        let newPipes;
        newPipes = new Pipes(this.currentDistance, Math.floor(Math.random() * -100), Math.floor(Math.random() * 50)+400);
        pipesToSnap.push(newPipes.UpperPipe);
        this.currentDistance += this.distanceBetween;
    }
}

const PLAYER_COLL = new Collider(new Vector2(50, 30));
const PLAYER = new Player(birdIMAGE, new Vector2(80, 50), new Vector2(50, 0), 0.0, PLAYER_COLL);


const scoreCounterColl = new Collider(new Vector2(20, 800), new Vector2(245, 0));
const PIPEMANAGER = new PipeSpawner();

function _Start(button) {
    button.remove();
    AddToScene(PLAYER);
    AddToScene(scoreCounterColl);
    for(let i = 0; i < pipesToAdd.length; i++) {
        AddToScene(pipesToAdd[i])
    }
    startTime = Date.now();
    _process()
}


let spawnedDefault = false;
let defaultCount = 6;


function _process() {
    if(!spawnedDefault) {
        for(let i = 0; i != defaultCount; i++) {
            PIPEMANAGER.spawn();
            console.log(i);
        }
        spawnedDefault = true;
    }
    //if(!PLAYER.isDead) console.log(`Time passed: ${(Date.now() - startTime)/1000} sec`)
    let activePipe = pipesToSnap[activeSnapIdx];
    globalObjectList.forEach((obj) => {
        if (obj instanceof Object) obj.move();
        if(obj instanceof Pipe){
            if (obj.pipeCollider.isColliding(PLAYER)) PLAYER.isDead = true;
            obj.pipeCollider.debugDraw();
        }
    })

    scoreCounterColl.debugDraw();
    scoreCounterColl.setPosition(new Vector2(activePipe.position.x + activePipe.size.x / 2, scoreCounterColl.position.y));

    if(scoreCounterColl.isColliding(PLAYER)) {
        if(!PLAYER.isDead) console.log("scored");
        activeSnapIdx += 1;
        if(activeSnapIdx == pipesToSnap.length) activeSnapIdx = 0;
    }
    
    PLAYER_COLL.debugDraw();
    requestAnimationFrame(_process)
}