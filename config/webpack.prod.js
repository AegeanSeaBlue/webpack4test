const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const dist = path.join(__dirname, '../dist');
const {ANA} = process.env;

let getPlugins = () => {
  let plugins = [
    new CleanWebpackPlugin(),
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../public/index.html')
    })
  ];
  if (ANA) {
    plugins.push(new BundleAnalyzerPlugin());
  }
  return plugins;
};

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js'
  },
  output: {
    path: dist,
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: getPlugins()
};
