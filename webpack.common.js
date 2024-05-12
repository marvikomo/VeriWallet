const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')

module.exports = {
    entry: {
        popup: path.resolve('src/popup/index.tsx'),
        options: path.resolve('src/options/index.tsx'),
        background: path.resolve('src/background/background.ts'),
        contentScript: path.resolve('src/contentScript/contentScript.ts'),
        injected: path.resolve('src/injected/injected.ts'),
        onboard: path.resolve('src/onboard/index.tsx'),
        newTab: path.resolve('src/tabs/index.tsx'),
        controller: path.resolve('src/controllers/index.ts'),
        transaction: path.resolve('src/transactions/index.tsx'),
        connect: path.resolve('src/connect/index.tsx')
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                test: /\.tsx?$/,
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: 'postcss-loader', // postcss loader needed for tailwindcss
                        options: {
                            postcssOptions: {
                                ident: 'postcss',
                                plugins: [tailwindcss, autoprefixer],
                            },
                        },
                    },
                ],
            },
            {
                type: 'assets/resource',
                test: /\.(png|jpg|jpeg|gif|woff|woff2|tff|eot|svg)$/,
            },
        ]
    },
    "plugins": [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
            _: 'lodash'
          }),
        new CopyPlugin({
            patterns: [{
                from: path.resolve('src/static'),
                to: path.resolve('dist')
            }]
        }),
        new CopyPlugin({
            patterns: [
              { from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js', to: 'browser-polyfill.min.js' }
            ]
          }),
        ...getHtmlPlugins([
            'popup',
            'options',
            'newTab',
            'onboard',
            'transaction',
            'connect'
        ])
    ],
    resolve: {
        extensions: ['.tsx', '.js', '.ts', '.json', '.jsx', '.mjs' ],
        fallback: { 
            "stream": require.resolve("stream-browserify"),
            "crypto": require.resolve("crypto-browserify") ,
            "url": false ,
            "zlib": require.resolve("browserify-zlib"),
            "https": require.resolve("https-browserify"),
            "http": require.resolve("stream-http"),
            "vm": require.resolve("vm-browserify") ,
            "process": require.resolve("process/browser"),
            "events": require.resolve("events/")
        },
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        }
    }
}

function getHtmlPlugins(chunks) {
    return chunks.map(chunk => new HtmlPlugin({
        title: 'React Extension',
        filename: `${chunk}.html`,
        chunks: [chunk]
    }))
}