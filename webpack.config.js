var path = require('path')

module.exports = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  entry: {
    bundle: './index.js'
  },
  output: {
    path: path.join(__dirname, './'),
    filename: '[name].js'
  },
  devtool: '#inline-source-map'
}
