<template>
    <NaiveConfig :theme-config="themeConfig">
        <div style="display: flex;">
            <div style="flex: 1;">
                <PhaserGame :createGame="createGame" v-if="createGame" />
            </div>
            <div style="margin-top: 200px; margin-right: 40px;">
                <n-message-provider>
                    <Payment :setText="setText" ref="paymentComponent" :winText="winText" />
                </n-message-provider>
                
            </div>
        </div>
    </NaiveConfig>
</template>
  
<script lang="ts">
import { ThemeConfig } from "@bg-dev/nuxt-naiveui";

const themeConfig: ThemeConfig = {
    shared: {}, // Common theme options
    mobileOrTablet: {}, // Theme options applied on mobile and tablet
    mobile: {}, // Theme options applied on mobile only
    light: {}, // Theme options applied on light mode
    dark: {}, // Theme options applied on dark mode
};
import PhaserGame from 'nuxtjs-phaser/phaserGame.vue';

async function getGame() {
    const { createGame } = await import('~/game/game');
    return createGame;
}

declare interface IndexPageData {
    createGame?: () => Phaser.Game;
}

const setPhaserFocus = () => {
    const phaser = document.getElementById('phaser');
    if (phaser) phaser.focus();
};
export default {
    name: 'IndexPage',
    components: { PhaserGame },
    data() {
        return {
            createGame: undefined,
            paymentComponent: null // Reference to the Payment component instance
        };
    },
    methods: {
        setText(text: string) {
            const scene = this.$phaser.game.scene.keys['main'];
            scene.setText(text);
            scene.setCollisionCallback(this.onBallDown);
        },
        winText(text: string) {
            // Implement your logic to display the win text in the Phaser game
            // console.log('Winning text:', text);
        },
        onBallDown(data: string) {
            this.paymentComponent.writeMessage(data)
        }
    },
    async mounted() {
        this.createGame = await getGame();
        this.$nextTick(() => setPhaserFocus());
        this.paymentComponent = this.$refs.paymentComponent;
        // setTimeout(() => {
        //     this.$phaser.game.scene.keys['main'].setCollisionCallback(this.handleCollision);
        //    // console.log("Collision Callback set");

        // }, 5000)
    }
};
</script>
  
<style scoped>
#phaser {
    top: 0;
    left: 0;
}
</style>