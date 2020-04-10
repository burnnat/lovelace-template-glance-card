import * as pack from '../package.json';

// import { LitElement, html, css } from 'card-tools/src/lit-element';
import { subscribeRenderTemplate, hasTemplate } from 'card-tools/src/templates';
// import { bindActionHandler } from 'card-tools/src/action';

interface TemplateConfig {
	entities: TemplateEntry[];
}

interface TemplateEntry {
	type?: string;
	name?: string;
	icon?: string;
	state?: string;
}

interface CustomElement extends HTMLElement {
	hass: any;
	setConfig(config: object): void;
	getCardSize(): number;
}

type Hass = any;

class TemplateGlanceCard extends HTMLElement {

	private hassRaw: Hass;
	private content: CustomElement;
	private config: object;
	private customEntities: {
		[id: string]: TemplateEntry;
	};

	set hass(hass: Hass) {
		this.hassRaw = hass;

		if (!this.content) {
			const content = this.content = document.createElement('hui-glance-card') as CustomElement;
			
			if (this.config) {
				content.setConfig(this.config);
			}

			this.appendChild(content);
		}

		this.update();
	}

	private update() {
		const states = { ...this.hassRaw.states };
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

		this.content.hass = { ...this.hassRaw, states };
	}

	setConfig(config: TemplateConfig) {
		this.customEntities = {};

		this.config = {
			...config,
			entities: config.entities.map((entry, index) => {
				if (entry.type === 'template') {
					const id = 'template_glance_card.' + index;
					this.initTemplateEntity(id, entry);
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

	private initTemplateEntity(id: string, entry: TemplateEntry) {
		this.customEntities[id] = entry;

		// subscribeRenderTemplate(
		// 	null,
		// 	(res) => {
		// 		this.state[k] = res;
		// 		this.update();
		// 	},
		// 	{
		// 		template: this._config[k],
		// 		variables: {config: this._config},
		// 		entity_ids,
		// 	}
		// );
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

	console.info(
		`%cTEMPLATE-GLANCE-CARD ${pack.version} IS INSTALLED`,
		'color: green; font-weight: bold',
		''
	);
}
