import federation from "@originjs/vite-plugin-federation";

export default {
    base: "http://localhost:6003/",
    build: {
        target: "esnext",
    },
    plugins: [
        federation({
            name: "decide",
            filename: "remoteEntry.js",
            exposes: {
                "./ProductPage": "./src/ProductPage.jsx",
            },
            remotes: {},
            shared: ["react"],
        }),
    ],
};
