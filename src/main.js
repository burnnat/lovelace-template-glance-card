// import { LitElement, html, css } from 'card-tools/src/lit-element';
// import { subscribeRenderTemplate, hasTemplate } from 'card-tools/src/templates';
// import { bindActionHandler } from 'card-tools/src/action';

class TemplateGlanceCard extends HTMLElement {
	set hass(hass) {
		if (!this.content) {
			const content = this.content = document.createElement('hui-glance-card');
			
			if (this.config) {
				content.setConfig(this.config);
			}

			this.appendChild(content);
		}

		this.content.hass = hass;
	}

	setConfig(config) {
		this.config = config;

		if (this.content) {
			this.content.setConfig(config);
		}
	}

	getCardSize() {
		if ('getCardSize' in this.content) {
			return this.content.getCardSize();
		}
		else {
			return 1;
		}
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
