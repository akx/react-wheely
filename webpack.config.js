const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      },
      {
        test: /\.(png|gif|jpg|svg)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 50000
          }
        }
      }
    ]
  },
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "",
    filename: "react-wheely.js",
    libraryTarget: "umd"
  },
  optimization: {
    minimize: false
  }
};
