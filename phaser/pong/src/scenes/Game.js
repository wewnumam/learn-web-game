// "Every great game begins with a single scene. Let's make this one unforgettable!"
export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('paddle', 'assets/paddle.png');
        this.load.image('ball', 'assets/ball.png');
    }

    create() {
        this.players = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 20,
            runChildUpdate: true
        });
        
        this.player1 = this.spawnPlayer(0, this.sys.canvas.height / 2);
        this.player2 = this.spawnPlayer(this.sys.canvas.width, this.sys.canvas.height / 2);

        this.ball = this.physics.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'ball')
            .setCollideWorldBounds(true)
            .setBounce(1)
            .setVelocityX(Phaser.Utils.Array.GetRandom([-500, 500]))
            .setVelocityY(Phaser.Utils.Array.GetRandom([-250, 250]));
        const radius = this.ball.width / 2;
        this.ball.body.setCircle(radius);
        this.ball.body.setOffset(-radius + this.ball.width / 2, -radius + this.ball.height / 2);
        this.ball.body.onWorldBounds = true;

        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            if (body.gameObject !== this.ball) return;

            if (right) {
                this.player1Score++;
                this.updateScore();
                // this.resetBall(-1);
            } else if (left) {
                this.player2Score++;
                this.updateScore();
                // this.resetBall(1);
            }
        });


        this.physics.add.collider(this.players, this.ball, null);

        this.player1Keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            S: Phaser.Input.Keyboard.KeyCodes.S
        });

        this.player2Keys = this.input.keyboard.createCursorKeys();

        this.player1Score = 0;
        this.player2Score = 0;
        this.score = this.add.text(this.sys.canvas.width / 2, 0, '0:0', {
            font: '32px Arial',
            fill: '#ffffff',
        });

        this.score.setOrigin(0.5, 0);
    }

    update() {
        const speed = 500;

        if (this.player1Keys.W.isDown) {
            this.player1.setVelocityY(-speed);
        } else if (this.player1Keys.S.isDown) {
            this.player1.setVelocityY(speed);
        }

        if (this.player2Keys.up.isDown) {
            this.player2.setVelocityY(-speed);
        } else if (this.player2Keys.down.isDown) {
            this.player2.setVelocityY(speed);
        } 
    }

    spawnPlayer(x, y) {
        const player = this.players.get(x, y, 'paddle');

        if (player) {
            player.setActive(true)
                .setVisible(true)
                .setOrigin(0.5)
                .setCollideWorldBounds(true);
            player.body.enable = true;
            player.body.onWorldBounds = true;
            const radius = player.width / 2;
            player.body.setCircle(radius);
            player.body.setOffset(-radius + player.width / 2, -radius + player.height / 2);
        }

        return player;
    }

    resetBall(direction = 1) {
        this.ball.setPosition(this.sys.canvas.width / 2, this.sys.canvas.height / 2);
        this.ball.setVelocity(
            direction * Phaser.Math.Between(300, 500),
            Phaser.Math.Between(-250, 250)
        );
    }

    updateScore() {
        this.score.setText(`${this.player1Score}:${this.player2Score}`);
    }
}
