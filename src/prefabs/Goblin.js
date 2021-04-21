// Goblin prefab
class Goblin extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, speed) {
        super(scene, x, y , texture, frame);
        scene.add.existing(this);                   // add to existing scene
        this.points = pointValue;                   // store pointValue
        this.dir = Math.round(Math.random())*2-1;   // random direction
        this.spd = speed                            // storing the speed variable for reference
        this.moveSpeed = this.spd*this.dir;              // pixels per frame
    }

    update() {
        // move goblin
        this.x -= this.moveSpeed;
        // wrap around
        if (this.x <= 0 - game.config.width/2) {
            this.x = game.config.width;
        } else if (this.x >= game.config.width*1.5) {
            this.x = 0;
        }
    }

    // position reset
    reset() {
        this.x = game.config.width;
    }
}