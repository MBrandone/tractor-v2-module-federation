const {ModuleFederationPlugin} = require("@module-federation/enhanced");

module.exports = {
    output: {
        publicPath: 'http://localhost:3001/',
    },
    devServer: {
        historyApiFallback: true,
        port: 3001,
        headers : {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|j?g|svg|gif)?$/,
                use: 'file-loader'
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'explore',
            filename: 'remoteEntry.js',
            exposes: {
                './HomePage': './src/HomePage/HomePage.jsx',
                './CategoryPage': './src/CategoryPage/CategoryPage.jsx'
            },
            shared: ['react', 'react-dom'],
        }),
    ]
};
