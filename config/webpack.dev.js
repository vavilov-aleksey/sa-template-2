'use strict';

const packageJSON           = require('../package.json');
const common                = require('./webpack.common.js');
const webpack               = require('webpack');
const merge                 = require('webpack-merge');
const path                  = require('path');
const autoprefixer          = require('autoprefixer');
const root                  = path.resolve(__dirname, '..');
const dirs                  = packageJSON.config.directories;
const browserList           = packageJSON.config.browsers;

module.exports = merge(common, {
  mode: 'development',
  output: {
    path: path.resolve(root, dirs.development)
  },
  module: {
    rules: [{
      test: /\.pug$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: `${dirs.files.html}[name].html`
        }
      },
      'extract-loader',
      {
        loader: 'html-loader',
        options: {
          interpolate: 'require'
        }
      }, {
        loader: 'pug-html-loader',
        options: {
          pretty: true,
          data: {
            base: '/'
          }
        }
      }]
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: loader => [
              autoprefixer({ browsers: browserList })
            ]
          }
        },
        {
          loader: 'sass-loader',
          options: {
            outputStyle: 'expanded'
          }
        }
      ]
    }, {
      test: /content\\.*\.(jpg|png|gif|webp|svg)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: `${dirs.files.images}[name].[ext]`
        }
      }]
    }, {
      test: /svg\\.*\.svg$/,
      use: [{
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: `${dirs.files.sprite}sprite.svg`
        }
      }]
    }]
  },
  devServer: {
    contentBase: path.resolve(root, dirs.development),
    compress: true,
    hot: true,
    quiet: false,
    inline: true,
    lazy: false,
    stats: 'minimal',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});