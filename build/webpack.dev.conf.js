const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');

const devConfig = {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } },
                    {
                        loader: 'style-resources-loader',
                        options: {
                            patterns: [path.resolve(__dirname, '../src/assets/style/global.scss')],
                        },
                    },
                ],
            },
        ],
    },
    // 开启模块热更新
    plugins: [new webpack.HotModuleReplacementPlugin()],
    // 配置 devserver
    devServer: {
        contentBase: './', // devServer 的启动目录，必须要以 / 结尾，因为需要是一个目录，一般不需要开启
        // publicPath: '../public/', // 告诉当前启动的 devServer 你的静态资源路径是什么，主要是为了在我们设置了 output.publicPath 的时候能够在开发环境正常访问静态资源
        host: '127.0.0.1',
        port: '8082',
        hot: true,
        open: true,
        stats: 'errors-only',
    },
    // 开启 source-map
    devtool: 'source-map',
};

module.exports = merge(baseConfig, devConfig);
