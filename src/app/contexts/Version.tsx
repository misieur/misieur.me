import type {ComponentChildren} from 'preact'
import {createContext} from 'preact'
import {useCallback, useContext, useEffect, useState} from 'preact/hooks'
import {useSearchParam} from '../hooks/index.js'
import type {VersionId} from '../services/index.js'
import {VersionIds} from '../services/index.js'
import {Store} from '../Store.js'

const VERSION_PARAM = 'version'

interface Version {
	version: VersionId,
	changeVersion: (version: VersionId, store?: boolean, updateSearch?: boolean) => unknown,
	changeTargetVersion: (version: VersionId, replace?: boolean) => unknown,
}

const Version = createContext<Version>({
	version: '1.18.2',
	changeVersion: () => {
	},
	changeTargetVersion: () => {
	},
})

export function useVersion() {
	return useContext(Version)
}

export function VersionProvider({children}: { children: ComponentChildren }) {
	const [version, setVersion] = useState<VersionId>(Store.getVersionOrDefault())

	const [targetVersion, changeTargetVersion] = useSearchParam(VERSION_PARAM)

	useEffect(() => {
		if (VersionIds.includes(targetVersion as VersionId) && version !== targetVersion) {
			setVersion(targetVersion as VersionId)
		}
	}, [version, targetVersion])

	const changeVersion = useCallback((newVersion: VersionId, store = true, updateSearch = false) => {
		if (updateSearch || targetVersion) {
			changeTargetVersion(newVersion, true)
		}
		if (store) {
			Store.setVersion(newVersion)
		}
		setVersion(newVersion)
	}, [version, targetVersion])

	const value: Version = {
		version,
		changeVersion,
		changeTargetVersion,
	}

	return <Version.Provider value={value}>
		{children}
	</Version.Provider>
}
