// d&b audiotechnik Soundscape Processors (fork of companion-module-dbaudiotechnik-dsp)
import { InstanceBase } from '@companion-module/base'
import UpgradeScripts from './src/upgrades.js'

import config from './src/config.js'

import actions from './src/actions.js'
import feedbacks from './src/feedbacks.js'
import variables from './src/variables.js'
import presets from './src/presets.js'

import api from './src/api.js'

import constants from './src/constants.js'
import subscriptions from './src/subscriptions.js'

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

export default dbaudiotechnikDspInstance
export { UpgradeScripts }
