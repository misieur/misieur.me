import {Footer} from '../components/index.js'
import {useState, useEffect} from 'preact/hooks'
import {HsvaColorPicker} from 'react-colorful'
import {BlobReader, BlobWriter, TextReader, ZipWriter} from '@zip.js/zip.js'
import Color from 'color'

interface Props {
	path?: string;
}

function hexToHsv(hex: string): { h: number, s: number, v: number, a: number } {
	let a = 1
	let rgbHex = hex
	if (/^#([A-Fa-f0-9]{8})$/.test(hex)) {
		a = parseInt(hex.slice(1, 3), 16) / 255
		rgbHex = '#' + hex.slice(3)
	} else if (/^#([A-Fa-f0-9]{6})$/.test(hex)) {
		rgbHex = hex
	}
	const c = Color(rgbHex).alpha(a)
	const {h, s, v} = c.hsv().object()
	return {h, s, v, a}
}

function hsvToHex({h, s, v, a}: { h: number, s: number, v: number, a: number }): string {
	const c = Color.hsv(h, s, v).alpha(a)
	const rgb = c.rgb().array().slice(0, 3).map(x => Math.round(x))
	const alpha = Math.round(a * 255)
	return (
		'#' +
        alpha.toString(16).padStart(2, '0').toUpperCase() +
        rgb.map(x => x.toString(16).padStart(2, '0').toUpperCase()).join('')
	)
}

function hsvToRgbaString({h, s, v, a}: { h: number, s: number, v: number, a: number }): string {
	const c = Color.hsv(h, s, v).alpha(a)
	return c.rgb().string()
}

interface ColorPickerProps {
	color: { h: number, s: number, v: number, a: number };
	onChange: (color: { h: number, s: number, v: number, a: number }) => void;
}

const ColorPickerWithAlpha = ({color, onChange}: ColorPickerProps) => {
	return (
		<div className="color-picker">
			<HsvaColorPicker
				color={color}
				onChange={onChange}
			/>
		</div>
	)
}

export function ItemTooltipGenerator({}: Props) {
	const [backgroundColorHsv, setBackgroundColorHsv] = useState(hexToHsv('#FFFF0000'))
	const [frameColorHsv, setFrameColorHsv] = useState(hexToHsv('#FFFFFFFF'))

	const [isBackgroundInputFocused, setBackgroundInputFocused] = useState(false)
	const [isFrameInputFocused, setFrameInputFocused] = useState(false)
	const [backgroundInputValue, setBackgroundInputValue] = useState(hsvToHex(backgroundColorHsv))
	const [frameInputValue, setFrameInputValue] = useState(hsvToHex(frameColorHsv))
	const [previewSrc, setPreviewSrc] = useState<string>('')

	if (!isBackgroundInputFocused && backgroundInputValue !== hsvToHex(backgroundColorHsv)) {
		setBackgroundInputValue(hsvToHex(backgroundColorHsv))
	}
	if (!isFrameInputFocused && frameInputValue !== hsvToHex(frameColorHsv)) {
		setFrameInputValue(hsvToHex(frameColorHsv))
	}

	const handleColorInput = (
		setter: (v: any) => void,
		setInputValue: (v: string) => void
	) => (e: Event) => {
		const value = (e.target as HTMLInputElement).value
		setInputValue(value)
		try {
			setter(hexToHsv(value))
		} catch {
		}
	}

	async function colorizeTemplate(templateUrl: string, color: string): Promise<Blob> {
		return new Promise((resolve) => {
			const img = new Image()
			img.crossOrigin = 'anonymous'
			img.src = templateUrl
			img.onload = () => {
				const canvas = document.createElement('canvas')
				canvas.width = img.width
				canvas.height = img.height
				const ctx = canvas.getContext('2d')!
				ctx.drawImage(img, 0, 0)
				ctx.globalCompositeOperation = 'source-in'
				console.log(color)
				ctx.fillStyle = color
				ctx.fillRect(0, 0, canvas.width, canvas.height)
				ctx.globalCompositeOperation = 'source-over'
				canvas.toBlob((blob) => resolve(blob!), 'image/png')
			}
		})
	}

	async function colorizePreview(templateUrl: string, background: string, frame: string): Promise<string> {
		return new Promise((resolve) => {
			const img = new Image()
			img.crossOrigin = 'anonymous'
			img.src = templateUrl
			img.onload = () => {
				const canvas = document.createElement('canvas')
				canvas.width = img.width
				canvas.height = img.height
				const ctx = canvas.getContext('2d')!
				ctx.drawImage(img, 0, 0)

				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
				const data = imageData.data

				const bgColor = Color(background)
				const bgRgb = bgColor.rgb().array().slice(0, 3).map(x => Math.round(x))
				const bgAlpha = Math.round(bgColor.alpha() * 255)
				const frameColor = Color(frame)
				const frameRgb = frameColor.rgb().array().slice(0, 3).map(x => Math.round(x))
				const frameAlpha = Math.round(frameColor.alpha() * 255)

				for (let i = 0; i < data.length; i += 4) {
					// #00ff00 (green) - background
					// Firefox breaks colors for some reason I may not really care,
					// but this just forces me to check if the color is close enough to green and blue
					if (Math.abs(data[i]) < 100 && Math.abs(data[i + 1] - 255) < 100 && Math.abs(data[i + 2]) < 100) {
						data[i] = bgRgb[0]
						data[i + 1] = bgRgb[1]
						data[i + 2] = bgRgb[2]
						data[i + 3] = bgAlpha
					}
					// #0000ff (blue) - frame over background
					else if (Math.abs(data[i]) < 100 && Math.abs(data[i + 1]) < 100 && Math.abs(data[i + 2] - 255) < 100) {
						const fa = frameAlpha / 255
						const ba = bgAlpha / 255
						const outA = fa + ba * (1 - fa)
						data[i] = Math.round((frameRgb[0] * fa + bgRgb[0] * ba * (1 - fa)) / outA)
						data[i + 1] = Math.round((frameRgb[1] * fa + bgRgb[1] * ba * (1 - fa)) / outA)
						data[i + 2] = Math.round((frameRgb[2] * fa + bgRgb[2] * ba * (1 - fa)) / outA)
						data[i + 3] = Math.round(outA * 255)
					}
				}

				ctx.putImageData(imageData, 0, 0)
				resolve(canvas.toDataURL('image/png'))
			}
		})
	}

	useEffect(() => {
		colorizePreview(
			'/assets/tooltip/templates/preview.png',
			hsvToRgbaString(backgroundColorHsv),
			hsvToRgbaString(frameColorHsv)
		).then(setPreviewSrc)
	}, [backgroundColorHsv, frameColorHsv])

	const downloadZipWithImages = async () => {
		const blobWriter = new BlobWriter()
		const zipWriter = new ZipWriter(blobWriter)

		const backgroundImage = await colorizeTemplate('/assets/tooltip/templates/background.png', hsvToRgbaString(backgroundColorHsv))

		await zipWriter.add('background.png', new BlobReader(backgroundImage))
		await zipWriter.add('background.png.mcmeta', new TextReader('{\n' +
            '    "gui": {\n' +
            '        "scaling": {\n' +
            '            "type": "nine_slice",\n' +
            '            "width": 100,\n' +
            '            "height": 100,\n' +
            '            "border": 9\n' +
            '        }\n' +
            '    }\n' +
            '}\n'))

		const frameImage = await colorizeTemplate('/assets/tooltip/templates/frame.png', hsvToRgbaString(frameColorHsv))

		await zipWriter.add('frame.png', new BlobReader(frameImage))
		await zipWriter.add('frame.png.mcmeta', new TextReader('{\n' +
            '    "gui": {\n' +
            '        "scaling": {\n' +
            '            "type": "nine_slice",\n' +
            '            "width": 100,\n' +
            '            "height": 100,\n' +
            '            "border": 10,\n' +
            '            "stretch_inner": true\n' +
            '        }\n' +
            '    }\n' +
            '}\n'))

		const zipBlob = await zipWriter.close()

		const url = URL.createObjectURL(zipBlob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'itemsadder_tooltips_images.zip'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	return (
		<main>
			<div className="legacy-container tool-box">
				<h1 className="smaller-main-title">Item Tooltip Generator For ItemsAdder</h1>
				<form>
					<div className="tool-settings">
                        Background Color
						<div className="color-input-row">
							<ColorPickerWithAlpha
								color={backgroundColorHsv}
								onChange={setBackgroundColorHsv}
							/>
							<input
								className="hex-color"
								type="text"
								value={backgroundInputValue}
								onInput={handleColorInput(setBackgroundColorHsv, setBackgroundInputValue)}
								onFocus={() => setBackgroundInputFocused(true)}
								onBlur={() => setBackgroundInputFocused(false)}
								maxLength={9}
								placeholder="#AARRGGBB"
								style={{borderColor: hsvToRgbaString(backgroundColorHsv)}}
							/>
						</div>
                        Frame Color
						<div className="color-input-row">
							<ColorPickerWithAlpha
								color={frameColorHsv}
								onChange={setFrameColorHsv}
							/>
							<input
								className="hex-color"
								type="text"
								value={frameInputValue}
								onInput={handleColorInput(setFrameColorHsv, setFrameInputValue)}
								onFocus={() => setFrameInputFocused(true)}
								onBlur={() => setFrameInputFocused(false)}
								maxLength={9}
								placeholder="#AARRGGBB"
								style={{borderColor: hsvToRgbaString(frameColorHsv)}}
							/>
						</div>
						<button
							type="button"
							onClick={downloadZipWithImages}
							className="download-link"
						>
                            Download Tooltip Images
						</button>
					</div>
				</form>
                Preview
				<img
					src={previewSrc}
					alt="Tooltip Preview"
					style={{
						display: 'block',
						margin: '10px',
						width: '200px',
						height: 'auto',
						imageRendering: 'pixelated',
					}}
				/>
				<Footer/>
			</div>
		</main>
	)
}
