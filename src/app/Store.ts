import type {ProjectMeta} from './contexts/index.js'
import {DRAFT_PROJECT} from './contexts/index.js'
import type {VersionId} from './services/index.js'
import {DEFAULT_VERSION, VersionIds} from './services/index.js'
import {safeJsonParse} from './Utils.js'

export namespace Store {
	export const ID_THEME = 'theme'
	export const ID_VERSION = 'schema_version'
	export const ID_INDENT = 'indentation'
	export const ID_FORMAT = 'output_format'
	export const ID_HIGHLIGHTING = 'output_highlighting'
	export const ID_PROJECTS = 'projects'
	export const ID_PREVIEW_PANEL_OPEN = 'preview_panel_open'
	export const ID_PROJECT_PANEL_OPEN = 'project_panel_open'
	export const ID_OPEN_PROJECT = 'open_project'

	export function getLanguage() {
		return 'en'
	}

	export function getTheme() {
		return localStorage.getItem(ID_THEME) ?? 'system'
	}

	export function getVersionOrDefault(): VersionId {
		const version = localStorage.getItem(ID_VERSION)
		if (version && VersionIds.includes(version as VersionId)) {
			return version as VersionId
		}
		return DEFAULT_VERSION
	}

	export function getVersion(): VersionId | null {
		const version = localStorage.getItem(ID_VERSION)
		if (version && VersionIds.includes(version as VersionId)) {
			return version as VersionId
		}
		return null
	}

	export function getIndent() {
		return localStorage.getItem(ID_INDENT) ?? '2_spaces'
	}

	export function getFormat() {
		return localStorage.getItem(ID_FORMAT) ?? 'yaml'
	}

	export function getHighlighting() {
		return localStorage.getItem(ID_HIGHLIGHTING) !== 'false'
	}

	export function getProjects(): ProjectMeta[] {
		const projects = localStorage.getItem(ID_PROJECTS)
		if (projects) {
			return safeJsonParse(projects) ?? []
		}
		return [DRAFT_PROJECT]
	}

	export function getPreviewPanelOpen(): boolean | undefined {
		const open = localStorage.getItem(ID_PREVIEW_PANEL_OPEN)
		if (open === null) return undefined
		return safeJsonParse(open)
	}

	export function getProjectPanelOpen(): boolean | undefined {
		const open = localStorage.getItem(ID_PROJECT_PANEL_OPEN)
		if (open === null) return undefined
		return safeJsonParse(open)
	}

	export function getOpenProject() {
		return localStorage.getItem(ID_OPEN_PROJECT) ?? DRAFT_PROJECT.name
	}

	export function getColormap(): undefined {
		return undefined
	}

	export function setLanguage() {} // I don't support changing language and will remove all that stuff later

	export function setTheme(theme: string | undefined) {
		if (theme) localStorage.setItem(ID_THEME, theme)
	}

	export function setVersion(version: VersionId | undefined) {
		if (version) localStorage.setItem(ID_VERSION, version)
	}

	export function setIndent(indent: string | undefined) {
		if (indent) localStorage.setItem(ID_INDENT, indent)
	}

	export function setFormat(format: string | undefined) {
		if (format) localStorage.setItem(ID_FORMAT, format)
	}

	export function setHighlighting(highlighting: boolean | undefined) {
		if (highlighting !== undefined) localStorage.setItem(ID_HIGHLIGHTING, highlighting.toString())
	}

	export function setProjects(projects: ProjectMeta[] | undefined) {
		if (projects) localStorage.setItem(ID_PROJECTS, JSON.stringify(projects))
	}

	export function setPreviewPanelOpen(open: boolean | undefined) {
		if (open === undefined) {
			localStorage.removeItem(ID_PREVIEW_PANEL_OPEN)
		} else {
			localStorage.setItem(ID_PREVIEW_PANEL_OPEN, JSON.stringify(open))
		}
	}

	export function setProjectPanelOpen(open: boolean | undefined) {
		if (open === undefined) {
			localStorage.removeItem(ID_PROJECT_PANEL_OPEN)
		} else {
			localStorage.setItem(ID_PROJECT_PANEL_OPEN, JSON.stringify(open))
		}
	}

	export function setOpenProject(projectName: string | undefined) {
		if (projectName === undefined) {
			localStorage.removeItem(ID_OPEN_PROJECT)
		} else {
			localStorage.setItem(ID_OPEN_PROJECT, projectName)
		}
	}
}
