import { LitElement, html, css } from 'card-tools/src/lit-element';
import { subscribeRenderTemplate, hasTemplate } from 'card-tools/src/templates';
import { bindActionHandler } from 'card-tools/src/action';

class TemplateGlanceCard extends LitElement {
	setConfig(config) {
		this.config = config;
	}

	render() {
		return html``;
	}
}

if (!customElements.get('template-glance-card')) {
	customElements.define('template-glance-card', TemplateGlanceCard);

	const pjson = require('../package.json');
	console.info(
		`%cTEMPLATE-GLANCE-CARD ${pjson.version} IS INSTALLED`,
		'color: green; font-weight: bold',
		''
	);
}
