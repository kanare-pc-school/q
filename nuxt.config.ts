export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: 'q',
        htmlAttrs: {
            lang: 'ja',
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '~/assets/css/main.css',
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        "~/plugins/vuelidate.ts"
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/typescript
        '@nuxt/typescript-build',
        '@nuxt/postcss8',
        '@nuxtjs/fontawesome',
    ],
    fontawesome: {
        icons: {
            solid: ['faComputer', 'faTape', 'faBarsStaggered', 'faSquareCheck', 'faChalkboardUser', 'faTrash', 'faEye', 'faEyeSlash', 'faArrowRightFromBracket'],
            regular: ['faStar'],
        }
    },

    serverMiddleware: [
        { path: '/api/', handler: '~/api/index.ts' },
    ],

    proxy: {
        '/api': process.env.API_URL || 'http://localhost:8081',
    },

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [],

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        postcss: {
            plugins: {
                tailwindcss: {},
                autoprefixer: {},
            },
        },
    },

    srcDir: 'src/',

    server: {
        port: process.env.BASE_PORT || 8080,
        host: '0.0.0.0',
    },

    publicRuntimeConfig: {
        baseURL: process.env.BASE_URL || 'http://localhost:8080',
        apiURL: process.env.API_URL || 'http://localhost:8081',
        avatarURL: process.env.AVATAR_URL || 'https://avatars.dicebear.com/api/adventurer/',
    },
    privateRuntimeConfig: {
        secret: process.env.SECRET_KEY,
    }
}