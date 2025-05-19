import { Start } from './scenes/Start.js';
import { Game } from './scenes/Game.js';

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        Start,
        Game
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
    default: 'arcade',
        arcade: {
        gravity: { y: 0 },
        debug: false
        }
    },
}

new Phaser.Game(config);