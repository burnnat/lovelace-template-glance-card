declare module 'card-tools/src/templates' {
	type Opaque<T, K> = T & { __opaque__: K };

	export type Value = Opaque<string, 'value'>;
	export type Template = Opaque<string, 'template'>;

	interface TemplateSubscribeParams {
		template?: Template;
	}

	export function subscribeRenderTemplate(conn: any, onChange: (result: Value) => void, params: any): () => void;
	export function hasTemplate(value: Template | Value): value is Template;
}

declare module 'card-tools/src/lit-element' {
	export { LitElement, html, css } from 'lit-element';
}