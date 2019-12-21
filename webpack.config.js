const path = require('path');

module.exports = {
	//entry: ['@babel/polyfill', './src/index.js'],
	entry: './src/index.js',
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.scss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: ['babel-loader'],
			},
		],
	},
	resolve: { extensions: ["*", ".js", ".jsx"] },
	devServer: {
		contentBase: path.join(__dirname, 'public/'),
		watchContentBase: true,
		historyApiFallback: true,
	},
	output: {
		ecmaVersion: 2015,
		filename: 'main.js',
		chunkFilename: '[name].[contenthash].js',
		path: path.join(__dirname, 'public/'),
	}
};
