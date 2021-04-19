// Goblin1 prefab
class Goblin1 extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y , texture, frame);
        scene.add.existing(this);                       // add to existing scene
        this.points = pointValue;                       // store pointValue
        this.moveSpeed = game.settings.goblin1Speed;    // pixels per frame
    }

    update() {
        // move goblin left
        this.x -= this.moveSpeed;
        // wrap around from left edge to right edge
        if(this.x <= 0 - this.width) {
            this.x = game.config.width;
        }
    }

    // position reset
    reset() {
        this.x = game.config.width;
    }
}