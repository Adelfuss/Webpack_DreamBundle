const path = require('path');
const webpack = require('webpack');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    watch: false,
    // resolve: {
    //     extention: ['.js']
    // },
    mode: 'development',
    devtool: 'eval-source-map',
    context: path.resolve(__dirname,'src'),
    entry: {
        polyfill: 'babel-polyfill',
        app: './js/index.js'
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'js/[name].js'
    },
    devServer: {
       publicPath: '/',
       contentBase: path.resolve(__dirname,'dist'),
       port:8000,
       host:'localhost',
       historyApiFallback: true,
       noInfo: false,
       stats: 'minimal',
       hot: true,
       compress: true,
       open: true
    },
    module : {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              },
            {
                test :/\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.css$/i,
                use: [
                    {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                        publicPath: (resourcePath, context) => {
                            return path.relative(path.dirname(resourcePath), context) + '/';
                          }
                      }
                    },
                    {
                      loader: 'css-loader',
          
                      options: {
                        importLoaders: 1,
                        sourceMap: true,
                      },
                    },
                    {
                      loader: 'postcss-loader',
                      options: {
                        plugins: () => [precss, autoprefixer],
                      },
                    },
                  ],
            },
            {
                test: /\.scss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                          publicPath: (resourcePath, context) => {
                              return path.relative(path.dirname(resourcePath), context) + '/';
                            }
                        }
                      },
                      {
                        loader: 'css-loader',

                        options: {
                          importLoaders: 1,
                          sourceMap: true,
                        },
                      },
                      {
                        loader: 'sass-loader',
                      },
                ]
            },
            {
                test:/\.(?:|gif|png|jpg|jpeg|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: './img/[name].[ext]',
                          }
                    }
                ]
            },
            {
                test:/\.(?:|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: './fonts/[name].[ext]',
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/styles.css',
        }),
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: 'index.html'
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname,'./src/assets'),
                    to: path.resolve(__dirname,'./dist/assets')
                }
            ]
        }),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify('0.0.1'),
            ISDEV: true
        }),
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            // proxy: 'http://localhost:8000/'
        })
    ]
}