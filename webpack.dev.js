var path = require("path");

module.exports = {
  mode: "development",
  devServer: {
    port: 3000,
    contentBase: path.resolve(__dirname, "dist/web"),
    disableHostCheck: true,
    open: true
  }
};
