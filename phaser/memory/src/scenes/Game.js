// "Every great game begins with a single scene. Let's make this one unforgettable!"
export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('background', 'assets/space.png');
        this.load.image('1', 'assets/1.png');
        this.load.image('2', 'assets/2.png');
        this.load.image('3', 'assets/3.png');
        this.load.image('4', 'assets/4.png');
        this.load.image('5', 'assets/5.png');
        this.load.image('6', 'assets/6.png');
        this.load.image('back', 'assets/back.png');
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        this.deck = [
            '1', '1',
            '2', '2',
            '3', '3',
            '4', '4',
            '5', '5',
            '6', '6',
        ];

        this.deckSprite = [];
        this.currentDeckPairing = [];
        this.deckPaired = [];

        this.shuffleDeck();

        this.spawnDeck();

        this.currentMatchPatternCount = 0;
        this.flipCount = 0;
    }

    update() {
        this.background.tilePositionX += 2;
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    spawnDeck() {
        const cardsPerRow = this.deck.length / 2;
        const cardSpacing = 150;
        const rowYPositions = [
            this.sys.canvas.height / 2 - 100,
            this.sys.canvas.height / 2 + 100  
        ];

        for (let i = 0; i < this.deck.length; i++) {
            const row = Math.floor(i / cardsPerRow);
            const col = i % cardsPerRow;

            const totalWidth = (cardsPerRow - 1) * cardSpacing;
            const positionX = this.sys.canvas.width / 2 - totalWidth / 2 + col * cardSpacing;
            const positionY = rowYPositions[row];

            const sprite = this.add.sprite(positionX, positionY, 'back').setInteractive();
            sprite.setOrigin(0.5);
            sprite.setScale(0.3);

            sprite.on("pointerdown", () => {
                this.onDeckClicked(this.deck[i], sprite);
            });

            this.deckSprite.push(sprite);
        }
    }

    onDeckClicked(deckElement, deckSprite) {
        if (this.currentDeckPairing.length >= 2 || this.currentDeckPairing.includes(deckSprite)) return;

        deckSprite.setTexture(deckElement);
        this.currentDeckPairing.push({ key: deckElement, sprite: deckSprite });

        if (this.currentDeckPairing.length === 2) {
            const [first, second] = this.currentDeckPairing;

            if (first.key === second.key) {
                this.deckPaired.push(first.key);
                this.currentDeckPairing = [];
                if (this.deckPaired.length >= this.deck.length/2) {
                    console.log("YOU WIN");
                }
            } else {
                this.time.delayedCall(1000, () => {
                    first.sprite.setTexture('back');
                    second.sprite.setTexture('back');
                    this.currentDeckPairing = [];
                });
            }
        }
    }
}
