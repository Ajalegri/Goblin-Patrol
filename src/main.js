/*
    Goblin Patrol, by Antonio Alegria
    Updated 4/19/2021
    Running devtime: 11hrs
*/
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

/*
    -------- POINTS BREAKDOWN ---------

    WIP Full game aesthetic redesign (art, sound, UI) (60)
    30-second speed increase (5)
    Randomized enemy direction (5)
    Original music (5)
    Visible timer (10)
    New enemy type (20)
    Total: 105
*/