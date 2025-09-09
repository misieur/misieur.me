import {Icons} from './Icons.js'
import {Octicon} from './Octicon.jsx'

interface Props {
	title: string,
	titleIcon?: keyof typeof Octicon | keyof typeof Icons,
	link: string,
	icon?: keyof typeof Icons,
	desc?: string
}
export function ToolCard({ title, desc, link, icon, titleIcon }: Props) {
	const isExternalLink = /^https?:\/\//i.test(link)
	const target = isExternalLink ? '_blank' : undefined
	const rel = isExternalLink ? 'noopener noreferrer' : undefined

	if (icon || desc) {
		return <a class="tool-card" href={link} target={target} rel={rel}>
			{icon && Icons[icon]}
			<div>
				<ToolHead title={title} titleIcon={titleIcon} />
				<p>{desc}</p>
			</div>
		</a>
	}

	return <a class="tool-card" href={link} target={target} rel={rel}>
		<ToolHead title={title} titleIcon={titleIcon} />
	</a>
}

function ToolHead({ title, titleIcon }: Pick<Props, 'title' | 'titleIcon'>) {
	return <h3 class="text-[1.17em]">
		{title}
		{titleIcon && (titleIcon in Octicon ? (Octicon as any)[titleIcon] : (Icons as any)[titleIcon])}
	</h3>
}
