import { BootScene } from './scene'
import { MainScene, BetScene } from './newPlinko'

export const createGame = (config: Phaser.Types.Core.GameConfig = {}) => {
    var game = new Phaser.Game({
        parent: 'phaser',
        type: Phaser.AUTO,
        width: 810,
        height: 600,
        backgroundColor: '#bdae58',
        physics: {
            default: 'matter',
            matter: {
                enableSleeping: true,
                debug: false
            },
        },
        render: {
            pixelArt: false,
            antialiasGL: true,
            antialias: true
        },
        ...config,
    })
    game.scene.add('bet', BetScene)
    game.scene.add('main', MainScene)
    game.scene.start('bet');
    game.scene.start('main');
    return game
}
