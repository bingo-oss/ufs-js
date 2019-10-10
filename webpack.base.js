const path = require("path");
const WebpackCleanPlugin = require("webpack-cleanup-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");
const dev = require("./webpack.dev");
const prod = require("./webpack.prod");

module.exports = env => {
  const isDev = env.development;

  // 判断类型打包不同结果
  const config = {};
  config.entry = {
    ufs: "./src/ufs.js",
    index: "./test/index.js"
  };
  config.output = {
    path: path.resolve(__dirname, "./dist"),
    library: "[name]",
    libraryTarget: "umd",
    globalObject: "this" // 把window对象转成this,防止在weex中报错
  };

  const base = {
    entry: config.entry,
    output: config.output,
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "babel-loader",
          exclude: /node_modules/
        },
        {
          test: /\.html$/,
          loader: "html-loader"
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.join(__dirname, "test/index.html")
      }),
      new WebpackCleanPlugin()
    ]
  };

  if (isDev) {
    return merge(base, dev);
  } else {
    return merge(base, prod);
  }
};
