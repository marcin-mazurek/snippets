const webpack = require('webpack');
const { resolve } = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const isProduction = process.argv.indexOf('--production') !== -1;

const commonPlugins = [
  // cleans up the dist/ folder before build to remove outdated files
  new CleanWebpackPlugin(['dist']),
  new webpack.EnvironmentPlugin([/* // [ACTION REQUIRED] insert your required env vars here */]),
  // optimizes build speed
  new HardSourceWebpackPlugin()
];

const productionPlugins = [
  // produces report with bundle sizes
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: '../reports/webpack-bundle-analyser.html',
    openAnalyzer: false,
  }),
];

const developmentPlugins = [
  // provides nice clean build report
  new SimpleProgressWebpackPlugin({ format: 'compact' }),
];

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    'index': './src/index.js',
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name]-chunk.js',
  },
  devtool: 'source-map',
  plugins: commonPlugins.concat(isProduction ? productionPlugins : developmentPlugins),
  module: {
    rules: [
      // [ACTION REQUIRED] remove that if you don't use TypeScript
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
      // [ACTION REQUIRED] remove that if you don't use pure JavaScript
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      // [ACTION REQUIRED] remove / replace with the loader of your choice if you don't use SASS
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader', // adds <style> tag in runtime
          {
            // translates CSS into content consumable by Webpack
            loader: 'css-loader',
          },
          {
            // does magic on CSS, eg. adds vendor prefixes
            loader: 'postcss-loader',
            options: {
              config: {
                path: 'postcss.config.js',
              },
            },
          },
          'sass-loader', // compiles SASS to CSS using node-sass
        ],
      },
    ],
  },
  // [ACTION REQUIRED] remove if you don't use TypeScript
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  // reduces CLI output in dev mode, keeps original reporting mode for easier debugging in build pipeline
  stats: isProduction ? 'normal' : 'minimal',
  devServer: {
    contentBase: ['./development', './dist'],
    disableHostCheck: true,
    // enable gzip for optimized build
    compress: isProduction,
    port: 8000,
    publicPath: `/`,
    host: '127.0.0.1',
    overlay: true,
    stats: 'minimal',
    // [ACTION REQUIRED] configure the proxy yourself or remove if you don't need it
    proxy: {
      '/api/**': {
        target: process.env.API_BASE_URL,
        secure: false,
        changeOrigin: true,
      },
    },
  },
};
