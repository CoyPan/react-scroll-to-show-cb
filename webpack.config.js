const webpack = require('webpack');
const path = require('path');

const IS_DEV = process.env.NODE_ENV === 'dev';
const entryPath = path.join(__dirname, 'test/index.js');
const outputPath = path.join(__dirname, 'test');

const devConfig = {
    entry: {
        app: entryPath
    },
    output: {
        path: outputPath,
        filename: 'react-scroll-to-show-cb.js',
        publicPath: '/'
    },
    module: {
        rules: [{
            exclude: /node_modules/,
            test: /\.js$/,
            loader: 'babel-loader'
        }]
    },
    devServer: {
        inline: true,
        contentBase: path.join(__dirname, "test")
    }
}

module.exports = devConfig;