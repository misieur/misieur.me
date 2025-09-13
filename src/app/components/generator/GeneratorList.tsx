import {useMemo, useState} from 'preact/hooks'
import type {ConfigGenerator} from '../../Config.js'
import config from '../../Config.js'
import {useLocale} from '../../contexts/index.js'
import {GeneratorCard, TextInput} from '../index.js'

interface Props {
	path?: string,
	predicate?: (gen: ConfigGenerator) => boolean | undefined,
}
export function GeneratorList({ predicate }: Props) {
	const { locale } = useLocale()

	const [search, setSearch] = useState('')

	const filteredGenerators = useMemo(() => {
		const results = config.generators
			.filter(gen => predicate === undefined ? false : predicate(gen))
			.map(g => ({ ...g, name: locale(`generator.${g.id}`).toLowerCase() }))
		return searchGenerators(results, search)
	}, [search, locale, predicate])

	return <div class="generator-list">
		<div class="navigation">
			<TextInput class="btn btn-input query-search" placeholder={locale('generators.search')} value={search} onChange={setSearch} autofocus />
		</div>
		{filteredGenerators.length === 0 ? <>
			<span class="note">{locale('generators.no_results')}</span>
		</> : <div class="card-grid">
			{filteredGenerators.map(gen =>
				<GeneratorCard id={gen.id} />
			)}
		</div>}
	</div>
}

export function searchGenerators(generators: (ConfigGenerator & { name: string})[], search?: string) {
	if (search) {
		const parts = search.split(' ').map(q => q.trim().toLowerCase()).filter(q => q.length > 0)
		generators = generators.filter(g => parts.some(p => g.name.includes(p))
			|| parts.some(p => g.path?.includes(p) ?? false)
			|| parts.some(p => g.tags?.some(t => t.includes(p)) ?? false)
			|| parts.some(p => g.aliases?.some(a => a.includes(p)) ?? false))
	}
	generators.sort((a, b) => a.name.localeCompare(b.name))
	if (search) {
		generators.sort((a, b) => (b.name.startsWith(search) ? 1 : 0) - (a.name.startsWith(search) ? 1 : 0))
	}
	return generators
}
