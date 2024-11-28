let globalObjectList = [];
const GAMECONTAINER = document.getElementById("PlayArea");

const DEBUGMODE = true;

class Vector2 {
    constructor(posX = 0, posY = 0) {
        this.x = posX;
        this.y = posY;
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
        if (DEBUGMODE) console.info(`[.] (${newPos.x}, ${newPos.y}) new position has been set for ${this.divROOT}`)
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
        if (DEBUGMODE) console.info(`[.] (${newRot}) new rotation has been set for ${this.divROOT}`)
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
        this.root.appendChild(childObject.root);
    }
    
}

class SpriteImage extends BaseObject{
    constructor(imagePath = "", size = new Vector2()) {
        super("img", ["objectSprite"], size, new Vector2(), 0.0)
        this.imgROOT = this.root;
        this.imagePath = imagePath;
        this.imgROOT.src = this.imagePath;
        if (size.y == 0) {
            console.warn("[!] An Image size has not been set: " + this.imagePath + "\nSize set to inherit 100%");
            this.imgROOT.style.width = "100%";
            this.imgROOT.style.height = "100%";
        }
    }
}

class Object extends BaseObject {
    constructor(sprite_image = new SpriteImage(), size = new Vector2(), position = new Vector2(), rotationDeg = 0.0) {
        super("div", ["object"], size, position, rotationDeg)
        
        this.sprite_image = sprite_image;
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
    constructor(size = new Vector2()) {
        super("div", ["collider"], size);
        this.colliderROOT = this.root;
        this.colliding = false;
    }
    isColliding(withObject) {
        let r1xRight = withObject.position.x + (withObject.size.x / 2);
        let r1yRight = withObject.position.y + (withObject.size.y / 2);

        let r2xRight = this.position.x + (this.size.x / 2);
        let r2yRight = this.position.y + (this.size.y / 2);
        console.log(withObject.position.y-1 <= r2yRight)
        if (r1xRight >= this.position.x &&
            withObject.position.x <= r2xRight &&
            r1yRight >= this.position.y &&
            withObject.position.y-withObject.size.y <= r2yRight
        ) {
                withObject.colliding = true
                this.colliding = true;
                return true;
        }
        this.colliding = false;
        return false;
    }
    debugDraw() {
        if (this.colliderROOT.classList.contains("debugCollider")) {
            if (this.colliding) {
                this.colliderROOT.classList.remove("debugCollider");
                this.colliderROOT.classList.add("debugColliderColliding");
            }
            else {
                this.colliderROOT.classList.add("debugCollider");
                this.colliderROOT.classList.remove("debugColliderColliding");
            }
        }
        else {
            this.colliderROOT.classList.add("debugCollider");
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


const PLAYER = new Object(birdIMAGE, new Vector2(80, 50), new Vector2(100, 300), 0.0);

const PLAYER_COLL = new Collider(new Vector2(20, 20));
PLAYER.addChildToRoot(PLAYER_COLL);
const TESTPIPE = new Object(pipeIMAGE, new Vector2(100, 100), new Vector2(50, 200), 0);
AddToScene(PLAYER);
const TESTCOLLIDER = new Collider(new Vector2(100, 100));
TESTPIPE.addChildToRoot(TESTCOLLIDER);

AddToScene(TESTPIPE);
console.log(PLAYER.position.x+PLAYER.size.x)

function _process() {
    TESTCOLLIDER.debugDraw();
    PLAYER_COLL.debugDraw();
    TESTCOLLIDER.isColliding(PLAYER_COLL);
    requestAnimationFrame(_process)
}

_process()