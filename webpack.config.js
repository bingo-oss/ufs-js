var path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin');
var argv = require("yargs-parser")(process.argv.splice(2));
var mode = argv.mode || "development";
var modeFlag = (mode =="development"?true:false);

module.exports = {
    entry: {
        "ufs": "./src/ufs.js",
        "webtest": "./test/webtest.js"
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ["es2015"]
                }
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: path.join(__dirname, "dist", "web.html"),
            template: path.join(__dirname, "web-tpl.html"),
            hash:true,
            chunks:["webtest"]
        })
    ],
    devtool: modeFlag?'inline-source-map':''
}