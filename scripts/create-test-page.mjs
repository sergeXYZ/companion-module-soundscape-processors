#!/usr/bin/env node
/**
 * Build a clean Sound Object Routing test page (page 1 by default).
 * Uses actions + feedbacks so subscription polling picks up the OSC paths.
 * Quit Companion before running.
 *
 * Usage:
 *   node scripts/create-test-page.mjs [--page 1]
 */
import { randomBytes } from 'node:crypto'
import { copyFileSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const COLOR_BLACK = 0
const COLOR_GREEN = 65280
const COLOR_RED = 16711680
const DEFAULT_DB = join(homedir(), 'Library/Application Support/companion/v5.0/db.sqlite')
const MODULE_VERSION = '2.0.0-beta.8'

const COMBOS = [
	{ fg: 1, so: 1 },
	{ fg: 1, so: 128 },
	{ fg: 32, so: 1 },
	{ fg: 32, so: 128 },
]

function parseArgs() {
	const args = process.argv.slice(2)
	const opts = { page: 1, dbPath: DEFAULT_DB, force: false }
	for (let i = 0; i < args.length; i++) {
		if (args[i] === '--page') opts.page = Number(args[++i])
		else if (args[i] === '--db') opts.dbPath = args[++i]
		else if (args[i] === '--force') opts.force = true
	}
	return opts
}

function nanoid(size = 21) {
	const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-'
	const bytes = randomBytes(size)
	let id = ''
	for (let i = 0; i < size; i++) id += alphabet[bytes[i] & 63]
	return id
}

function opt(value, isExpression = false) {
	return { value, isExpression }
}

function sqlQuery(dbPath, sql) {
	return execFileSync('sqlite3', [dbPath, sql], { encoding: 'utf8' }).trim()
}

function sqlRun(dbPath, sql) {
	execFileSync('sqlite3', [dbPath, sql], { encoding: 'utf8' })
}

function sqlEscape(value) {
	return value.replace(/'/g, "''")
}

function companionRunning() {
	try {
		return (
			execFileSync('pgrep', ['-f', '/Applications/Companion.app/Contents/MacOS/Companion'], {
				encoding: 'utf8',
			}).trim().length > 0
		)
	} catch {
		return false
	}
}

function findConnectionId(dbPath) {
	const output = sqlQuery(dbPath, 'SELECT id, value FROM instances;')
	for (const line of output.split('\n')) {
		if (!line) continue
		const sep = line.indexOf('|')
		const id = line.slice(0, sep)
		const data = JSON.parse(line.slice(sep + 1))
		if (data.moduleInstanceType !== 'connection') continue
		if (data.moduleId === 'soundscape-processors') return { id, data }
	}
	return null
}

function canvasLayer() {
	return {
		id: 'canvas',
		name: 'Canvas',
		usage: 'auto',
		type: 'canvas',
		decoration: opt('default'),
		showStatusIcons: opt('default'),
	}
}

function boxLayer(color) {
	return {
		id: 'box0',
		name: 'Background',
		usage: 'auto',
		type: 'box',
		enabled: opt(true),
		opacity: opt(100),
		x: opt(0),
		y: opt(0),
		width: opt(100),
		height: opt(100),
		rotation: opt(0),
		color: opt(color),
		borderWidth: opt(0),
		borderColor: opt(0),
		borderPosition: opt('inside'),
	}
}

function textLayer(id, text, color, enabled = true, enabledIsExpression = false) {
	return {
		id,
		name: id,
		usage: 'auto',
		type: 'text',
		enabled: opt(enabled, enabledIsExpression),
		opacity: opt(100),
		x: opt(0),
		y: opt(0),
		width: opt(100),
		height: opt(100),
		rotation: opt(0),
		text: opt(text),
		color: opt(color),
		halign: opt('center'),
		valign: opt('center'),
		fontsize: opt(100),
		fontsizeAllowShrink: opt(true),
		font: opt('companion-sans'),
		outlineColor: opt(4278190080),
	}
}

function createAction(definitionId, connectionId, options) {
	return {
		id: nanoid(),
		type: 'action',
		definitionId,
		connectionId,
		options: Object.fromEntries(Object.entries(options).map(([k, v]) => [k, opt(v)])),
		upgradeIndex: 0,
		children: {},
	}
}

function createFeedback(definitionId, connectionId, options, style = null) {
	const feedback = {
		id: nanoid(),
		type: 'feedback',
		definitionId,
		connectionId,
		options: Object.fromEntries(Object.entries(options).map(([k, v]) => [k, opt(v)])),
		upgradeIndex: 0,
		isInverted: opt(false),
	}
	if (style) feedback.style = style
	return feedback
}

function baseButton({ text, boxColor, textColor, steps, feedbacks = [], layers = null }) {
	return {
		type: 'button-layered',
		style: {
			layers: layers || [canvasLayer(), boxLayer(boxColor), textLayer('text0', text, textColor)],
		},
		options: {
			stepProgression: 'auto',
			stepExpression: '',
			rotaryActions: false,
			canModifyStyleInApis: true,
			notes: '',
		},
		feedbacks,
		steps,
		localVariables: [],
	}
}

function label(fg, so, suffix) {
	return `FG${fg} SO${so}\n${suffix}`
}

function buildDecrease(connectionId, fg, so) {
	return baseButton({
		text: label(fg, so, '- Gain'),
		boxColor: COLOR_BLACK,
		textColor: COLOR_GREEN,
		steps: {
			0: {
				action_sets: {
					down: [
						createAction('decreaseSoundObjectRoutingGain', connectionId, {
							functiongroup: fg,
							soundobject: so,
							gain: 1.1,
						}),
					],
					up: [],
				},
				options: { runWhileHeld: [] },
			},
		},
	})
}

function buildIncrease(connectionId, fg, so) {
	return baseButton({
		text: label(fg, so, '+ Gain'),
		boxColor: COLOR_BLACK,
		textColor: COLOR_GREEN,
		steps: {
			0: {
				action_sets: {
					down: [
						createAction('increaseSoundObjectRoutingGain', connectionId, {
							functiongroup: fg,
							soundobject: so,
							gain: 1.1,
						}),
					],
					up: [],
				},
				options: { runWhileHeld: [] },
			},
		},
	})
}

function buildMute(connectionId, fg, so) {
	return baseButton({
		text: label(fg, so, 'Mute'),
		boxColor: COLOR_GREEN,
		textColor: COLOR_BLACK,
		feedbacks: [
			createFeedback(
				'soundObjectRoutingMute',
				connectionId,
				{ functiongroup: fg, soundobject: so },
				{ bgcolor: COLOR_RED, color: COLOR_BLACK }
			),
		],
		steps: {
			0: {
				action_sets: {
					down: [
						createAction('setSoundObjectRoutingMute', connectionId, {
							functiongroup: fg,
							soundobject: so,
							mute: 1,
						}),
					],
					up: [],
				},
				options: { runWhileHeld: [] },
			},
			1: {
				action_sets: {
					down: [
						createAction('setSoundObjectRoutingMute', connectionId, {
							functiongroup: fg,
							soundobject: so,
							mute: 0,
						}),
					],
					up: [],
				},
				options: { runWhileHeld: [] },
			},
		},
	})
}

function buildSorGainDisplay(connectionId, fg, so) {
	return baseButton({
		text: label(fg, so, 'Gain'),
		boxColor: COLOR_BLACK,
		textColor: COLOR_GREEN,
		feedbacks: [
			createFeedback('soundObjectRoutingGain', connectionId, {
				functiongroup: fg,
				soundobject: so,
			}),
		],
		steps: {
			0: { action_sets: { down: [], up: [] }, options: { runWhileHeld: [] } },
		},
	})
}

function buildSorMuteValueDisplay(connectionId, fg, so) {
	const varText = `FG${fg} SO${so} Mute\n$(Soundscape:soundobjectrouting_mute_${fg}_${so})`
	return baseButton({
		text: varText,
		boxColor: COLOR_BLACK,
		textColor: COLOR_GREEN,
		layers: [
			canvasLayer(),
			boxLayer(COLOR_BLACK),
			textLayer('text_green', varText, COLOR_GREEN, `!bool($(Soundscape:soundobjectrouting_mute_${fg}_${so}))`, true),
			textLayer('text_red', varText, COLOR_RED, `bool($(Soundscape:soundobjectrouting_mute_${fg}_${so}))`, true),
		],
		feedbacks: [
			createFeedback('soundObjectRoutingMute', connectionId, {
				functiongroup: fg,
				soundobject: so,
			}),
		],
		steps: {
			0: { action_sets: { down: [], up: [] }, options: { runWhileHeld: [] } },
		},
	})
}

function buildMatrixInputGainDisplay(connectionId, input) {
	return baseButton({
		text: `MX In ${input} Gain\n$(Soundscape:matrixinput${input}_gain) dB`,
		boxColor: COLOR_BLACK,
		textColor: COLOR_GREEN,
		feedbacks: [createFeedback('matrixInputGain', connectionId, { matrixinput: input })],
		steps: {
			0: { action_sets: { down: [], up: [] }, options: { runWhileHeld: [] } },
		},
	})
}

function insertControl(statements, button) {
	const id = `bank:${nanoid()}`
	statements.push(
		`INSERT INTO controls (id, value) VALUES ('${id}', '${sqlEscape(JSON.stringify(button))}');`
	)
	return id
}

function main() {
	const opts = parseArgs()

	if (!existsSync(opts.dbPath)) {
		console.error(`Database not found: ${opts.dbPath}`)
		process.exit(1)
	}
	if (companionRunning() && !opts.force) {
		console.error('Quit Companion first, then re-run this script.')
		process.exit(1)
	}

	const found = findConnectionId(opts.dbPath)
	if (!found) {
		console.error('No soundscape-processors connection found.')
		process.exit(1)
	}
	const { id: connectionId, data: instance } = found

	const backup = `${opts.dbPath}.test-page-backup-${Date.now()}`
	copyFileSync(opts.dbPath, backup)
	console.log(`Backup: ${backup}`)
	console.log(`Connection: ${connectionId}`)

	// Point connection at beta.7 + subscribed polling
	instance.moduleVersionId = MODULE_VERSION
	instance.config = {
		...instance.config,
		polling: true,
		pollMode: 'subscribed',
		pollIntervalContinuous: instance.config.pollIntervalContinuous || 500,
		pollIntervalDiscrete: instance.config.pollIntervalDiscrete || 2000,
		pollInterval: instance.config.pollInterval || 500,
		verbose: true,
		matrixSize: instance.config.matrixSize || 'XL',
	}

	const statements = []
	statements.push(
		`UPDATE instances SET value='${sqlEscape(JSON.stringify(instance))}' WHERE id='${connectionId}';`
	)

	// Clear existing bank controls referenced by this page, then rebuild page
	const pageRaw = sqlQuery(opts.dbPath, `SELECT value FROM pages WHERE id='${opts.page}';`)
	if (pageRaw) {
		const oldPage = JSON.parse(pageRaw)
		for (const row of Object.values(oldPage.controls || {})) {
			for (const controlId of Object.values(row || {})) {
				if (typeof controlId === 'string' && controlId.startsWith('bank:')) {
					statements.push(`DELETE FROM controls WHERE id='${controlId}';`)
				}
			}
		}
	}

	const controls = {}
	COMBOS.forEach((combo, rowIndex) => {
		const { fg, so } = combo
		const decreaseId = insertControl(statements, buildDecrease(connectionId, fg, so))
		const increaseId = insertControl(statements, buildIncrease(connectionId, fg, so))
		const muteId = insertControl(statements, buildMute(connectionId, fg, so))
		const gainId = insertControl(statements, buildSorGainDisplay(connectionId, fg, so))

		controls[String(rowIndex)] = {
			'0': decreaseId,
			'1': increaseId,
			'2': muteId,
			'3': gainId,
		}
		console.log(`Row ${rowIndex}: FG${fg} SO${so}  [-] [+] [Mute] [Gain]`)
	})

	// Extra display tests on the right of row 0
	const muteValueId = insertControl(statements, buildSorMuteValueDisplay(connectionId, 1, 1))
	const matrixGainId = insertControl(statements, buildMatrixInputGainDisplay(connectionId, 1))
	controls['0']['4'] = muteValueId
	controls['0']['5'] = matrixGainId
	console.log('Row 0 extras: [Mute 0/1] [MX In 1 Gain]')

	const page = {
		name: 'SOR Test (subscribed poll)',
		controls,
		id: nanoid(),
		gridSize: {
			minColumn: 0,
			maxColumn: 5,
			minRow: 0,
			maxRow: 3,
		},
	}

	statements.push(
		`INSERT OR REPLACE INTO pages (id, value) VALUES ('${opts.page}', '${sqlEscape(JSON.stringify(page))}');`
	)

	sqlRun(opts.dbPath, statements.join('\n'))

	console.log(`\nDone. Page ${opts.page} ready.`)
	console.log(`Module: ${MODULE_VERSION}, pollMode: subscribed`)
	console.log('Restart Companion and open page 1.')
}

main()
