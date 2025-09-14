import type {ComponentChildren} from 'preact'
import {createContext} from 'preact'
import {useCallback, useContext, useEffect, useState} from 'preact/hooks'
import type {VersionId} from '../services/index.js'
import {useLocale} from './index.js'

interface Title {
	title: string,
	changeTitle: (title: string, versions?: VersionId[], suffix?: string) => unknown,
}

const Title = createContext<Title>({
	title: '',
	changeTitle: () => {
	},
})

export function useTitle(title?: string, versions?: VersionId[], suffix?: string) {
	const context = useContext(Title)
	useEffect(() => {
		if (title) {
			context.changeTitle(title, versions, suffix)
		}
	}, [title, versions, suffix])
	return context
}

export function TitleProvider({children}: { children: ComponentChildren }) {
	const {locale} = useLocale()
	const [title, setTitle] = useState<string>(locale('title.home'))

	const changeTitle = useCallback((title: string) => {
		document.title = title
		setTitle(title)
	}, [])

	const value = {
		title,
		changeTitle,
	}

	return <Title.Provider value={value}>
		{children}
	</Title.Provider>
}
