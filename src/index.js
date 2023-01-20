var fireWorkList = [];

var explodeSound;
var bgMusic;

class FireWorkParticle {
    constructor(position, velocity, r, g, b) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = createVector(0, random(0.1, 0.2));
        this.lifeSpan = 255;
        this.size = random(2, 15);
        this.state = floor(random(0, 8));

        this.r = r;
        this.g = g;
        this.b = b;
    }
    update() {
        this.velocity.add(this.acceleration);
        if (this.state == 0) {
            this.position.x += this.velocity.x / 2;
            this.position.y += this.velocity.y / 2;
        } else {
            this.position.add(this.velocity);
        }
        this.lifeSpan -= 5;
    }
    display() {
        noStroke();
        if (this.state == 0) {
            fill(255, this.g, this.b, this.lifeSpan);
            push();
            translate(this.position.x, this.position.y);
            rotate(PI);
            beginShape();
            vertex(0, 0);
            vertex(-2 * this.size, 2 * this.size);
            vertex(-this.size, 3 * this.size);
            vertex(0, 2 * this.size);
            vertex(this.size, 3 * this.size);
            vertex(2 * this.size, 2 * this.size)
            endShape(CLOSE);
            pop();
        } else {
            fill(this.r, this.g, this.b, this.lifeSpan);
            circle(this.position.x, this.position.y, this.size / 3);
        }
    }
    isDead() {
        if (this.lifeSpan < 0) {
            return (true);
        } else {
            return (false);
        }
    }
}

class FireWork {
    constructor(startPosition, upSpeed, explodeTime, particleCount) {
        this.startPosition = startPosition;
        this.position = this.startPosition.copy();
        this.upSpeed = upSpeed;
        this.explodeTime = explodeTime;
        this.particleCount = particleCount;

        this.state = 0;
        this.t = 0;

        this.r = random(50, 240);
        this.g = random(50, 240);
        this.b = random(50, 240);

        this.particleList = [];
    }
    update() {
        this.position.add(this.upSpeed);
        this.t++;
        if (this.t < this.explodeTime) {
            this.state = 0;
        } else if (this.t == this.explodeTime) {
            for (let i = 0; i < this.particleCount; i++) {
                let speedDirection = random(0, PI * 2);
                let speedValue = random(2, 6);
                this.particleList.push(new FireWorkParticle(
                    this.position.copy(),
                    createVector(sin(speedDirection) * speedValue, cos(speedDirection) * speedValue),
                    this.r + random(-40, 40),
                    this.g + random(-40, 40),
                    this.b + random(-40, 40),
                ))
            }
            this.state = 1;
            explodeSound.play();
        } else {
            this.state = 2;
        }
    }
    display() {
        if (this.state == 0 || this.state == 1) {
            noStroke();
            fill(200, 200, 200);
            rect(this.position.x, this.position.y, 5);
        } else {
            for (let i = 0; i < this.particleList.length; i++) {
                if (this.particleList[i].isDead()) {
                    this.particleList.splice(i, 1);
                } else {
                    this.particleList[i].update();
                    this.particleList[i].display();
                }
            }
        }
    }
}

function preload() {
    soundFormats("wav", "ogg");
    explodeSound = loadSound("./asset/sound/fireWork");
    soundFormats("mp3", "ogg");
    bgMusic = loadSound("./asset/sound/bgMusic");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    smooth();
    bgMusic.play();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(0, 150)
    for (var i = 0; i < fireWorkList.length; i++) {
        fireWorkList[i].update();
        fireWorkList[i].display();
    }
}

function touchStarted() {
    fireWorkList.push(new FireWork(
        createVector(mouseX, mouseY),
        createVector(random(-0.8, 0.8), random(-5, -10)),
        40,
        random(50, 150)
    ));
}

function mousePressed() {
    fireWorkList.push(new FireWork(
        createVector(mouseX, mouseY),
        createVector(random(-0.8, 0.8), random(-5, -10)),
        40,
        random(50, 150)
    ));
}
