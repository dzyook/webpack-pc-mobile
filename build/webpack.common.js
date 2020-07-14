const path = require("path");
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const dev = require("./webpack.dev");
const prod = require("./webpack.prod");
const config = process.env.NODE_ENV === "production" ? prod : dev;
const name = process.env.NODE_NAME;

module.exports = merge(
	{
		entry: {
			app: name === "PC" ? "./src/pc/main.js" : "./src/mobile/main.js",
        },
        mode: process.env.NODE_ENV,
		stats: {
			assets: true, // 添加资源信息
			timings: true, // 添加时间信息,
			modules: false, // 添加构建模块信息
			chunks: false, // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出
			entrypoints: true, // 通过对应的 bundle 显示入口起点
			children: false,
		},
		module: {
			rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.vue$/,
                    use: "vue-loader"
                },
				{
					test: /\.(png|jpg|gif)$/i,
					use: [
						{
							loader: "url-loader",
							options: {
								limit: 8192,
							},
						},
					],
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        "css-loader",
                        {
                            loader: 'postcss-loader',
                            options:{
                              // ident: 'postcss',
                              plugins: (loader) =>  [
                                require('postcss-import')({ root: loader.resourcePath }),
                                require('postcss-cssnext')()
                                //require('cssnano')()
                              ]
                            }
                        }
                    ],
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/,
                    use: {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            name: "imgs/[name].[hash:8].[ext]",
                            esModule: false,
                        },
                    },
                },
			],
		},
		plugins: [
            new CleanWebpackPlugin(),
            new VueLoaderPlugin(),
			new HtmlWebpackPlugin({
				template: "public/index.html",
				inject: true,
				minify: {
					// 压缩HTML文件
					removeComments: true, // 移除HTML中的注释
					collapseWhitespace: true, // 删除空白符与换行符
					minifyCSS: true, // 压缩内联css
                },
                hash: true
			}),
		],
		output: {
			filename: "[name]-[chunkhash].js",
			path: path.resolve(__dirname, "..", "dist"),
		},
	},
	config
);
