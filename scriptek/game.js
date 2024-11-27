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
        this.size = size;
        this.position = position;

        this.setRotation(rotation)
        this.setSize(size);
        this.setPosition(position);
    }

    setPosition(newPos = new Vector2()) {
        if (DEBUGMODE) console.info(`[.] (${newPos.x}, ${newPos.y}) new position has been set for ${this.divROOT}`)
        this.root.style.left = this.position.x + "px";
        this.root.style.top = this.position.y + "px";
    }

    setSize(newSize = new Vector2()) {
        if (newSize.y == 0) return;
        if (DEBUGMODE) console.info(`[.] (${newSize.x}, ${newSize.y}) new size has been set for ${this.root}`)
        this.root.style.height = this.size.y + "px";
        this.root.style.width = this.size.x + "px";
    }

    setRotation(newRot = 0.0) {
        if (DEBUGMODE) console.info(`[.] (${newRot}) new rotation has been set for ${this.divROOT}`)
        this.root.style.transform = "rotate(" + this.rotation + "deg)";
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

        this.setRotation(this.rotation);
        AddToScene(this);
    }

    move() {
        // balra fog elmozogni
    } 

}

class Collider extends BaseObject {
    constructor() {
        if (DEBUGMODE) {
            super("div",  [""])
        }
        super("div", )
    }
}

function AddToScene(object) {
    const ROOT = object.divROOT;
    globalObjectList.push(object);
    
    GAMECONTAINER.appendChild(ROOT);
    if (DEBUGMODE) console.log("Added a new object: ", ROOT);
}

const birdIMAGE = new SpriteImage("kepek/bird.png");
const PLAYER = new Object(birdIMAGE, new Vector2(100, 50), new Vector2(50, 300), 45.0);