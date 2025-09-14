import preact from '@preact/preset-vite'
import html from '@rollup/plugin-html'
import {env} from 'process'
import {visualizer} from 'rollup-plugin-visualizer'
import {defineConfig} from 'vite'

const config = require('./src/config.json')
const English = require('./src/locales/en.json')

export default defineConfig({
	base: '/',
	server: {
		port: 3000,
	},
	resolve: {
		alias: [
			{ find: 'react', replacement: 'preact/compat' },
			{ find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
			{ find: 'react-dom', replacement: 'preact/compat' },
			{ find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
		],
	},
	optimizeDeps: {
		esbuildOptions: {
			target: 'es2021',
		},
	},
	build: {
		sourcemap: true,
		target: 'es2021',
		rollupOptions: {
			plugins: [
				html({
					fileName: '404.html',
					title: '404',
					template,
				}),
				...['generators', 'transformation', 'audio-converter', 'embed', 'item-tooltip-generator'].map(id => html({
					fileName: `${id}/index.html`,
					title: `${English[`title.${id}`] ?? ''}`,
					template,
				})),
				...config.generators.map(m => html({
					fileName: `${m.url}/index.html`,
					title: `${English[m.id] ?? ''} Generator${m.category === true ? 's' : ''}`,
					template,
				})),
			],
		},
	},
	json: {
		stringify: true,
	},
	define: {
		__LATEST_VERSION__: env.latest_version,
	},
	plugins: [
		preact(),
		visualizer({ open: true }),
	],
})

function template({ files, title }) {
	const source = files.html.find(f => f.fileName === 'index.html').source
	return source.replace(/<title>.*<\/title>/, `<title>${title}</title>`)
}
