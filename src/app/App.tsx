import type {RouterOnChangeArgs} from 'preact-router'
import {Router} from 'preact-router'
import '../styles/global.css'
import '../styles/nodes.css'
import {Analytics} from './Analytics.js'
import {Header} from './components/index.js'
import {
	Generator,
	Generators,
	Home,
	Transformation,
	EmbedPage,
	AudioConverter,
	ItemTooltipGenerator,
} from './pages/index.js'
import {cleanUrl} from './Utils.js'

export function App() {
	const changeRoute = (e: RouterOnChangeArgs) => {
		window.dispatchEvent(new CustomEvent('replacestate'))
		// Needs a timeout to ensure the title is set correctly
		setTimeout(() => Analytics.pageview(cleanUrl(e.url)))
	}

	return <>
		<Header />
		<Router onChange={changeRoute}>
			<Home path="/" />
			<Generators path="/generators" />
			<Transformation path="/transformation" />
			<EmbedPage path="/embed" />
			<AudioConverter path="/audio-converter" />
			<ItemTooltipGenerator path="/item-tooltip-generator" />
			<Generator default />
		</Router>
	</>
}
