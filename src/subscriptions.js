/**
 * Subscription-based OSC polling.
 *
 * Companion calls subscribe/unsubscribe on actions and feedbacks when buttons
 * use them. We ref-count OSC query paths and only poll what is currently needed.
 */

function optionNumber(options, key, fallback = 1) {
	const raw = options?.[key]
	const value = typeof raw === 'object' && raw !== null && 'value' in raw ? raw.value : raw
	const num = Number(value)
	return Number.isFinite(num) ? num : fallback
}

/** Map action/feedback definitionId -> OSC paths to poll for those options */
const PATH_BUILDERS = {
	// Matrix Input
	matrixInputMute: (o) => [`/matrixinput/mute/${optionNumber(o, 'matrixinput')}`],
	matrixInputGain: (o) => [`/matrixinput/gain/${optionNumber(o, 'matrixinput')}`],
	matrixInputDelay: (o) => [`/matrixinput/delay/${optionNumber(o, 'matrixinput')}`],
	matrixInputDelayEnable: (o) => [`/matrixinput/delayenable/${optionNumber(o, 'matrixinput')}`],
	matrixInputEQEnable: (o) => [`/matrixinput/eqenable/${optionNumber(o, 'matrixinput')}`],
	matrixInputPolarity: (o) => [`/matrixinput/polarity/${optionNumber(o, 'matrixinput')}`],
	matrixInputChannelName: (o) => [`/matrixinput/channelname/${optionNumber(o, 'matrixinput')}`],
	matrixInputLevelMeterPreMute: (o) => [`/matrixinput/levelmeterpremute/${optionNumber(o, 'matrixinput')}`],
	matrixInputLevelMeterPostMute: (o) => [`/matrixinput/levelmeterpostmute/${optionNumber(o, 'matrixinput')}`],
	matrixInputReverbSendGain: (o) => [`/matrixinput/reverbsendgain/${optionNumber(o, 'matrixinput')}`],

	setMatrixInputMute: (o) => PATH_BUILDERS.matrixInputMute(o),
	setMatrixInputGain: (o) => PATH_BUILDERS.matrixInputGain(o),
	increaseMatrixInputGain: (o) => PATH_BUILDERS.matrixInputGain(o),
	decreaseMatrixInputGain: (o) => PATH_BUILDERS.matrixInputGain(o),
	setMatrixInputDelay: (o) => PATH_BUILDERS.matrixInputDelay(o),
	increaseMatrixInputDelay: (o) => PATH_BUILDERS.matrixInputDelay(o),
	decreaseMatrixInputDelay: (o) => PATH_BUILDERS.matrixInputDelay(o),
	setMatrixInputDelayEnable: (o) => PATH_BUILDERS.matrixInputDelayEnable(o),
	setMatrixInputEqEnable: (o) => PATH_BUILDERS.matrixInputEQEnable(o),
	setMatrixInputPolarity: (o) => PATH_BUILDERS.matrixInputPolarity(o),
	setMatrixInputChannelName: (o) => PATH_BUILDERS.matrixInputChannelName(o),
	setMatrixInputReverbSendGain: (o) => PATH_BUILDERS.matrixInputReverbSendGain(o),
	increaseMatrixInputReverbSendGain: (o) => PATH_BUILDERS.matrixInputReverbSendGain(o),
	decreaseMatrixInputReverbSendGain: (o) => PATH_BUILDERS.matrixInputReverbSendGain(o),

	// Matrix Node
	matrixNodeEnable: (o) => [
		`/matrixnode/enable/${optionNumber(o, 'matrixinput')}/${optionNumber(o, 'matrixoutput')}`,
	],
	matrixNodeGain: (o) => [`/matrixnode/gain/${optionNumber(o, 'matrixinput')}/${optionNumber(o, 'matrixoutput')}`],
	matrixNodeDelayEnable: (o) => [
		`/matrixnode/delayenable/${optionNumber(o, 'matrixinput')}/${optionNumber(o, 'matrixoutput')}`,
	],
	matrixNodeDelay: (o) => [`/matrixnode/delay/${optionNumber(o, 'matrixinput')}/${optionNumber(o, 'matrixoutput')}`],

	setMatrixNodeEnable: (o) => PATH_BUILDERS.matrixNodeEnable(o),
	setMatrixNodeGain: (o) => PATH_BUILDERS.matrixNodeGain(o),
	increaseMatrixNodeGain: (o) => PATH_BUILDERS.matrixNodeGain(o),
	decreaseMatrixNodeGain: (o) => PATH_BUILDERS.matrixNodeGain(o),
	setMatrixNodeDelayEnable: (o) => PATH_BUILDERS.matrixNodeDelayEnable(o),
	setMatrixNodeDelay: (o) => PATH_BUILDERS.matrixNodeDelay(o),
	increaseMatrixNodeDelay: (o) => PATH_BUILDERS.matrixNodeDelay(o),
	decreaseMatrixNodeDelay: (o) => PATH_BUILDERS.matrixNodeDelay(o),

	// Matrix Output
	matrixOutputMute: (o) => [`/matrixoutput/mute/${optionNumber(o, 'matrixoutput')}`],
	matrixOutputGain: (o) => [`/matrixoutput/gain/${optionNumber(o, 'matrixoutput')}`],
	matrixOutputDelay: (o) => [`/matrixoutput/delay/${optionNumber(o, 'matrixoutput')}`],
	matrixOutputDelayEnable: (o) => [`/matrixoutput/delayenable/${optionNumber(o, 'matrixoutput')}`],
	matrixOutputEQEnable: (o) => [`/matrixoutput/eqenable/${optionNumber(o, 'matrixoutput')}`],
	matrixOutputPolarity: (o) => [`/matrixoutput/polarity/${optionNumber(o, 'matrixoutput')}`],
	matrixOutputChannelName: (o) => [`/matrixoutput/channelname/${optionNumber(o, 'matrixoutput')}`],
	matrixOutputLevelMeterPreMute: (o) => [`/matrixoutput/levelmeterpremute/${optionNumber(o, 'matrixoutput')}`],
	matrixOutputLevelMeterPostMute: (o) => [`/matrixoutput/levelmeterpostmute/${optionNumber(o, 'matrixoutput')}`],

	setMatrixOutputMute: (o) => PATH_BUILDERS.matrixOutputMute(o),
	setMatrixOutputGain: (o) => PATH_BUILDERS.matrixOutputGain(o),
	increaseMatrixOutputGain: (o) => PATH_BUILDERS.matrixOutputGain(o),
	decreaseMatrixOutputGain: (o) => PATH_BUILDERS.matrixOutputGain(o),
	setMatrixOutputDelay: (o) => PATH_BUILDERS.matrixOutputDelay(o),
	increaseMatrixOutputDelay: (o) => PATH_BUILDERS.matrixOutputDelay(o),
	decreaseMatrixOutputDelay: (o) => PATH_BUILDERS.matrixOutputDelay(o),
	setMatrixOutputDelayEnable: (o) => PATH_BUILDERS.matrixOutputDelayEnable(o),
	setMatrixOutputEqEnable: (o) => PATH_BUILDERS.matrixOutputEQEnable(o),
	setMatrixOutputPolarity: (o) => PATH_BUILDERS.matrixOutputPolarity(o),
	setMatrixOutputChannelName: (o) => PATH_BUILDERS.matrixOutputChannelName(o),
	setMatrixOutputLevelMeterPreMute: (o) => PATH_BUILDERS.matrixOutputLevelMeterPreMute(o),
	increaseMatrixOutputLevelMeterPreMute: (o) => PATH_BUILDERS.matrixOutputLevelMeterPreMute(o),
	decreaseMatrixOutputLevelMeterPreMute: (o) => PATH_BUILDERS.matrixOutputLevelMeterPreMute(o),
	setMatrixOutputLevelMeterPostMute: (o) => PATH_BUILDERS.matrixOutputLevelMeterPostMute(o),
	increaseMatrixOutputLevelMeterPostMute: (o) => PATH_BUILDERS.matrixOutputLevelMeterPostMute(o),
	decreaseMatrixOutputLevelMeterPostMute: (o) => PATH_BUILDERS.matrixOutputLevelMeterPostMute(o),

	// Positioning
	positioningSourceSpread: (o) => [`/positioning/source_spread/${optionNumber(o, 'matrixinput')}`],
	positioningSourceDelayMode: (o) => [`/positioning/source_delaymode/${optionNumber(o, 'matrixinput')}`],
	positioningSourcePosition: (o) => [`/positioning/source_position/${optionNumber(o, 'matrixinput')}`],
	positioningSourcePositionX: (o) => [`/positioning/source_position_x/${optionNumber(o, 'matrixinput')}`],
	positioningSourcePositionY: (o) => [`/positioning/source_position_y/${optionNumber(o, 'matrixinput')}`],

	setPositioningSourceSpread: (o) => PATH_BUILDERS.positioningSourceSpread(o),
	increasePositioningSourceSpread: (o) => PATH_BUILDERS.positioningSourceSpread(o),
	decreasePositioningSourceSpread: (o) => PATH_BUILDERS.positioningSourceSpread(o),
	setPositioningSourceDelayMode: (o) => PATH_BUILDERS.positioningSourceDelayMode(o),
	setPositioningSourcePosition: (o) => PATH_BUILDERS.positioningSourcePosition(o),
	setPositioningSourcePositionXY: (o) => [
		`/positioning/source_position_xy/${optionNumber(o, 'matrixinput')}`,
		`/positioning/source_position_x/${optionNumber(o, 'matrixinput')}`,
		`/positioning/source_position_y/${optionNumber(o, 'matrixinput')}`,
	],
	setPositioningSourcePositionX: (o) => PATH_BUILDERS.positioningSourcePositionX(o),
	increasePositioningSourcePositionX: (o) => PATH_BUILDERS.positioningSourcePositionX(o),
	decreasePositioningSourcePositionX: (o) => PATH_BUILDERS.positioningSourcePositionX(o),
	setPositioningSourcePositionY: (o) => PATH_BUILDERS.positioningSourcePositionY(o),
	increasePositioningSourcePositionY: (o) => PATH_BUILDERS.positioningSourcePositionY(o),
	decreasePositioningSourcePositionY: (o) => PATH_BUILDERS.positioningSourcePositionY(o),

	// Coordinate mapping
	coordinateMappingSourcePosition: (o) => [
		`/coordinatemapping/source_position/${optionNumber(o, 'mapping')}/${optionNumber(o, 'matrixinput')}`,
	],
	coordinateMappingSourcePositionX: (o) => [
		`/coordinatemapping/source_position_x/${optionNumber(o, 'mapping')}/${optionNumber(o, 'matrixinput')}`,
	],
	coordinateMappingSourcePositionY: (o) => [
		`/coordinatemapping/source_position_y/${optionNumber(o, 'mapping')}/${optionNumber(o, 'matrixinput')}`,
	],

	setCoordinateMappingSourcePosition: (o) => PATH_BUILDERS.coordinateMappingSourcePosition(o),
	setCoordinateMappingSourcePositionXY: (o) => [
		`/coordinatemapping/source_position_xy/${optionNumber(o, 'mapping')}/${optionNumber(o, 'matrixinput')}`,
		...PATH_BUILDERS.coordinateMappingSourcePositionX(o),
		...PATH_BUILDERS.coordinateMappingSourcePositionY(o),
	],
	setCoordinateMappingSourcePositionX: (o) => PATH_BUILDERS.coordinateMappingSourcePositionX(o),
	increaseCoordinateMappingSourcePositionX: (o) => PATH_BUILDERS.coordinateMappingSourcePositionX(o),
	decreaseCoordinateMappingSourcePositionX: (o) => PATH_BUILDERS.coordinateMappingSourcePositionX(o),
	setCoordinateMappingSourcePositionY: (o) => PATH_BUILDERS.coordinateMappingSourcePositionY(o),
	increaseCoordinateMappingSourcePositionY: (o) => PATH_BUILDERS.coordinateMappingSourcePositionY(o),
	decreaseCoordinateMappingSourcePositionY: (o) => PATH_BUILDERS.coordinateMappingSourcePositionY(o),

	// En-Space / matrix settings
	matrixSettingsReverbRoomId: () => ['/matrixsettings/reverbroomid'],
	matrixSettingsReverbPreDelayFactor: () => ['/matrixsettings/reverbpredelayfactor'],
	matrixSettingsReverbRearLevel: () => ['/matrixsettings/reverbrearlevel'],
	setMatrixSettingsReverbRoomId: () => PATH_BUILDERS.matrixSettingsReverbRoomId(),
	setMatrixSettingsReverbPreDelayFactor: () => PATH_BUILDERS.matrixSettingsReverbPreDelayFactor(),
	increaseMatrixSettingsReverbPreDelayFactor: () => PATH_BUILDERS.matrixSettingsReverbPreDelayFactor(),
	decreaseMatrixSettingsReverbPreDelayFactor: () => PATH_BUILDERS.matrixSettingsReverbPreDelayFactor(),
	setMatrixSettingsReverbRearLevel: () => PATH_BUILDERS.matrixSettingsReverbRearLevel(),
	increaseMatrixSettingsReverbRearLevel: () => PATH_BUILDERS.matrixSettingsReverbRearLevel(),
	decreaseMatrixSettingsReverbRearLevel: () => PATH_BUILDERS.matrixSettingsReverbRearLevel(),

	// Reverb input
	reverbInputGain: (o) => [`/reverbinput/gain/${optionNumber(o, 'matrixinput')}`],
	setReverbInputGain: (o) => PATH_BUILDERS.reverbInputGain(o),
	increaseReverbInputGain: (o) => PATH_BUILDERS.reverbInputGain(o),
	decreaseReverbInputGain: (o) => PATH_BUILDERS.reverbInputGain(o),

	reverbInputProcessingMute: (o) => [`/reverbinputprocessing/mute/${optionNumber(o, 'matrixinput')}`],
	reverbInputProcessingGain: (o) => [`/reverbinputprocessing/gain/${optionNumber(o, 'matrixinput')}`],
	reverbInputProcessingLevelMeter: (o) => [`/reverbinputprocessing/levelmeter/${optionNumber(o, 'matrixinput')}`],
	reverbInputProcessingEQEnable: (o) => [`/reverbinputprocessing/eqenable/${optionNumber(o, 'matrixinput')}`],

	setReverbInputProcessingMute: (o) => PATH_BUILDERS.reverbInputProcessingMute(o),
	setReverbInputProcessingGain: (o) => PATH_BUILDERS.reverbInputProcessingGain(o),
	increaseReverbInputProcessingGain: (o) => PATH_BUILDERS.reverbInputProcessingGain(o),
	decreaseReverbInputProcessingGain: (o) => PATH_BUILDERS.reverbInputProcessingGain(o),
	setReverbInputProcessingLevelMeter: (o) => PATH_BUILDERS.reverbInputProcessingLevelMeter(o),
	increaseReverbInputProcessingLevelMeter: (o) => PATH_BUILDERS.reverbInputProcessingLevelMeter(o),
	decreaseReverbInputProcessingLevelMeter: (o) => PATH_BUILDERS.reverbInputProcessingLevelMeter(o),
	setReverbInputProcessingEqEnable: (o) => PATH_BUILDERS.reverbInputProcessingEQEnable(o),

	// Scenes
	sceneIndex: () => ['/scene/sceneindex', '/scene/scenename', '/scene/scenecomment'],
	recallScenePrevious: () => PATH_BUILDERS.sceneIndex(),
	recallSceneNext: () => PATH_BUILDERS.sceneIndex(),
	recallSceneMajor: () => PATH_BUILDERS.sceneIndex(),
	recallSceneMajorMinor: () => PATH_BUILDERS.sceneIndex(),

	// Sound Object Routing
	soundObjectRoutingMute: (o) => [
		`/soundobjectrouting/mute/${optionNumber(o, 'functiongroup')}/${optionNumber(o, 'soundobject')}`,
	],
	soundObjectRoutingGain: (o) => [
		`/soundobjectrouting/gain/${optionNumber(o, 'functiongroup')}/${optionNumber(o, 'soundobject')}`,
	],
	setSoundObjectRoutingMute: (o) => PATH_BUILDERS.soundObjectRoutingMute(o),
	toggleSoundObjectRoutingMute: (o) => PATH_BUILDERS.soundObjectRoutingMute(o),
	setSoundObjectRoutingGain: (o) => PATH_BUILDERS.soundObjectRoutingGain(o),
	increaseSoundObjectRoutingGain: (o) => PATH_BUILDERS.soundObjectRoutingGain(o),
	decreaseSoundObjectRoutingGain: (o) => PATH_BUILDERS.soundObjectRoutingGain(o),

	// Function groups
	functionGroupName: (o) => [`/functiongroup/name/${optionNumber(o, 'functiongroup')}`],
	functionGroupSpreadFactor: (o) => [`/functiongroup/spreadfactor/${optionNumber(o, 'functiongroup')}`],
	functionGroupDelay: (o) => [`/functiongroup/delay/${optionNumber(o, 'functiongroup')}`],
	setFunctionGroupSpreadFactor: (o) => PATH_BUILDERS.functionGroupSpreadFactor(o),
	increaseFunctionGroupSpreadFactor: (o) => PATH_BUILDERS.functionGroupSpreadFactor(o),
	decreaseFunctionGroupSpreadFactor: (o) => PATH_BUILDERS.functionGroupSpreadFactor(o),
	setFunctionGroupDelay: (o) => PATH_BUILDERS.functionGroupDelay(o),
	increaseFunctionGroupDelay: (o) => PATH_BUILDERS.functionGroupDelay(o),
	decreaseFunctionGroupDelay: (o) => PATH_BUILDERS.functionGroupDelay(o),
}

/** Lightweight status queries always polled when polling is enabled (with discrete interval) */
const CORE_STATUS_PATHS = [
	'/status/matrixinputcount',
	'/status/matrixoutputcount',
	'/error/gnrlerr',
	'/error/errortext',
	'/settings/devicename',
	'/status/statustext',
	'/status/audionetworksamplestatus',
]

/**
 * Classify an OSC path for dual-interval polling.
 * - discrete: switches / rarely changing (mute, enable, names, scene, …)
 * - continuous: live values (gain, meters, positions, delay ms, …)
 */
function classifyPollPath(path) {
	const p = String(path || '').toLowerCase()

	// Check multi-word discrete tokens before generic /delay/
	if (
		p.includes('/delayenable') ||
		p.includes('/eqenable') ||
		p.includes('/delaymode') ||
		p.includes('/reverbroomid') ||
		p.includes('/sceneindex') ||
		p.includes('/scenename') ||
		p.includes('/scenecomment') ||
		p.includes('/channelname') ||
		p.includes('/polarity') ||
		p.includes('/mute') ||
		/\/enable(\/|$)/.test(p) ||
		/\/name(\/|$)/.test(p) ||
		/\/flip(\/|$)/.test(p)
	) {
		return 'discrete'
	}

	return 'continuous'
}

module.exports = {
	PATH_BUILDERS,
	CORE_STATUS_PATHS,
	classifyPollPath,

	initSubscriptions() {
		this.pollSubscriptions = new Map() // path -> refCount
	},

	isSubscribedPollingEnabled() {
		// Default to subscribed mode when polling is on
		if (this.config?.pollMode === 'full') return false
		return true
	},

	addPollSubscription(path) {
		if (!path || typeof path !== 'string') return
		if (!this.pollSubscriptions) this.initSubscriptions()

		const count = this.pollSubscriptions.get(path) || 0
		this.pollSubscriptions.set(path, count + 1)

		// Immediate one-shot query so UI fills without waiting for next poll tick
		if (this.oscReady) {
			this.sendCommand(path, [])
		}
	},

	removePollSubscription(path) {
		if (!path || !this.pollSubscriptions) return
		const count = this.pollSubscriptions.get(path) || 0
		if (count <= 1) {
			this.pollSubscriptions.delete(path)
		} else {
			this.pollSubscriptions.set(path, count - 1)
		}
	},

	subscribeDefinition(definitionId, options) {
		const builder = PATH_BUILDERS[definitionId]
		if (!builder) return
		const paths = builder(options) || []
		for (const path of paths) {
			this.addPollSubscription(path)
		}
	},

	unsubscribeDefinition(definitionId, options) {
		const builder = PATH_BUILDERS[definitionId]
		if (!builder) return
		const paths = builder(options) || []
		for (const path of paths) {
			this.removePollSubscription(path)
		}
	},

	/**
	 * Attach subscribe/unsubscribe hooks to action or feedback definitions
	 * so Companion notifies us when buttons start/stop using them.
	 */
	attachPollSubscriptions(definitions) {
		const self = this

		for (const [definitionId, definition] of Object.entries(definitions)) {
			if (!PATH_BUILDERS[definitionId]) continue

			const previousSubscribe = definition.subscribe
			const previousUnsubscribe = definition.unsubscribe

			definition.subscribe = async function (entity, context) {
				self.subscribeDefinition(definitionId, entity.options)
				if (typeof previousSubscribe === 'function') {
					await previousSubscribe.call(this, entity, context)
				}
			}

			definition.unsubscribe = async function (entity, context) {
				self.unsubscribeDefinition(definitionId, entity.options)
				if (typeof previousUnsubscribe === 'function') {
					await previousUnsubscribe.call(this, entity, context)
				}
			}
		}

		return definitions
	},

	getSubscribedPollPaths(kind) {
		if (!this.pollSubscriptions) return []
		const paths = Array.from(this.pollSubscriptions.keys()).sort()
		if (!kind) return paths
		return paths.filter((path) => classifyPollPath(path) === kind)
	},
}
