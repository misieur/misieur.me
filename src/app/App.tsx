import type {RouterOnChangeArgs} from 'preact-router'
import {Router} from 'preact-router'
import '../styles/global.css'
import '../styles/nodes.css'
import {Analytics} from './Analytics.js'
import {Header} from './components/index.js'
import {
    Changelog,
    Convert,
    Customized,
    Generator,
    Generators,
    Guide,
    Guides,
    Home,
    LegacyPartners,
    Sounds,
    Transformation,
    EmbedPage,
    Worldgen
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
			<Worldgen path="/worldgen" />
			<LegacyPartners path="/partners/:id" />
			<Sounds path="/sounds" />
			<Changelog path="/changelog" />
			<Transformation path="/transformation" />
			<Customized path="/customized" />
			<Convert path="/convert" />
			<Convert path="/convert/:formats" />
			<Guides path="/guides" />
			<Guide path="/guides/:id" />
			<EmbedPage path="/embed" />
			<Generator default />
		</Router>
	</>
}
