class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/select.wav');
        this.load.audio('sfx_die', './assets/die.wav');
        this.load.audio('sfx_shoot', './assets/shoot.wav');
        this.load.audio('music', './assets/music.wav');
        // load images
        this.load.image('field', './assets/field.png');
        this.load.image('trees', './assets/trees.png');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Georgia',
            fontSize: '50px',
            color: '#000000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // place background images/UI
        this.field = this.add.tileSprite(
            0, 
            0, 
            640, 
            480, 
            'field'
        ).setOrigin(0, 0);
        this.add.rectangle(0, borderPadding, game.config.width, borderUISize*3, 0xEED388).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height/2-borderUISize+borderPadding, game.config.width, borderUISize*3, 0xEED388).setOrigin(0, 0);
        this.trees1 = this.add.tileSprite(
            0,
            0, 
            640, 
            480, 
            'trees'
        ).setOrigin(0, 0);

        // show menu text
        this.add.text(game.config.width/2, borderPadding+borderUISize*1.5, 'Goblin Patrol', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = 26;
        this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move & (F) to shoot', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
    
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                goblinSpeed: 3,
                gameTimer: 60000,
                speedTimer: 30000,
                speedMod: 2
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                goblinSpeed: 4,
                gameTimer: 45000,
                speedTimer: 30000,
                speedMod: 2
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');    
        }
    }
}