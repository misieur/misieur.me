import {useLocale} from '../contexts/index.js'
import {SOURCE_REPO_URL} from '../Utils.js'
import {Octicon} from './index.js'

export function Footer() {
	const { locale } = useLocale()

	return <footer>
		<p>
			<span>{locale('developed_by')} <a href="https://github.com/misieur" target="_blank" rel="noreferrer">Misieur</a> and <a href="https://github.com/misode" target="_blank" rel="noreferrer">Misode</a></span>
		</p>
		<p>
			{Octicon.mark_github}
			<span>{locale('source_code_on')} <a href={SOURCE_REPO_URL} target="_blank" rel="noreferrer">{locale('github')}</a></span>
		</p>
	</footer>
}
