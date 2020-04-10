declare module 'card-tools/src/templates' {
	export function subscribeRenderTemplate(conn: any, onChange: (result: string) => void, params: any): () => void;
	export function hasTemplate(value: string): boolean;
}