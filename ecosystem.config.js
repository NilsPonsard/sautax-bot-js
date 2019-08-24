module.exports = {
    apps: [{
        name: "discord-bot",
        script: "./js/server.js",
        watch: true,
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
}