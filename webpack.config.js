const path = require('path');

module.exports = {
	entry: './src/main.js',
	mode: 'production',
	output: {
		filename: 'template-glance-card.js',
		path: path.resolve(__dirname)
	}
};
