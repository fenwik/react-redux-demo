var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var CONFIG = require('config');
var NODE_ENV = process.env.NODE_ENV || 'development';

var config = {
  entry: [
    './src/app/index.js',
    // './src/less/style.js'
  ],
  output: {
    path: './build',
    filename: 'app.js'
  },
  resolve: {
    root: path.resolve('./src/app'),
    extensions: ['', '.js']
  },
  debug: true,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          'css-loader?sourceMap!' +
          'less-loader?sourceMap'
        )
      },
      { test: /\.json$/, loader: 'json' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.(woff|woff2)$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^(buffertools)$/),
    new ExtractTextPlugin('[name].css'),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: NODE_ENV,
        CONFIG: CONFIG
      })
    })
  ]
};

if (NODE_ENV != 'development') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false
    }
  }));

  config.debug = false;
}

if (NODE_ENV == 'staging') {
  config.devtool = '#eval-source-map';
}

if (NODE_ENV == 'development') {
  config.devtool = '#eval-source-map';
}

module.exports = config;
