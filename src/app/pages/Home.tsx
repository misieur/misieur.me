import {Footer, GeneratorCard, ToolCard, ToolGroup} from '../components/index.js'
import {useLocale, useTitle} from '../contexts/index.js'
import {useMediaQuery} from '../hooks/index.js'

interface Props {
	path?: string,
}
export function Home({}: Props) {
	const { locale } = useLocale()
	useTitle(locale('title.home'))

	const smallScreen = useMediaQuery('(max-width: 580px)')

	return <main>
		<div class="legacy-container">
			<div class="card-group">
				{smallScreen ? /* mobile */ <>
					<PopularGenerators />
					<Tools />
				</> : /* desktop */ <>
					<div class="card-column">
						<PopularGenerators />
					</div>
					{!smallScreen && <div class="card-column">
						<Tools />
					</div>}
				</>}
			</div>
			<Footer />
		</div>
	</main>
}

function PopularGenerators() {
	const { locale } = useLocale()
	return <ToolGroup title={locale('generators.popular')} link="/generators/">
		<GeneratorCard minimal id="itemsadder:config" />
		<GeneratorCard minimal id="itemsadder:emoji_config" />
		<GeneratorCard minimal id="itemsadder:modern_item_config" />
		<ToolCard title={locale('generators.all')} link="/generators/" titleIcon="arrow_right" />
	</ToolGroup>
}

function Tools() {
	const { locale } = useLocale()

	return <ToolGroup title={locale('tools')}>
		<ToolCard title="Transformation preview 👀"
			link="/transformation/"
			desc="Visualize transformations for display entities" />
		<ToolCard title="HitBox Utils 🧊"
			link="https://github.com/misieur/Hitbox-utils"
			desc="A BlockBench Plugin made to create and edit hitbox models" />
	</ToolGroup>
}
