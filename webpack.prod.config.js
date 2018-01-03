const path = require("path");
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './main.jsx',
    vendors:['react','react-dom']
  },
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'javascripts/[name].[chunkhash].js?',
    chunkFilename: 'javascripts/[name].[chunkhash].js?'
  },
  resolve: {
    modules: [ 'node_modules' ],
    extensions: ['.js', '.jsx','.scss','.css']
  },
  devtool: 'false',
  module: {
    rules: [
      {
        test: /\.jsx|js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader?cacheDirectory=true',
          options: {
            presets: ['env']
          }          
        }
      },
      { test: /\.css$/, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }) },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader', 
              options: {
                sourceMap: true, 
                minimize: true, 
                modules: true,
                localIdentName: '[local]'
              }
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: true, config: { path: 'postcss.config.js' } }
            },
            {
              loader: 'sass-loader', options: { sourceMap: true }
            }]
        })
      },
      {
        test: /\.png|jpg|gif|jpeg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'images/[name].[hash:7].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader',
        options: {
            name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    }),  
    new UglifyJSPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendors','manifest'],
      minChunks: 2
    }),
    new ExtractTextPlugin({ filename: 'stylesheets/[name].[contenthash:5].css', allChunks: true }),
  ]
};