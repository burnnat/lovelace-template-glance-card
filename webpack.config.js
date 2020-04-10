const path = require('path');

module.exports = {
	entry: './src/index.ts',

	// prod options
	// mode: 'production',
	
	// dev options
	mode: 'development',
	devtool: 'inline-source-map',

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			}
		]
	},

	resolve: {
		extensions: ['.ts', '.js', '.json'],
	},

	output: {
		filename: 'template-glance-card.js',
		path: path.resolve(__dirname, 'dist')
	}
};
