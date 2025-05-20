export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('background', 'assets/space.png');

        this.blocks = ['block1', 'block2', 'block3', 'block4'];
        this.load.image(this.blocks[0], 'assets/block1.png');
        this.load.image(this.blocks[1], 'assets/block2.png');
        this.load.image(this.blocks[2], 'assets/block3.png');
        this.load.image(this.blocks[3], 'assets/block4.png');
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        this.floor = this.add.tileSprite(
            this.sys.canvas.width / 2,
            this.sys.canvas.height - 50,
            this.sys.canvas.width,
            100,
            this.blocks[0]
        );

        this.physics.add.existing(this.floor, true);

        this.blockGroup = this.physics.add.group();

        this.stackCount = 0;
        this.stackThreshold = 7;
        this.cameraMoveCount = 0;
        this.score = 0;

        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '32px',
            color: '#ffffff',
        }).setScrollFactor(0);

        this.gameOver = false;

        this.currentBlock = this.spawnBlock();

        this.input.keyboard.on('keydown', (event) => {
            if (this.gameOver) return;

            this.tweens.killTweensOf(this.currentBlock);
            this.currentBlock.body.setAllowGravity(true);
            this.blockGroup.add(this.currentBlock);

            this.physics.add.collider(this.currentBlock, this.floor, () => {
                this.freezeBlock(this.currentBlock);
                this.afterBlockPlaced();
                if (this.score > 1) {
                    this.endGame();
                }
            });

            this.physics.add.collider(this.currentBlock, this.blockGroup, () => {
                this.freezeBlock(this.currentBlock);
                this.afterBlockPlaced();
                console.log(this.stackCount, this.cameraMoveCount, this.cameraMoveCount * -this.sys.canvas.height);
            });
        });
    }

    update() {
        if (!this.gameOver) {
            this.background.tilePositionX += 2;
        }
    }

    spawnBlock() {
        const block = this.physics.add.sprite(
            this.sys.canvas.width / 2,
            this.cameras.main.scrollY,
            Phaser.Utils.Array.GetRandom(this.blocks)
        )
            .setOrigin(0.5)
            .setVelocityY(0)
            .setBounce(0.1);

        block.body.setAllowGravity(false);

        const baseDuration = 2000;
        const minDuration = 50;
        const speedIncreasePerStack = 150;

        let duration = baseDuration - this.stackCount * speedIncreasePerStack;
        if (duration < minDuration) duration = minDuration;

        this.tweens.add({
            targets: block,
            x: {
                from: this.sys.canvas.width / 2 - 200,
                to: this.sys.canvas.width / 2 + 200
            },
            duration: duration,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        return block;
    }

    freezeBlock(block) {
        block.body.setAllowGravity(false);
        block.body.setVelocity(0);
        block.body.immovable = true;

        this.stackCount++;

        if (this.stackCount % this.stackThreshold === 0) {
            this.moveCameraUp();
        }
    }

    afterBlockPlaced() {
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);

        this.currentBlock = this.spawnBlock();
        if(this.stackCount % this.stackThreshold === 0)
        {
            this.time.delayedCall(500, () => this.currentBlock.y = this.cameras.main.scrollY)
        }
    }

    endGame() {
        this.gameOver = true;
        this.tweens.killTweensOf(this.currentBlock);
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
            scrollY: this.cameras.main.scrollY - this.sys.canvas.height + 300,
            duration: 500,
            ease: 'Sine.easeInOut'
        });
        this.cameraMoveCount++;
    }
}