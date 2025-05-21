// "Every great game begins with a single scene. Let's make this one unforgettable!"
export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.animals = ['buffalo', 'crocodile', 'dog', 'hippo', 'rhino'];
        for (let i = 0; i < this.animals.length; i++) {
            this.load.image(this.animals[i], `assets/${this.animals[i]}.png`);
        }

        this.load.image('frog', 'assets/frog.png');
    }

    create() {
        this.isMoving = false;
        this.stepHeight = 64;
        this.stepCount = 0;
        this.stepThreshold = 12;

        this.frog = this.physics.add.sprite(
            this.sys.canvas.width / 2,
            this.sys.canvas.height,
            'frog'
        )
        .setOrigin(0.5)
        .setDisplaySize(64, 64);

        this.targetY = this.frog.y;

        this.input.keyboard.on('keydown', (event) => {
            if (!this.isMoving) {
                this.isMoving = true;
                this.targetY -= this.stepHeight;
                this.physics.moveTo(this.frog, this.frog.x, this.targetY, 200);

                this.stepCount++;

                if (this.stepCount % this.stepThreshold === 0) this.moveCameraUp();
            }
        });

        this.animalGroup = this.physics.add.group();

        const animalLength = 100;
        for (let i = 1; i < animalLength; i++) {
            const fromLeft = Math.random() < 0.5;
            const x = fromLeft ? 0 : this.sys.canvas.width;
            const y = -i * (this.stepHeight * 2) + this.sys.canvas.height;
            const spriteKey = Phaser.Utils.Array.GetRandom(this.animals);

            const animal = this.animalGroup.create(x, y, spriteKey)
                .setOrigin(0.5)
                .setDisplaySize(64, 64);

            animal.speed = Phaser.Math.Between(100, 1000);
            animal.direction = fromLeft ? 1 : -1;
            animal.body.setVelocityX(animal.speed * animal.direction);
        }

        // Add collider
        this.physics.add.overlap(this.frog, this.animalGroup, () => {
            this.gameOver();
        }, null, this);
    }

    update() {
        const dist = Phaser.Math.Distance.Between(this.frog.x, this.frog.y, this.frog.x, this.targetY);
        if (this.isMoving && dist < 4) {
            this.frog.body.setVelocity(0);
            this.frog.y = this.targetY;
            this.isMoving = false;
        }

        this.animalGroup.children.iterate(animal => {
            if (!animal) return;

            // Change direction if hitting screen edge
            if (animal.x < 0 && animal.direction === -1) {
                animal.direction = 1;
                animal.body.setVelocityX(animal.speed);
            } else if (animal.x > this.sys.canvas.width && animal.direction === 1) {
                animal.direction = -1;
                animal.body.setVelocityX(-animal.speed);
            }
        });
    }

    gameOver() {
        this.physics.pause();
        this.add.text(this.sys.canvas.width / 2, this.cameras.main.scrollY, 'Game Over\nPress R to Restart', {
            fontSize: '48px',
            color: '#ff0000',
            align: 'center'
        }).setOrigin(0.5, 0);

        this.input.keyboard.once('keydown-R', () => {
            this.scene.restart();
        });
    }


    moveCameraUp() {
        this.tweens.add({
            targets: this.cameras.main,
            scrollY: this.cameras.main.scrollY - this.sys.canvas.height,
            duration: 500,
            ease: 'Sine.easeInOut'
        });
    }
}