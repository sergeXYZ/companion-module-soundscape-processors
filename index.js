// d&b audiotechnik Soundscape Processors (fork of companion-module-dbaudiotechnik-dsp)
const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const upgrades = require('./src/upgrades')

const config = require('./src/config')

const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const presets = require('./src/presets')

const api = require('./src/api')

const constants = require('./src/constants')
const subscriptions = require('./src/subscriptions')

class dbaudiotechnikDspInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,

			...actions,
			...feedbacks,
			...variables,
			...presets,

			...api,

			...constants,
			...subscriptions,
		})

		this.initSubscriptions()

		//this.instanceOptions.disableVariableValidation = true //reduce the number of visible variables
	}

	async init(config) {
		this.configUpdated(config)
	}

	async destroy() {
		try {
			this.clearPollingTimers()
			clearInterval(this.RECONNECT_INTERVAL)
			clearTimeout(this.feedbackCheckTimer)
		} catch (error) {
			this.log('error', 'destroy error:' + error)
		}
	}

	async configUpdated(config) {
		const previousConfig = this.config
		this.config = config

		// Set matrix counts from configured scalable I/O option. Will be overridden dynamically
		// by /status/matrixinputcount and /status/matrixoutputcount once the device responds.
		const matrixSize = config.matrixSize || 'L'
		if (matrixSize === 'S') {
			this.matrixInputCount = 64
			this.matrixOutputCount = 24
		} else if (matrixSize === 'XL') {
			this.matrixInputCount = 128
			this.matrixOutputCount = 64
		} else {
			// L (Large) – default
			this.matrixInputCount = 64
			this.matrixOutputCount = 64
		}

		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		const connectionChanged =
			!previousConfig ||
			previousConfig.host !== config.host ||
			previousConfig.localPort !== config.localPort ||
			previousConfig.remotePort !== config.remotePort

		if (connectionChanged || !this.oscReady) {
			this.initConnection()
		} else {
			// Polling settings can be applied without tearing down OSC
			this.applyPolling()
		}
	}

	rebuildFromDeviceCounts() {
		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()
	}
}

runEntrypoint(dbaudiotechnikDspInstance, upgrades)
