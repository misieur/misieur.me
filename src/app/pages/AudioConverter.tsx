import { Footer } from '../components/index.js'

interface Props {
	path?: string;
}

export function AudioConverter({}: Props) {

	return (
		<main>
			<div class="legacy-container audio-converter-box">
				<h1 class="main-title">Offline Audio Converter</h1>
				<p class="main-subtitle">It is broken lol I'm working on it but I have no idea how to fix this tbh</p>
				<Footer />
			</div>
		</main>
	)
}
