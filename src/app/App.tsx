import {Router} from 'preact-router'
import '../styles/global.css'
import '../styles/nodes.css'
import {Header} from './components/index.js'
import {
	AudioConverter,
	EmbedPage,
	Generator,
	Generators,
	Home,
	ItemTooltipGenerator,
	Transformation,
} from './pages/index.js'

export function App() {
	const changeRoute = () => {
		window.dispatchEvent(new CustomEvent('replacestate'))
	}

	return <>
		<Header/>
		<Router onChange={changeRoute}>
			<Home path="/"/>
			<Generators path="/generators"/>
			<Transformation path="/transformation"/>
			<EmbedPage path="/embed"/>
			<AudioConverter path="/audio-converter"/>
			<ItemTooltipGenerator path="/item-tooltip-generator"/>
			<Generator default/>
		</Router>
	</>
}
