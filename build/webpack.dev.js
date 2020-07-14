
module.exports = {
	devtool: "inline-source-map",
	devServer: {
        contentBase: "./dist",
        progress: true,
        port: 3000,
        compress: true
	},
};
