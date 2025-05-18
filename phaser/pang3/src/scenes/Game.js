export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init() {
        this.gameOverFlag = false;
    }

    preload() {
        this.load.image('background', 'assets/space.png');
        this.load.image('ship', 'assets/ship.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('meteor1', 'assets/meteor1.png');
        this.load.image('meteor2', 'assets/meteor2.png');
        this.load.image('meteor3', 'assets/meteor3.png');
        this.load.image('meteor4', 'assets/meteor4.png');
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        this.ship = this.physics.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height, 'ship')
            .setOrigin(0.5, 1)
            .setCollideWorldBounds(true);

        this.bullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 20,
            runChildUpdate: true
        });

        this.physics.world.on('worldbounds', (body) => {
            const bullet = body.gameObject;
            if (this.bullets.contains(bullet)) {
                this.bullets.killAndHide(bullet);
                bullet.body.enable = false;
            }
        }, this);

        this.meteorLevels = {
            1: this.createMeteorGroup(2),
            2: this.createMeteorGroup(4),
            3: this.createMeteorGroup(8),
            4: this.createMeteorGroup(16)
        };

        // Setup bullet overlap with each meteor level
        Object.entries(this.meteorLevels).forEach(([level, group]) => {
            this.physics.add.overlap(this.bullets, group, (bullet, meteor) => {
                this.handleBulletMeteorCollision(bullet, meteor, parseInt(level));
            });
        });

        // Add collider for bouncing effect between meteors
        const allMeteors = Object.values(this.meteorLevels);
        for (let i = 0; i < allMeteors.length; i++) {
            for (let j = i; j < allMeteors.length; j++) {
                this.physics.add.collider(allMeteors[i], allMeteors[j]);
            }
        }

        // Initial spawn
        this.spawnMeteor(this.meteorLevels[1], this.sys.canvas.width * 0.3, 100, 'meteor1');
        this.spawnMeteor(this.meteorLevels[1], this.sys.canvas.width * 0.7, 100, 'meteor1');


        // Add collider between ship and meteors to trigger game over
        Object.values(this.meteorLevels).forEach(group => {
            this.physics.add.collider(this.ship, group, this.onShipHit, null, this);
        });


        this.arrowKey = this.input.keyboard.createCursorKeys();
        this.moveKeys = this.input.keyboard.addKeys({
            A: Phaser.Input.Keyboard.KeyCodes.A,
            D: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shootKey.on('down', () => this.onShoot());
    }

    update() {
        this.background.tilePositionX += 2;

        if (this.gameOverFlag) return;

        const speed = 160;
        this.ship.setVelocityX(0);

        if (this.arrowKey.left.isDown || this.moveKeys.A.isDown) {
            this.ship.setVelocityX(-speed);
        } else if (this.arrowKey.right.isDown || this.moveKeys.D.isDown) {
            this.ship.setVelocityX(speed);
        }
    }

    onShoot() {
        const bullet = this.bullets.get(this.ship.x, this.ship.y - 50, 'bullet');
        if (bullet) {
            bullet.setActive(true)
                .setVisible(true)
                .setOrigin(0.5)
                .setCollideWorldBounds(true);
            bullet.body.enable = true;
            bullet.body.onWorldBounds = true;
            bullet.setVelocityY(-1000);
        }
    }

    createMeteorGroup(maxSize) {
        return this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize,
            runChildUpdate: true
        });
    }

    spawnMeteor(group, x, y, texture) {
        const meteor = group.get(x, y, texture);
        if (meteor) {
            meteor.setActive(true)
                .setVisible(true)
                .setOrigin(0.5)
                .setCollideWorldBounds(true)
                .setBounce(1)
                .setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(20, 100));
            meteor.body.enable = true;
            const radius = meteor.width / 2;
            meteor.body.setCircle(radius);
            meteor.body.setOffset(-radius + meteor.width / 2, -radius + meteor.height / 2);
        }
    }

    handleBulletMeteorCollision(bullet, meteor, level) {
        this.bullets.killAndHide(bullet);
        bullet.body.enable = false;

        const currentGroup = this.meteorLevels[level];
        currentGroup.killAndHide(meteor);
        meteor.body.enable = false;

        const nextLevel = level + 1;
        if (this.meteorLevels[nextLevel]) {
            this.spawnMeteor(this.meteorLevels[nextLevel], meteor.x, meteor.y, `meteor${nextLevel}`);
            this.spawnMeteor(this.meteorLevels[nextLevel], meteor.x, meteor.y, `meteor${nextLevel}`);
        }
    }

    onShipHit(ship, meteor) {
        this.physics.pause();
        ship.setTint(0xff0000);
        ship.setVelocity(0);
        this.gameOver();
    }

    gameOver() {
        this.gameOverFlag = true;

        this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'GAME OVER', {
            fontSize: '64px',
            color: '#ff0000'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown', () => {
            this.scene.start('Start');
        });
    }


}
