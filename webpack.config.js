const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = (env, options) => {
  const config = {
    target: "node",
    entry: "./src/index.js",
    output: {
      path: path.join(__dirname, "dist"),
      filename: "upload-to-s3-webpack-plugin.js",
      libraryTarget: "commonjs2"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "babel-loader",
          exclude: /node_modules/
        }
      ]
    },
    plugins: [new CleanWebpackPlugin()],
    resolve: {
      extensions: [".js", ".json"]
    }
  };

  return config;
};
