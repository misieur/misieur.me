import { useState } from 'preact/hooks'
import { Footer } from '../components/index.js'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

interface Props {
	path?: string;
}

export function AudioConvertor({}: Props) {
	const [ffmpeg] = useState(() => new FFmpeg())
	const [loading, setLoading] = useState(false)
	const [outputUrl, setOutputUrl] = useState<string | null>(null)
	const [outputFileName, setOutputFileName] = useState('converted.ogg')
	const [channels, setChannels] = useState<'1' | '2'>('1')
	const [bitrate, setBitrate] = useState('128k')
	const [sampleRate, setSampleRate] = useState('44100')

	const handleConvert = async (e: Event) => {
		e.preventDefault()
		const input = document.getElementById('fileInput') as HTMLInputElement
		const file = input?.files?.[0]
		if (!file) return alert('Please choose a file to convert.')

		setLoading(true)
		if (!ffmpeg.loaded) await ffmpeg.load()
		ffmpeg.writeFile(file.name, await fetchFile(file))
		const cmd = [
			'-i', file.name,
			'-ac', channels,
			'-b:a', bitrate,
			'-ar', sampleRate,
			'output.ogg',
		]
		await ffmpeg.exec(cmd)
		const data = await ffmpeg.readFile('output.ogg')
		const blob = new Blob([data.buffer], { type: 'audio/ogg' })
		const url = URL.createObjectURL(blob)
		setOutputUrl(url)
		setOutputFileName(file.name.replace(/\.[^/.]+$/, '.ogg'))
		setLoading(false)
	}

	return (
		<main>
			<div class="legacy-container audio-convertor-box">
				<h1 class="main-title">Offline Audio Convertor</h1>
				<p class="main-subtitle">Convert your audio files to OGG format</p>
				<form onSubmit={handleConvert}>
					<input type="file" id="fileInput" accept="audio/*" class="input-file" />
					<div class="audio-settings">
						<label>
                            Channels
							<select value={channels} onChange={e => setChannels((e.currentTarget.value as '1'|'2'))}>
								<option value="1">Mono</option>
								<option value="2">Stereo</option>
							</select>
						</label>
						{channels === '2' && (
							<p class="warning-message">
                                ⚠️ Stereo audio is not supported by Minecraft. Use mono for compatibility.
							</p>
						)}
						<label>
                            Bitrate
							<input type="text" value={bitrate} onInput={e => setBitrate((e.target as HTMLInputElement).value)} />
						</label>
						<label>
                            Sample Rate
							<input type="text" value={sampleRate} onInput={e => setSampleRate((e.target as HTMLInputElement).value)} />
						</label>
					</div>
					<button type="submit" disabled={loading} class="main-button">
						{loading ? 'Converting...' : 'Convert'}
					</button>
				</form>
				{outputUrl && (
					<p class="download-link">
						<a href={outputUrl} download={outputFileName}>
                            Download converted file
						</a>
					</p>
				)}
				<Footer />
			</div>
		</main>
	)
}
