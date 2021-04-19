class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('arrow', './assets/arrow.png');
        this.load.image('goblin1', './assets/goblin1.png');
        this.load.image('goblin2', './assets/goblin2.png');
        this.load.image('starfield', './assets/field.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    } 

    create() {
        // place tile sprite
        this.field = this.add.tileSprite(
            0, 
            0, 
            640, 
            480, 
            'starfield'
        ).setOrigin(0, 0);
        
        // add arrow (p1)
        this.p1Arrow = new Arrow(
            this, 
            game.config.width/2, 
            game.config.height - borderUISize - borderPadding, 
            'arrow'
        ).setOrigin(0.5, 0);

        // add goblins (x3)
        this.goblin01 = new Goblin1(
            this, 
            game.config.width + borderUISize*9, 
            borderUISize*4, 
            'goblin2', 
            0, 
            60
        ).setOrigin(0, 0);
        this.goblin02 = new Goblin1(
            this, 
            game.config.width + borderUISize*6, 
            borderUISize*5 + borderPadding*2, 
            'goblin1', 
            0, 
            30
        ).setOrigin(0, 0);
        this.goblin03 = new Goblin1(
            this, 
            game.config.width + borderUISize*3, 
            borderUISize*6 + borderPadding*4, 
            'goblin1', 
            0, 
            20
        ).setOrigin(0,0);
        this.goblin04 = new Goblin1(
            this, 
            game.config.width, 
            borderUISize*7 + borderPadding*6, 
            'goblin1', 
            0, 
            10
        ).setOrigin(0,0);
        
        // brown UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x663931).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
    
        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', 
        scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        if(!this.gameOver) {
            this.p1Arrow.update();      // update arrow sprite
            this.goblin01.update();     // update goblins (x3)
            this.goblin02.update();
            this.goblin03.update();
            this.goblin04.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Arrow, this.goblin04)) {
            this.p1Arrow.reset();
            this.goblinDie(this.goblin04);
        }
        if(this.checkCollision(this.p1Arrow, this.goblin03)) {
            this.p1Arrow.reset();
            this.goblinDie(this.goblin03);
        }
        if (this.checkCollision(this.p1Arrow, this.goblin02)) {
            this.p1Arrow.reset();
            this.goblinDie(this.goblin02);
        }
        if (this.checkCollision(this.p1Arrow, this.goblin01)) {
            this.p1Arrow.reset();
            this.goblinDie(this.goblin01);
        }
    }

    checkCollision(arrow, goblin) {
        // simple AABB checking
        if (arrow.x < goblin.x + goblin.width && 
            arrow.x + arrow.width > goblin.x && 
            arrow.y < goblin.y + goblin.height &&
            arrow.height + arrow.y > goblin. y) {
                return true;
        } else {
            return false;
        }
    }

    goblinDie(goblin) {
        // temporarily hide goblin
        goblin.alpha = 0;
        // create explosion sprite at goblin's position
        let boom = this.add.sprite(goblin.x, goblin.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            goblin.reset();                     // reset goblin position
            goblin.alpha = 1;                   // make goblin visible again
            boom.destroy();                     // remove animation sprite
        });
        // score add and repaint
        this.p1Score += goblin.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}