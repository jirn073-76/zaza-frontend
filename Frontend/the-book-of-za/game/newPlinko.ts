import Phaser from 'phaser'
import background from '~/assets/BG.png'
import ball from '~/assets/pangball.png'

class MainScene extends Phaser.Scene {

    constructor() {
        super('main');
        this.handleCollision = this.handleCollision.bind(this);
    }

    preload() {
        this.load.image('ball', ball);
        this.load.image('background', background);
    }
    // update(time: number, delta: number): void {

    //     if (this.ball.body.speed == 0) {
    //         Phaser.Physics.Matter.Matter.Body.setSpeed(this.ball.body, 0.2);
    //         console.log("Set angularvel");
    //         console.log("Set angularvel");
    //     }

    // }
    create() {
        var pauseKey: Phaser.Input.Keyboard.Key;
        var resumeKey: Phaser.Input.Keyboard.Key;
        var isPaused = false;
        var scalingFactor = 1;
        var verticalSpacingBetweenBalls = 32;
        var horizontalSpacingBetweenBalls = 32;
        var centerOfFrame = 400 - (16 * scalingFactor); //Calculated by taking the radius 
        this.add.image(0, 0, 'background').setOrigin(0);
        this.matter.world.setBounds(0, 0, 810, 600, 32, true, true, false, true);

        for (var i = 1; i < 17; i++) {
            var ballsThisLayer = i;
            var spacing = centerOfFrame;
            if (ballsThisLayer !== 1) {
                spacing -= 22 * i;
                const Matter = Phaser.Physics.Matter;
                this.stack = this.matter.add.stack(spacing, 30 * i + verticalSpacingBetweenBalls, ballsThisLayer, 1, 32, 0, (x, y) => {
                    return Matter.Matter.Bodies.circle(x, y, 32 / 4, { isStatic: true });
                });
                var topElement = this.stack.bodies[this.stack.bodies.length - 1];
                this.balls_images = this.stack.bodies.map(body => {
                    return this.add.image(body.position.x, body.position.y, 'ball').setScale(0.4);
                });
            }
        }

        var randomX = Phaser.Math.Between(340, 350);
        this.ball = this.matter.add.image(randomX, -20, 'ball').setScale(0.5);
        this.ball.setCircle(8);

        //###################Lines At Bottom#######################
        const lineDistance = 48; // Distance between lines
        const lineColor = 0xCCCCCC; // Color of the lines
        const lineColor2 = 0x00CC0A; // Color of the lines
        const lineWidth = 2; // Width of the lines
        const triggerCategory = 0x0002; // Category of the trigger bodies

        // Add the lines as static Matter bodies
        this.add.text(lineDistance - 36, this.game.config.height - 30, "5x", { fontSize: '14px', fontFamily: 'Roboto', color: '#ff0000' })
        const colliderWidth = lineDistance - lineWidth;
        const colliderHeight = 50;

        var winnings = [
            { text: "2.5x", color: "#ff0000" },
            { text: "2.0x", color: "#ff5100" },
            { text: "1.5x", color: "#ffd000" },
            { text: "1.2x", color: "#f2e8bb" },
            { text: "1.0x", color: "#ffffff" },
            { text: "1.0x", color: "#ffffff" },
            { text: "0.5x", color: "#a8a0a0" },
            { text: "0.2x", color: "#3b3939" },
            { text: "0.5x", color: "#a8a0a0" },
            { text: "1.0x", color: "#ffffff" },
            { text: "1.0x", color: "#ffffff" },
            { text: "1.2x", color: "#f2e8bb" },
            { text: "1.5x", color: "#ffd000" },
            { text: "2.0x", color: "#ff5100" },
            { text: "2.5x", color: "#ff0000" },
            { text: "", color: "#ff0000" }
        ];

        for (let i = 0; i < 16; i++) {
            const line = this.matter.add.rectangle(
                i * lineDistance + lineDistance,
                this.game.config.height - 25,
                lineWidth,
                50,
                {
                    isStatic: true,
                    render: {
                        fillColor: lineColor,
                    },
                }
            );
            // COLLIDER FOR SPACE 
            this.add.rectangle(
                i * lineDistance + lineDistance,
                this.game.config.height - 25,
                lineWidth,
                50,
                lineColor
            );
            // var index = i > 8 ? i % 8 : i - (i % 8)
            // if (i >= 8) {
            //     winnings = winnings.reverse()
            // }
            this.add.text(i * lineDistance + lineDistance + 6, this.game.config.height - 30, winnings[i].text, { fontSize: '14px', fontFamily: 'Roboto', color: winnings[i].color })
        }

        for (let i = 0; i < 15; i++) {
            const collider = this.matter.add.rectangle(
                i * lineDistance + lineDistance + 25,
                this.game.config.height - 25,
                colliderWidth - 10,
                colliderHeight,
                {
                    isSensor: true,
                    isStatic: true,
                    render: {
                        visible: true,
                        fillColor: lineColor2
                    },
                    onCollideCallback: this.handleCollision,
                    onCollideContext: this,
                    multiplier: winnings[i].text, // Custom property indicating the multiplier value
                }
            );


        }

        this.add.text(lineDistance * 16 + 12, this.game.config.height - 30, "5x", { fontSize: '14px', fontFamily: 'Roboto', color: '#ff0000' })

        this.textObject = this.add.text(20, 20, "Current Bet = $0", { fontSize: '24px', fontFamily: 'Roboto' })
        this.input.keyboard.on('keydown-SPACE', this.switchToBetScene, this);
        this.scene.pause()
    }

    setCollisionCallback(callback: Function) {
        this.callback = callback;
    }

    handleCollision(event: Phaser.Types.Physics.Matter.MatterCollisionData) {
        const { bodyA, bodyB } = event;
        const collider = bodyA.label === 'Rectangle Collider' ? bodyA : bodyB;
        const multiplier = collider.multiplier;
        this.callback(`You hit the ${multiplier} multiplier`);
        this.earningsText = this.add.text(25, 40, `Your winnings: ${Number(this.money.split("$")[1]) * parseFloat(multiplier)}`, { fontSize: '24px', fontFamily: 'Roboto' })

    }

    switchToBetScene() {
        this.scene.launch('bet');
        this.scene.pause('main');
    }

    restart() {
        this.scene.restart();
    }

    setText(text: string) {
        this.money = text
        this.textObject.setText(text);
    }
}

class BetScene extends Phaser.Scene {
    constructor() {
        super('bet');
    }

    create() {
        // Create the text for the bet scene
        this.add.text(400, 300, 'Please place a bet amount and Pay!', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Roboto'
        }).setOrigin(0.5);

        // Add keyboard input for switching back to the main scene
        this.input.keyboard.on('keydown-SPACE', this.switchToMainScene, this);
        this.input.keyboard.on('keydown-R', this.restartMainScene, this);
        this.scene.bringToTop('bet');
    }

    switchToMainScene() {
        this.scene.stop('bet');
        this.scene.resume('main');
    }

    restartMainScene() {
        this.scene.get('main').restart();
    }
}

export { MainScene, BetScene };
