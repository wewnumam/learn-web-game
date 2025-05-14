// "Every great game begins with a single scene. Let's make this one unforgettable!"
export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('background', 'assets/space.png');
        this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
        this.load.spritesheet('enemy', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        this.ship = this.physics.add.sprite(640, 360, 'ship');
        this.ship.setCollideWorldBounds(true);
        this.ship.setGravityY(1000);
        this.ship.setBounce(0.2);
        
        this.ship.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 2 }),
            frameRate: 15,
            repeat: -1
        });

        this.ship.play('fly');

        this.enemy = this.physics.add.sprite(640, 360, 'enemy');
        this.enemy.setCollideWorldBounds(true);
        this.enemy.setGravityY(1000);
        this.enemy.setBounce(0.2);
        
        this.enemy.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 2 }),
            frameRate: 15,
            repeat: -1
        });

        this.enemy.play('fly');

        this.enemy.flipX = true;
        this.enemy.x = this.sys.canvas.width;
        this.enemy.y = this.sys.canvas.height;

        this.isJump = false;

        this.input.keyboard.on('keydown', this.pressAnyKey, this);

        this.physics.add.collider(this.ship, this.enemy);

        this.isGameOver = false;
        this.score = 0;

        const { width, height } = this.sys.game.config;
        this.scoreText = this.add.text(width / 2, height / 2, '0', {
            font: '64px Arial',
            fill: '#ffffff',
        });

        this.scoreText.setOrigin(0.5);
    }

    update()
    {
        this.background.tilePositionX += 2;

        if (this.enemy.body.blocked.left)
        {
            this.enemy.x = this.sys.canvas.width;
            this.enemy.y = this.sys.canvas.height;

            if (!this.isGameOver)
            {
                this.score++;
                this.scoreText.setText(this.score);
            }
        }
        else
        {
            this.enemy.setVelocityX(-1500);
        }

        if (this.ship.body.touching.right)
        {
            this.isGameOver = true;
        }
        
        if (this.isJump && this.ship.body.blocked.down && !this.isGameOver) {
            console.log("JUMP");
            this.ship.setVelocityY(-1000);
            this.isJump = false;
        }
    }

    pressAnyKey(event)
    {
        this.isJump = true;
        if (this.isGameOver)
        {
            this.scene.start('Start');
        }
    }
}
