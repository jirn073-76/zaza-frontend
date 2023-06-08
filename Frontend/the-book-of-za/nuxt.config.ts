export default defineNuxtConfig({
    ssr: false,
    app: {
        head: {
            title: 'Za',
        },
    },
    css: ['~/assets/css/main.css'],
    plugins: [{ src: 'node_modules/nuxtjs-phaser', mode: 'client' }],
    modules: ["@bg-dev/nuxt-naiveui"],
    naiveui: {
        colorModePreference: "dark",

    },
})
