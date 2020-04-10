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

		const states = { ...hass.states };
		const timestamp = new Date().toISOString();

		Object.keys(this.customEntities).map((key) => {
			const template = this.customEntities[key];

			states[key] = {
				entity_id: key,
				last_changed: timestamp,
				last_updated: timestamp,

				attributes: {
					friendly_name: template.name,
					icon: template.icon
				},
				state: template.state
			};
		});

		this.content.hass = { ...hass, states };
	}

	setConfig(config) {
		this.customEntities = {};

		this.config = {
			...config,
			entities: config.entities.map((entry, index) => {
				if (entry.type === 'template') {
					const id = 'template_glance_card.' + index;
					this.customEntities[id] = entry;
					return { entity: id };
				}
				else {
					return entry;
				}
			})
		};

		if (this.content) {
			this.content.setConfig(this.config);
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
