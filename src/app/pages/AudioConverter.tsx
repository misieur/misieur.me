import {useState} from 'preact/hooks'
import {Footer} from '../components/index.js'
import {FFmpeg} from '../../ffmpeg/ffmpeg/dist/esm/index.js'
import {fetchFile} from '../../ffmpeg/util/dist/esm/index.js'

interface Props {
	path?: string;
}

export function AudioConverter({}: Props) {
	const [ffmpeg] = useState(() => new FFmpeg())
	const [ffmpegLoading, setFfmpegLoading] = useState(false)
	const [converting, setConverting] = useState(false)
	const [outputUrl, setOutputUrl] = useState<string | null>(null)
	const [outputFileName, setOutputFileName] = useState('converted.ogg')
	const [channels, setChannels] = useState<'1' | '2'>('1')
	const [bitrate, setBitrate] = useState('128k')
	const [sampleRate, setSampleRate] = useState('44100')
	const [file, setFile] = useState<File | null>(null)

	const handleFileChange = async (e: Event) => {
		const input = e.currentTarget as HTMLInputElement
		const selected = input.files?.[0] ?? null
		setFile(selected)
		setOutputUrl(null)
		if (selected && !ffmpeg.loaded) {
			setFfmpegLoading(true)
			await ffmpeg.load({
				coreURL: '/assets/ffmpeg/ffmpeg-core.js',
				wasmURL: '/assets/ffmpeg/ffmpeg-core.wasm',
			})
			setFfmpegLoading(false)
		}
	}

	const handleConvert = async (e: Event) => {
		e.preventDefault()
		if (!file) return alert('Please choose a file to convert.')

		setConverting(true)
		const time = Date.now()
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
		const blob = new Blob([data.buffer], {type: 'audio/ogg'})
		const url = URL.createObjectURL(blob)
		setOutputUrl(url)
		setOutputFileName(file.name.replace(/\.[^/.]+$/, '.ogg'))
		console.log(`Converted in ${Date.now() - time}ms`)
		setConverting(false)
	}

	return (
		<main>
			<div class="legacy-container tool-box">
				<h1 class="main-title">Offline Audio Converter</h1>
				<p class="main-subtitle">Convert your audio files to OGG format</p>
				<form onSubmit={handleConvert}>
					<input type="file" id="fileInput" accept="audio/*" onChange={handleFileChange}/>
					<div class="tool-settings">
						<label>
                            Channels
							<select value={channels} onChange={e => setChannels((e.currentTarget.value as '1' | '2'))}>
								<option value="1">Mono</option>
								<option value="2">Stereo</option>
							</select>
						</label>
						{channels === '2' && (
							<p class="warning-message">
                                ⚠️ Stereo audio has some <a href="https://bugs.mojang.com/browse/MC/issues/MC-146721"
									target="_blank" rel="noopener noreferrer">audio
                                problems</a> in minecraft I do recommend using mono audio.
							</p>
						)}
						<label>
                            Bitrate
							<input type="text" value={bitrate}
								onInput={e => setBitrate((e.target as HTMLInputElement).value)}/>
						</label>
						<label>
                            Sample Rate
							<input type="text" value={sampleRate}
								onInput={e => setSampleRate((e.target as HTMLInputElement).value)}/>
						</label>
					</div>
					{file && (
						<button
							type="submit"
							disabled={ffmpegLoading || converting}
							class="main-button"
						>
							{ffmpegLoading
								? 'Loading FFmpeg…'
								: converting
									? 'Converting…'
									: 'Convert'}
						</button>
					)}
				</form>
				{outputUrl && (
					<p class="download-link">
						<a href={outputUrl} download={outputFileName}>
                            Download converted file
						</a>
					</p>
				)}
				<Footer/>
			</div>
		</main>
	)
}
