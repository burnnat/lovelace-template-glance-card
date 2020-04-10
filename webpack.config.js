const path = require('path');

module.exports = {
	entry: './src/main.js',
	// mode: 'production',
	mode: 'development',
	output: {
		filename: 'dist/template-glance-card.js',
		path: path.resolve(__dirname)
	}
};
