import * as pack from '../package.json';

// import { LitElement, html, css } from 'card-tools/src/lit-element';
import { subscribeRenderTemplate, hasTemplate, Template, Value } from 'card-tools/src/templates';
// import { bindActionHandler } from 'card-tools/src/action';

interface Hass {
	states: {
		[entityId: string]: {
			entity_id: string;
			last_changed: string;
			last_updated: string;
		
			attributes: {
				friendly_name: string;
				icon: string;
			};
		
			state: string;
		}
	};
}

type Config = any;

interface TemplateConfig {
	entities: (EntityConfig | EntityTemplate)[];
}

interface EntityConfig {
	type: undefined;
}

interface EntityTemplate {
	type: 'template';
	name?: any;
	icon?: any;
	state?: any;
	active?: any;
}

interface EntityValues {
	name?: Value;
	icon?: Value;
	state?: Value;
	active?: Value;
}

type TemplateKey = keyof EntityValues;

const TEMPLATE_KEYS: TemplateKey[] = ['name', 'icon', 'state', 'active'];

interface CustomElement extends HTMLElement {
	hass: Hass;
	setConfig(config: Config): void;
	getCardSize(): number;
}

class TemplateGlanceCard extends HTMLElement {

	private content: CustomElement;
	private _hass: Hass;
	private _config: Config;

	private values: {
		[id: string]: EntityValues;
	};

	set hass(hass: Hass) {
		this._hass = hass;

		if (!this.content) {
			const content = this.content = document.createElement('hui-glance-card') as CustomElement;

			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeName === 'HA-CARD') {
							(node as HTMLElement).shadowRoot.addEventListener('slotchange', (event) => {
								this.updateBadges();
							});
						}
					});
				});
			});
			observer.observe(content.shadowRoot, { childList: true })

			if (this._config) {
				content.setConfig(this._config);
			}
			
			this.appendChild(content);
		}

		this.update();
	}

	private update() {
		const states = { ...this._hass.states };
		const timestamp = new Date().toISOString();
		
		Object.keys(this.values).map((key) => {
			const values = this.values[key];

			const state = states[key] = {
				entity_id: key,
				last_changed: timestamp,
				last_updated: timestamp,

				attributes: {
					friendly_name: values.name,
					icon: values.icon
				},
				state: values.state
			};
		});

		this.content.hass = { ...this._hass, states };
		this.updateBadges();
	}

	private updateBadges() {
		const badges = (
			this.content
				.shadowRoot
				.querySelectorAll('ha-card state-badge')
		);

		badges.forEach((badge: any) => {
			const entity = badge.stateObj.entity_id;
			const values = this.values[entity];

			if (values && values.active) {
				badge.style.color = getComputedStyle(badge).getPropertyValue(
					values.active.toLowerCase() === 'true'
						? '--paper-item-icon-active-color'
						: '--paper-item-icon-color'
				);
			}
		})
	}

	setConfig(config: TemplateConfig) {
		this.values = {};
		
		// Replace template entities with placeholders and set up
		// template rendering function callbacks.
		const entities = config.entities.map((entry, index) => {
			if (entry.type === 'template') {
				const id = 'template_glance_card.' + index;
				this.values[id] = this.initEntityValues(entry);
				return { entity: id, state_color: true };
			}
			else {
				return entry;
			}
		})

		this._config = { ...config, entities };

		if (this.content) {
			this.content.setConfig(this._config);
		}
	}

	private initEntityValues(entry: EntityTemplate): EntityValues {
		const values: EntityValues = {};

		TEMPLATE_KEYS.forEach((key) => {
			const value = entry[key];

			if (hasTemplate(value)) {
				subscribeRenderTemplate(
					null,
					(result) => {
						values[key] = result;
						this.update();
					},
					{ template: value }
				);
			}
			else {
				values[key] = String(value) as Value;
			}
		});

		return values;
	}

	getCardSize() {
		const card = this.content;
		
		if (card && card.getCardSize) {
			return card.getCardSize();
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
