// "Every great game begins with a single scene. Let's make this one unforgettable!"
export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('background', 'assets/space.png');
        this.load.image('cursor', 'assets/hammer.png');
        this.load.image('hole', 'assets/hole.png');
        this.load.image('walrus', 'assets/walrus.png');
        this.load.image('splat1', 'assets/splat1.png');
        this.load.image('splat2', 'assets/splat2.png');
        this.load.image('splat3', 'assets/splat3.png');
        this.load.image('splat4', 'assets/splat4.png');
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        this.customCursor = this.add.image(0, 0, 'cursor').setDepth(1000);
        this.customCursor.setOrigin(.5, .25);

        this.holes = [];
        this.activeHole = null;

        this.spawnHoles();

        this.initialSpawnRate = 500;
        this.spawnRate = this.initialSpawnRate;
    }

    update() {
        this.background.tilePositionX += 2;

        const pointer = this.input.activePointer;
        this.customCursor.setPosition(pointer.x, pointer.y);

        this.spawnRate--;
        if (this.spawnRate < 0)
        {
            this.spawnRate = this.initialSpawnRate;
            const randomHole = this.holes[Phaser.Math.Between(0, this.holes.length - 1)];
            randomHole.setTexture('walrus');
            this.activeHole = randomHole;
            this.time.delayedCall(500, () => {
                randomHole.setTexture('hole');
                this.activeHole = null;
            });
        }
    }

    spawnHoles() {
        const holeCount = 12;
        const holesPerRow = holeCount / 3;
        const holeSpacing = 150;
        const rowYPositions = [
            this.sys.canvas.height / 2 - 200,
            this.sys.canvas.height / 2,
            this.sys.canvas.height / 2 + 200,  
        ];

        for (let i = 0; i < holeCount; i++) {
            const row = Math.floor(i / holesPerRow);
            const col = i % holesPerRow;

            const totalWidth = (holesPerRow - 1) * holeSpacing;
            const positionX = this.sys.canvas.width / 2 - totalWidth / 2 + col * holeSpacing;
            const positionY = rowYPositions[row];

            const sprite = this.add.sprite(positionX, positionY, 'hole').setInteractive();
            sprite.setScale(0.5);
            sprite.setOrigin(0.5);

            sprite.on("pointerdown", (pointer) => {
                event.stopPropagation();
                this.onHoleClicked(this.holes[i], pointer);
            });

            this.holes.push(sprite);
        }

        console.table(this.holes);
    }

    onHoleClicked(hole, pointer)
    {
        console.log(this.activeHole == hole);
        if (this.activeHole == hole)
        {
            const walrus = this.add.sprite(hole.x, hole.y, 'walrus');
            walrus.setOrigin(0.5);
            walrus.setScale(.75);
            this.time.delayedCall(500, () => {
                walrus.destroy();
            });
        }
        else
        {
            const splatTextures = ['splat1', 'splat2', 'splat3', 'splat4',];
            const splat = this.add.sprite(pointer.x, pointer.y, splatTextures[0, splatTextures.length - 1]);
            splat.setOrigin(0.5);
            this.time.delayedCall(250, () => {
                splat.destroy();
            });
        }
    }
}
