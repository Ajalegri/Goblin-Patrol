class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('arrow', './assets/arrow.png');
        this.load.image('goblin1', './assets/goblin1.png');
        this.load.image('goblin2', './assets/goblin2.png');
        this.load.image('field', './assets/field.png');
        this.load.image('trees', './assets/trees.png');
        // load spritesheets
        this.load.spritesheet('die', './assets/die.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 10});
        this.load.spritesheet('die2', './assets/die2.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 10});
    } 

    create() {
        this.sound.play('music');
        // place tile sprite
        this.field = this.add.tileSprite(
            0, 
            0, 
            640, 
            480, 
            'field'
        ).setOrigin(0, 0);
        
        // add arrow (p1)
        this.p1Arrow = new Arrow(
            this, 
            game.config.width/2, 
            game.config.height - borderUISize - borderPadding, 
            'arrow'
        ).setOrigin(0.5, 0);

        // add goblins (x4)
        this.goblin01 = new Goblin(
            this, 
            0 - borderUISize*9, 
            borderUISize*4, 
            'goblin2', 
            0, 
            60,
            game.settings.goblinSpeed+1
        ).setOrigin(0, 0);
        this.goblin02 = new Goblin(
            this, 
            game.config.width + borderUISize*6, 
            borderUISize*5 + borderPadding*2, 
            'goblin1', 
            0, 
            30,
            game.settings.goblinSpeed-0.5
        ).setOrigin(0, 0);
        this.goblin03 = new Goblin(
            this, 
            game.config.width + borderUISize*3, 
            borderUISize*6 + borderPadding*4, 
            'goblin1', 
            0, 
            20,
            game.settings.goblinSpeed
        ).setOrigin(0,0);
        this.goblin04 = new Goblin(
            this, 
            game.config.width, 
            borderUISize*7 + borderPadding*6, 
            'goblin1', 
            0, 
            10,
            game.settings.goblinSpeed+0.5
        ).setOrigin(0,0);

        // UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0xEED388).setOrigin(0, 0);

        // tree borders
        this.trees1 = this.add.tileSprite(
            0,
            0, 
            640, 
            480, 
            'trees'
        ).setOrigin(0, 0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    
        // animation config
        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers('die', { start: 0, end: 10, first: 0}),
            frameRate: 30
        });
        this.anims.create({
            key: 'death2',
            frames: this.anims.generateFrameNumbers('die2', { start: 0, end: 10, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Georgia',
            fontSize: '28px',
            backgroundColor: '#EED388',
            color: '#000000',
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
            this.sound.stopAll();
        }, null, this);
        this.timeLeft = this.add.text(game.config.width/2, borderUISize + borderPadding*2, 0, scoreConfig);
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
            this.goblin01.update();     // update goblins (x4)
            this.goblin02.update();
            this.goblin03.update();
            this.goblin04.update();
            this.timeLeft.text = Math.floor((game.settings.gameTimer - (this.clock.getElapsed()))/1000);
            // 30 second speed increase
            if(this.clock.getElapsed()/1000 >= 30) {
                this.goblin01.moveSpeed = (this.goblin01.spd+game.settings.speedMod)*this.goblin01.dir;
                this.goblin02.moveSpeed = (this.goblin02.spd+game.settings.speedMod)*this.goblin02.dir;
                this.goblin03.moveSpeed = (this.goblin03.spd+game.settings.speedMod)*this.goblin03.dir;
                this.goblin04.moveSpeed = (this.goblin04.spd+game.settings.speedMod)*this.goblin04.dir;
            }
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
        // there are two explosion animations for the 2 goblin types; gonna separate them by point value
        if(goblin.points == 60){
            let boom = this.add.sprite(goblin.x, goblin.y, 'die2').setOrigin(0, 0);
            boom.anims.play('death2');               // play death animation
            boom.on('animationcomplete', () => {    // callback after anim completes
                goblin.reset();                     // reset goblin position
                goblin.alpha = 1;                   // make goblin visible again
                boom.destroy();                     // remove animation sprite
            });
        } else {
            let boom = this.add.sprite(goblin.x, goblin.y, 'die').setOrigin(0, 0);
            boom.anims.play('death');               // play death animation
            boom.on('animationcomplete', () => {    // callback after anim completes
                goblin.reset();                     // reset goblin position
                goblin.alpha = 1;                   // make goblin visible again
                boom.destroy();                     // remove animation sprite
            });
        }
        // score add and repaint
        this.p1Score += goblin.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_die');
    }
}