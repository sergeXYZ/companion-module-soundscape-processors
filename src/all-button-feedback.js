/**
 * ALL-BUTTON-FEEDBACK — 3-state feedback for Latch-All presets (grau / aktiv / gelb ≠ Ungleich)
 *
 * REVERT:
 *   1. Set ALL_BUTTON_TRIPLE_STATE_ENABLED = false below, or
 *   2. Delete this file and remove blocks marked ALL-BUTTON-FEEDBACK in other files.
 *   Search: git grep ALL-BUTTON-FEEDBACK
 */
export const ALL_BUTTON_TRIPLE_STATE_ENABLED = true
export const ALL_BUTTON_FEEDBACK_MARKER = 'ALL-BUTTON-FEEDBACK'

/** Preset id → feedback definition id */
export const ALL_BUTTON_PRESET_FEEDBACKS = {
	matrix_input_mute_all: 'matrixInputMuteAll',
	matrix_input_delay_enable_all: 'matrixInputDelayEnableAll',
	matrix_input_eq_enable_all: 'matrixInputEQEnableAll',
	matrix_input_polarity_all: 'matrixInputPolarityAll',
	matrix_output_mute_all: 'matrixOutputMuteAll',
	matrix_output_delay_enable_all: 'matrixOutputDelayEnableAll',
	matrix_output_eq_enable_all: 'matrixOutputEQEnableAll',
	matrix_output_polarity_all: 'matrixOutputPolarityAll',
	matrix_node_delay_enable_all: 'matrixNodeDelayEnableAll',
	reverb_proc_mute_all: 'reverbInputProcessingMuteAll',
	reverb_proc_eq_all: 'reverbInputProcessingEQEnableAll',
	sor_mute_all: 'soundObjectRoutingMuteAll',
}

export function normalizeDiscreteValue(value) {
	return Number(value) === 1 ? 1 : 0
}

/** OSC path id after segment — works with or without /dbaudio1 prefix */
export function oscIdAfterSegment(address, segment) {
	const parts = String(address || '')
		.split('/')
		.filter(Boolean)
	const idx = parts.findIndex((p) => p.toLowerCase() === String(segment).toLowerCase())
	if (idx < 0 || idx + 1 >= parts.length) return null
	const id = parts[idx + 1]
	if (!id || id === '*' || id.includes('[')) return null
	return id
}

/** Two ids after segment (matrix node, SOR, …) */
export function oscIdsAfterSegment(address, segment) {
	const parts = String(address || '')
		.split('/')
		.filter(Boolean)
	const idx = parts.findIndex((p) => p.toLowerCase() === String(segment).toLowerCase())
	if (idx < 0 || idx + 2 >= parts.length) return [null, null]
	const id1 = parts[idx + 1]
	const id2 = parts[idx + 2]
	if (!id1 || id1 === '*' || !id2 || id2 === '*') return [null, null]
	return [id1, id2]
}

export function effectiveMatrixInputCount(self) {
	const configured = Number(self.matrixInputCount) || 0
	const fromData = (self.DATA?.matrixInput?.length || 1) - 1
	return Math.max(configured, fromData)
}

export function effectiveMatrixOutputCount(self) {
	const configured = Number(self.matrixOutputCount) || 0
	const fromData = (self.DATA?.matrixOutput?.length || 1) - 1
	return Math.max(configured, fromData)
}

export function applyAllDiscreteLocal(self, { store, field, value, countFn }) {
	const count = countFn(self) || 0
	const normalized = normalizeDiscreteValue(value)
	const bucket = self.DATA?.[store]
	if (!bucket) return
	for (let i = 1; i <= count; i++) {
		if (bucket[i]) bucket[i][field] = normalized
	}
}

export function applyAllMatrixNodeDelayEnableLocal(self, value) {
	const normalized = normalizeDiscreteValue(value)
	const inCount = effectiveMatrixInputCount(self)
	const outCount = effectiveMatrixOutputCount(self)
	for (let input = 1; input <= inCount; input++) {
		for (let output = 1; output <= outCount; output++) {
			if (self.DATA?.matrixNode?.[input]?.[output]) {
				self.DATA.matrixNode[input][output].delayEnable = normalized
			}
		}
	}
}

export function applyAllSoundObjectRoutingMuteLocal(self, value) {
	const normalized = normalizeDiscreteValue(value)
	const soCount = effectiveMatrixInputCount(self)
	for (let fg = 1; fg <= 32; fg++) {
		for (let so = 1; so <= soCount; so++) {
			if (self.DATA?.soundObjectRouting?.[fg]?.[so]) {
				self.DATA.soundObjectRouting[fg][so].mute = normalized
			}
		}
	}
}

export function clearWildcardDiscreteAccum(self) {
	if (!self._wildcardDiscreteAccum) return
	for (const buf of self._wildcardDiscreteAccum.values()) {
		if (buf.timer) clearTimeout(buf.timer)
	}
	self._wildcardDiscreteAccum.clear()
}

export function getHomogeneousState(values) {
	const defined = values.filter((v) => v === 0 || v === 1)
	if (defined.length === 0) return 'unknown'

	let state = defined[0]
	for (let i = 1; i < defined.length; i++) {
		if (defined[i] !== state) return 'mixed'
	}
	return state === 1 ? 'all1' : 'all0'
}

/** Label line for mixed state, e.g. "In ALL\\nMute" → "In ALL Mute" */
export function formatAllUnequalText(baseText) {
	const label = String(baseText)
		.split('\n')
		.map((s) => s.trim())
		.filter(Boolean)
		.join(' ')
	return `${label}\n≠`
}

export function makeAllFeedbackStyle({ baseText, activeStyle, unequalStyle, state }) {
	if (state === 'all1') {
		return { text: baseText, size: '14', ...activeStyle }
	}
	if (state === 'mixed') {
		return {
			text: formatAllUnequalText(baseText),
			size: '14',
			...unequalStyle,
		}
	}
	return { text: baseText, size: '14', ...activeStyle }
}

function collect1D(getEntry, count, field) {
	const values = []
	for (let i = 1; i <= count; i++) {
		const entry = getEntry(i)
		if (!entry) continue
		const raw = entry[field]
		if (raw === null || raw === undefined) continue
		values.push(normalizeDiscreteValue(raw))
	}
	return values
}

function collectMatrixNodeDelayEnable(self) {
	const values = []
	const inCount = effectiveMatrixInputCount(self)
	const outCount = effectiveMatrixOutputCount(self)
	for (let input = 1; input <= inCount; input++) {
		for (let output = 1; output <= outCount; output++) {
			const raw = self.DATA?.matrixNode?.[input]?.[output]?.delayEnable
			if (raw === null || raw === undefined) continue
			values.push(normalizeDiscreteValue(raw))
		}
	}
	return values
}

function collectSoundObjectRoutingMute(self) {
	const values = []
	const soCount = effectiveMatrixInputCount(self)
	for (let fg = 1; fg <= 32; fg++) {
		for (let so = 1; so <= soCount; so++) {
			const raw = self.DATA?.soundObjectRouting?.[fg]?.[so]?.mute
			if (raw === null || raw === undefined) continue
			values.push(normalizeDiscreteValue(raw))
		}
	}
	return values
}

/** ALL-BUTTON-FEEDBACK: feedback definitions (advanced, 3 states) */
export function buildAllButtonFeedbackDefinitions(COLORS, moduleInstance) {
	const unequalStyle = COLORS.unequal || COLORS.grey
	const defs = {}

	const add = (id, baseText, activeStyle, collectValues) => {
		defs[id] = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size', 'bgcolor'],
			name: `All — ${baseText.replace('\n', ' ')} (homogeneous state)`,
			description:
				'ALL-BUTTON-FEEDBACK: Grey when all off, active color when all on, yellow ≠ when mixed',
			defaultStyle: { text: baseText, size: '14', ...COLORS.grey },
			options: [],
			callback: function () {
				const state = getHomogeneousState(collectValues(moduleInstance))
				if (state === 'unknown' || state === 'all0') {
					return { text: baseText, size: '14', ...COLORS.grey }
				}
				return makeAllFeedbackStyle({ baseText, activeStyle, unequalStyle, state })
			},
		}
	}

	add('matrixInputMuteAll', 'In ALL\nMute', COLORS.mute, (self) =>
		collect1D((i) => self.DATA?.matrixInput?.[i], effectiveMatrixInputCount(self), 'mute')
	)
	add('matrixInputDelayEnableAll', 'In ALL\nDelay', COLORS.delay, (self) =>
		collect1D((i) => self.DATA?.matrixInput?.[i], effectiveMatrixInputCount(self), 'delayEnable')
	)
	add('matrixInputEQEnableAll', 'In ALL\nEQ', COLORS.eq, (self) =>
		collect1D((i) => self.DATA?.matrixInput?.[i], effectiveMatrixInputCount(self), 'eqEnable')
	)
	add('matrixInputPolarityAll', 'In ALL\nPol', COLORS.polarity, (self) =>
		collect1D((i) => self.DATA?.matrixInput?.[i], effectiveMatrixInputCount(self), 'polarity')
	)
	add('matrixOutputMuteAll', 'Out ALL\nMute', COLORS.mute, (self) =>
		collect1D((i) => self.DATA?.matrixOutput?.[i], effectiveMatrixOutputCount(self), 'mute')
	)
	add('matrixOutputDelayEnableAll', 'Out ALL\nDelay', COLORS.delay, (self) =>
		collect1D((i) => self.DATA?.matrixOutput?.[i], effectiveMatrixOutputCount(self), 'delayEnable')
	)
	add('matrixOutputEQEnableAll', 'Out ALL\nEQ', COLORS.eq, (self) =>
		collect1D((i) => self.DATA?.matrixOutput?.[i], effectiveMatrixOutputCount(self), 'eqEnable')
	)
	add('matrixOutputPolarityAll', 'Out ALL\nPol', COLORS.polarity, (self) =>
		collect1D((i) => self.DATA?.matrixOutput?.[i], effectiveMatrixOutputCount(self), 'polarity')
	)
	add('matrixNodeDelayEnableAll', 'Node ALL\nDelay', COLORS.delay, collectMatrixNodeDelayEnable)
	add('reverbInputProcessingMuteAll', 'Rev ALL\nMute', COLORS.mute, (self) =>
		collect1D((i) => self.DATA?.reverbInputProcessing?.[i], effectiveMatrixInputCount(self), 'mute')
	)
	add('reverbInputProcessingEQEnableAll', 'Rev ALL\nEQ', COLORS.eq, (self) =>
		collect1D((i) => self.DATA?.reverbInputProcessing?.[i], effectiveMatrixInputCount(self), 'eqEnable')
	)
	add('soundObjectRoutingMuteAll', 'SOR ALL\nMute', COLORS.mute, collectSoundObjectRoutingMute)

	return defs
}

/** ALL-BUTTON-FEEDBACK: subscription poll paths for All actions/feedbacks */
export const ALL_BUTTON_PATH_BUILDERS = {
	matrixInputMuteAll: () => ['/matrixinput/mute/*'],
	setMatrixInputMuteAll: () => ['/matrixinput/mute/*'],
	matrixInputDelayEnableAll: () => ['/matrixinput/delayenable/*'],
	setMatrixInputDelayEnableAll: () => ['/matrixinput/delayenable/*'],
	matrixInputEQEnableAll: () => ['/matrixinput/eqenable/*'],
	setMatrixInputEqEnableAll: () => ['/matrixinput/eqenable/*'],
	matrixInputPolarityAll: () => ['/matrixinput/polarity/*'],
	setMatrixInputPolarityAll: () => ['/matrixinput/polarity/*'],

	matrixOutputMuteAll: () => ['/matrixoutput/mute/*'],
	setMatrixOutputMuteAll: () => ['/matrixoutput/mute/*'],
	matrixOutputDelayEnableAll: () => ['/matrixoutput/delayenable/*'],
	setMatrixOutputDelayEnableAll: () => ['/matrixoutput/delayenable/*'],
	matrixOutputEQEnableAll: () => ['/matrixoutput/eqenable/*'],
	setMatrixOutputEqEnableAll: () => ['/matrixoutput/eqenable/*'],
	matrixOutputPolarityAll: () => ['/matrixoutput/polarity/*'],
	setMatrixOutputPolarityAll: () => ['/matrixoutput/polarity/*'],

	matrixNodeDelayEnableAll: () => ['/matrixnode/delayenable/*/*'],
	setMatrixNodeDelayEnableAll: () => ['/matrixnode/delayenable/*/*'],

	reverbInputProcessingMuteAll: () => ['/reverbinputprocessing/mute/*'],
	setReverbInputProcessingMuteAll: () => ['/reverbinputprocessing/mute/*'],
	reverbInputProcessingEQEnableAll: () => ['/reverbinputprocessing/eqenable/*'],
	setReverbInputProcessingEqEnableAll: () => ['/reverbinputprocessing/eqenable/*'],

	soundObjectRoutingMuteAll: () => ['/soundobjectrouting/mute/*/*'],
	setSoundObjectRoutingMuteAll: () => ['/soundobjectrouting/mute/*/*'],
}

/** ALL-BUTTON-FEEDBACK: map OSC path fragment → bulk handler config */
const BULK_DISCRETE_ROUTES = [
	{
		match: '/matrixinput/mute/',
		store: 'matrixInput',
		field: 'mute',
		getCount: (s) => effectiveMatrixInputCount(s),
		allFeedbackIds: ['matrixInputMuteAll'],
		individualFeedbackIds: ['matrixInputMute'],
	},
	{
		match: '/matrixinput/delayenable/',
		store: 'matrixInput',
		field: 'delayEnable',
		getCount: (s) => effectiveMatrixInputCount(s),
		allFeedbackIds: ['matrixInputDelayEnableAll'],
		individualFeedbackIds: ['matrixInputDelayEnable'],
	},
	{
		match: '/matrixinput/eqenable/',
		store: 'matrixInput',
		field: 'eqEnable',
		getCount: (s) => effectiveMatrixInputCount(s),
		allFeedbackIds: ['matrixInputEQEnableAll'],
		individualFeedbackIds: ['matrixInputEQEnable'],
	},
	{
		match: '/matrixinput/polarity/',
		store: 'matrixInput',
		field: 'polarity',
		getCount: (s) => effectiveMatrixInputCount(s),
		allFeedbackIds: ['matrixInputPolarityAll'],
		individualFeedbackIds: ['matrixInputPolarity'],
	},
	{
		match: '/matrixoutput/mute/',
		store: 'matrixOutput',
		field: 'mute',
		getCount: (s) => effectiveMatrixOutputCount(s),
		allFeedbackIds: ['matrixOutputMuteAll'],
		individualFeedbackIds: ['matrixOutputMute'],
	},
	{
		match: '/matrixoutput/delayenable/',
		store: 'matrixOutput',
		field: 'delayEnable',
		getCount: (s) => effectiveMatrixOutputCount(s),
		allFeedbackIds: ['matrixOutputDelayEnableAll'],
		individualFeedbackIds: ['matrixOutputDelayEnable'],
	},
	{
		match: '/matrixoutput/eqenable/',
		store: 'matrixOutput',
		field: 'eqEnable',
		getCount: (s) => effectiveMatrixOutputCount(s),
		allFeedbackIds: ['matrixOutputEQEnableAll'],
		individualFeedbackIds: ['matrixOutputEQEnable'],
	},
	{
		match: '/matrixoutput/polarity/',
		store: 'matrixOutput',
		field: 'polarity',
		getCount: (s) => effectiveMatrixOutputCount(s),
		allFeedbackIds: ['matrixOutputPolarityAll'],
		individualFeedbackIds: ['matrixOutputPolarity'],
	},
	{
		match: '/reverbinputprocessing/mute/',
		store: 'reverbInputProcessing',
		field: 'mute',
		getCount: (s) => effectiveMatrixInputCount(s),
		allFeedbackIds: ['reverbInputProcessingMuteAll'],
		individualFeedbackIds: ['reverbInputProcessingMute'],
	},
	{
		match: '/reverbinputprocessing/eqenable/',
		store: 'reverbInputProcessing',
		field: 'eqEnable',
		getCount: (s) => effectiveMatrixInputCount(s),
		allFeedbackIds: ['reverbInputProcessingEQEnableAll'],
		individualFeedbackIds: ['reverbInputProcessingEQEnable'],
	},
]

function addressHasWildcardSegment(address) {
	return address.split('/').includes('*')
}

/** Field segment from route match, e.g. '/matrixinput/mute/' → 'mute' */
function routeFieldSegment(route) {
	const parts = route.match.split('/').filter(Boolean)
	return parts[parts.length - 1] || ''
}

/** True when OSC address targets one concrete index (not wildcard bulk). */
function routeHasConcreteIndex(address, route) {
	const field = routeFieldSegment(route)
	if (route.match.includes('*/*')) {
		const [id1, id2] = oscIdsAfterSegment(address, field)
		return Boolean(id1 && id2)
	}
	return Boolean(oscIdAfterSegment(address, field))
}

function expandDiscreteArgValues(oscMsg, address) {
	if (!oscMsg?.args?.length) return []
	if (oscMsg.args.length > 1) {
		return oscMsg.args.map((a) => a?.value)
	}
	const v = oscMsg.args[0]?.value
	const isWildcard = addressHasWildcardSegment(address)
	if (typeof v === 'string') {
		if (v.includes(',')) return v.split(',').map((s) => s.trim())
		// Only split 0101… bitstrings for wildcard bulk replies, not per-channel paths
		if (isWildcard && v.length > 1 && /^[01]+$/.test(v)) return v.split('')
	}
	return [v]
}

function applyBulk1DValues(self, route, values) {
	const count = route.getCount(self) || 0
	const store = self.DATA?.[route.store]
	if (!store || count < 1) return false

	const limit = Math.min(values.length, count)
	for (let i = 0; i < limit; i++) {
		const idx = i + 1
		if (!store[idx]) continue
		store[idx][route.field] = normalizeDiscreteValue(values[i])
	}
	return limit > 0
}

function flushWildcardAccum(self, key) {
	const buf = self._wildcardDiscreteAccum?.get(key)
	if (!buf) return null
	if (buf.timer) {
		clearTimeout(buf.timer)
		buf.timer = null
	}
	self._wildcardDiscreteAccum.delete(key)
	applyBulk1DValues(self, buf.route, buf.values)
	return buf.route
}

function scheduleWildcardAccumFlush(self, key) {
	const buf = self._wildcardDiscreteAccum?.get(key)
	if (!buf) return
	if (buf.timer) clearTimeout(buf.timer)
	buf.timer = setTimeout(() => {
		const route = flushWildcardAccum(self, key)
		if (route) {
			self.checkFeedbacks(...route.allFeedbackIds, ...route.individualFeedbackIds)
		}
	}, 150)
}

function accumulateWildcardSingle(self, route, value) {
	if (!self._wildcardDiscreteAccum) self._wildcardDiscreteAccum = new Map()
	const key = route.match
	let buf = self._wildcardDiscreteAccum.get(key)
	if (!buf) {
		buf = { values: [], timer: null, route }
		self._wildcardDiscreteAccum.set(key, buf)
	}
	buf.values.push(normalizeDiscreteValue(value))
	const expected = route.getCount(self)
	if (expected > 0 && buf.values.length >= expected) {
		flushWildcardAccum(self, key)
		return { flushed: true, route }
	}
	scheduleWildcardAccumFlush(self, key)
	return { flushed: false, route }
}

function applyBulk1D(self, oscMsg, route, address) {
	return applyBulk1DValues(self, route, expandDiscreteArgValues(oscMsg, address))
}

/** Row-major: input 1..N, output 1..M */
function applyBulkMatrixNodeDelayEnable(self, oscMsg) {
	const inCount = effectiveMatrixInputCount(self)
	const outCount = effectiveMatrixOutputCount(self)
	if (inCount < 1 || outCount < 1) return false

	const values = expandDiscreteArgValues(oscMsg, oscMsg?.address)
	let argIndex = 0
	for (let input = 1; input <= inCount; input++) {
		for (let output = 1; output <= outCount; output++) {
			if (argIndex >= values.length) return true
			if (self.DATA?.matrixNode?.[input]?.[output]) {
				self.DATA.matrixNode[input][output].delayEnable = normalizeDiscreteValue(values[argIndex])
			}
			argIndex++
		}
	}
	return true
}

/** Row-major: function group 1..32, sound object 1..N */
function applyBulkSoundObjectRoutingMute(self, oscMsg) {
	const soCount = effectiveMatrixInputCount(self)
	if (soCount < 1) return false

	const values = expandDiscreteArgValues(oscMsg, oscMsg?.address)
	let argIndex = 0
	for (let fg = 1; fg <= 32; fg++) {
		for (let so = 1; so <= soCount; so++) {
			if (argIndex >= values.length) return true
			if (self.DATA?.soundObjectRouting?.[fg]?.[so]) {
				self.DATA.soundObjectRouting[fg][so].mute = normalizeDiscreteValue(values[argIndex])
			}
			argIndex++
		}
	}
	return true
}

/**
 * ALL-BUTTON-FEEDBACK: Parse wildcard bulk OSC replies (e.g. 128 mute values).
 * @returns {{ handled: boolean, feedbackIds?: string[] }}
 */
export function tryApplyBulkDiscreteResponse(self, oscMsg, address) {
	if (!ALL_BUTTON_TRIPLE_STATE_ENABLED) return { handled: false }
	if (!oscMsg?.args?.length) return { handled: false }

	const path = address.toLowerCase()

	// Per-channel replies (/matrixinput/mute/5, …) — leave to processResponse (variables + feedback)
	for (const route of BULK_DISCRETE_ROUTES) {
		if (path.includes(route.match) && routeHasConcreteIndex(address, route)) {
			return { handled: false }
		}
	}

	const values = expandDiscreteArgValues(oscMsg, address)
	if (!values.length) return { handled: false }

	const isMultiValue = values.length > 1
	const isWildcard = addressHasWildcardSegment(address)
	if (!isMultiValue && !isWildcard) return { handled: false }

	if (path.includes('/matrixnode/delayenable/') && (isMultiValue || isWildcard)) {
		if (!routeHasConcreteIndex(address, { match: '/matrixnode/delayenable/' })) {
			applyBulkMatrixNodeDelayEnable(self, oscMsg)
			return {
				handled: true,
				feedbackIds: ['matrixNodeDelayEnableAll', 'matrixNodeDelayEnable'],
			}
		}
	}

	if (path.includes('/soundobjectrouting/mute/') && (isMultiValue || isWildcard)) {
		if (!routeHasConcreteIndex(address, { match: '/soundobjectrouting/mute/' })) {
			applyBulkSoundObjectRoutingMute(self, oscMsg)
			return {
				handled: true,
				feedbackIds: ['soundObjectRoutingMuteAll', 'soundObjectRoutingMute'],
			}
		}
	}

	for (const route of BULK_DISCRETE_ROUTES) {
		if (!path.includes(route.match)) continue

		let applied = false
		if (isMultiValue) {
			applied = applyBulk1DValues(self, route, values)
		} else {
			const acc = accumulateWildcardSingle(self, route, values[0])
			if (!acc.flushed) return { handled: true, deferFeedback: true }
			applied = true
		}
		if (!applied) return { handled: false }
		return {
			handled: true,
			feedbackIds: [...route.allFeedbackIds, ...route.individualFeedbackIds],
		}
	}

	return { handled: false }
}
