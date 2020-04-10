const path = require('path');

module.exports = {
	entry: './src/main.js',

	// prod options
	// mode: 'production',
	
	// dev options
	mode: 'development',
	devtool: 'source-map',

	output: {
		filename: 'dist/template-glance-card.js',
		path: path.resolve(__dirname)
	}
};
