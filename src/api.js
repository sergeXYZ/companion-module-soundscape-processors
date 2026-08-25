import { InstanceStatus } from '@companion-module/base'
import OSC from 'osc'

export default {
	isPollingEnabled() {
		return this.config?.polling === true || this.config?.polling === 1
	},

	clampPollInterval(value, fallback) {
		const interval = parseInt(value, 10)
		if (!Number.isFinite(interval)) return fallback
		return Math.min(Math.max(interval, 100), 60000)
	},

	getPollInterval() {
		// Legacy single interval (full mode / fallback)
		return this.clampPollInterval(this.config?.pollInterval, 500)
	},

	getContinuousPollInterval() {
		const legacy = this.config?.pollInterval
		const value = this.config?.pollIntervalContinuous ?? legacy
		return this.clampPollInterval(value, 500)
	},

	getDiscretePollInterval() {
		const legacy = this.config?.pollInterval
		const fallback = Number.isFinite(parseInt(legacy, 10)) ? Math.min(Math.max(parseInt(legacy, 10) * 4, 1000), 60000) : 2000
		const value = this.config?.pollIntervalDiscrete
		return this.clampPollInterval(value, fallback)
	},

	clearPollingTimers() {
		clearInterval(this.INTERVAL)
		clearInterval(this.INTERVAL_CONTINUOUS)
		clearInterval(this.INTERVAL_DISCRETE)
		this.INTERVAL = undefined
		this.INTERVAL_CONTINUOUS = undefined
		this.INTERVAL_DISCRETE = undefined
	},

	applyPolling() {
		let self = this

		self.clearPollingTimers()

		if (!self.isPollingEnabled()) {
			self.log('info', 'Polling disabled')
			return
		}

		const mode = self.isSubscribedPollingEnabled() ? 'subscribed' : 'full'

		if (mode === 'full') {
			const pollInterval = self.getPollInterval()
			self.log('info', `Polling enabled (${pollInterval}ms, mode=full)`)
			self.INTERVAL = setInterval(() => {
				self.getFullData()
			}, pollInterval)
			self.getFullData()
			return
		}

		const continuousMs = self.getContinuousPollInterval()
		const discreteMs = self.getDiscretePollInterval()
		self.log(
			'info',
			`Polling enabled (continuous=${continuousMs}ms, discrete=${discreteMs}ms, mode=subscribed)`
		)

		self.INTERVAL_CONTINUOUS = setInterval(() => {
			self.getSubscribedData('continuous')
		}, continuousMs)

		self.INTERVAL_DISCRETE = setInterval(() => {
			self.getSubscribedData('discrete')
		}, discreteMs)

		// Fill UI immediately
		self.getSubscribedData('continuous')
		self.getSubscribedData('discrete')
	},

	scheduleFeedbackCheck() {
		let self = this

		if (self.feedbackCheckTimer) return

		self.feedbackCheckTimer = setTimeout(() => {
			self.feedbackCheckTimer = null
			self.checkFeedbacks()
		}, 50)
	},

	async initConnection() {
		let self = this

		//clear any existing intervals
		self.clearPollingTimers()
		clearInterval(self.RECONNECT_INTERVAL)

		if (self.config.host && self.config.host !== '') {
			self.updateStatus(InstanceStatus.Connecting)
			self.buildDefaultValues()
			self.initOSC()
		}
	},

	buildDefaultValues() {
		let self = this

		const previousSpecialInput = Number(self.DATA?.specialEnSpaceInput)
		const specialEnSpaceInput =
			Number.isFinite(previousSpecialInput) && previousSpecialInput >= 1
				? Math.min(previousSpecialInput, self.matrixInputCount || 1)
				: 1

		self.DATA = {
			// General error and status data
			generalError: null,
			errorText: '',
			deviceName: '',
			statusText: '',
			audioNetworkSampleStatus: null,

			/** Special Presets: shared Matrix Input for En-Space Input Bank */
			specialEnSpaceInput,

				// Matrix input data
			matrixInput: Array.from({ length: self.matrixInputCount + 1 }, () => ({
				mute: null,
				gain: null,
				delay: null,
				delayEnable: null,
				eqEnable: null,
				polarity: null,
				channelName: '',
				levelMeterPreMute: null,
				levelMeterPostMute: null,
				reverbSendGain: null,
			})),

				// Matrix output data
			matrixOutput: Array.from({ length: self.matrixOutputCount + 1 }, () => ({
				mute: null,
				gain: null,
				delay: null,
				delayEnable: null,
				eqEnable: null,
				polarity: null,
				channelName: '',
				levelMeterPreMute: null,
				levelMeterPostMute: null,
			})),

				// Matrix node data
			matrixNode: Array.from({ length: self.matrixInputCount + 1 }, () =>
				Array.from({ length: self.matrixOutputCount + 1 }, () => ({
					enable: null,
					gain: null,
					delay: null,
					delayEnable: null,
				}))
			),

			// Positioning data (per sound object, indexed by matrix input id)
			positioning: Array.from({ length: self.matrixInputCount + 1 }, () => ({
				sourceSpread: null,
				sourceDelayMode: null,
				sourcePositionX: null,
				sourcePositionY: null,
				sourcePositionZ: null,
			})),
			positioningDelayModeAll: null,

			// Speaker position data (per matrix output)
			speakerPosition: Array.from({ length: self.matrixOutputCount + 1 }, () => ({
				x: null,
				y: null,
				z: null,
				h: null,
				v: null,
			})),

			// Reverb input matrix (En-Space): input × zone (1–4)
			reverbInput: Array.from({ length: self.matrixInputCount + 1 }, () =>
				Array.from({ length: 5 }, () => ({ gain: null }))
			),

			// Reverb input processing data
			reverbInputProcessing: Array.from({ length: self.matrixInputCount + 1 }, () => ({
				mute: null,
				gain: null,
				levelMeter: null,
				eqEnable: null,
			})),

			// Scene data
			sceneIndex: null,
			sceneName: '',
			sceneComment: '',

				// Coordinate mapping data
			coordinateMapping: Array.from({ length: self.matrixInputCount + 1 }, () =>
				Array.from({ length: self.matrixOutputCount + 1 }, () => ({
					sourcePositionX: null,
					sourcePositionY: null,
					sourcePositionZ: null,
				}))
			),

			// Coordinate mapping settings
			coordinateMappingSettings: {
				p1Real: Array(5).fill(null),
				p2Real: Array(5).fill(null),
				p3Real: Array(5).fill(null),
				p4Real: Array(5).fill(null),
				p1Virtual: Array(5).fill(null),
				p3Virtual: Array(5).fill(null),
				flip: Array(5).fill(null),
				name: Array(5).fill(''),
			},

			// Matrix settings
			matrixSettings: {
				reverbRoomId: null,
				reverbPreDelayFactor: null,
				reverbRearLevel: null,
			},

			// Sound object routing data (functiongroup 1-32 x matrixInput 1-[iii])
			soundObjectRouting: Array.from({ length: 33 }, () =>
				Array.from({ length: self.matrixInputCount + 1 }, () => ({
					mute: null,
					gain: null,
				}))
			),

			// Function group data (1-32)
			functionGroup: Array.from({ length: 33 }, () => ({
				name: '',
				spreadFactor: null,
				delay: null,
			})),
		}
	},

	initOSC() {
		let self = this

		self.oscReady = false

		if (self.osc) {
			try {
				self.osc.close()
				delete self.osc
			} catch (e) {
				// Ignore
			}
		}

		const localPort = parseInt(self.config.localPort, 10) || 50011
		const remotePort = parseInt(self.config.remotePort, 10) || 50010

		self.log('info', `Opening connection to ${self.config.host} (listen ${localPort}, send ${remotePort})`)

		self.osc = new OSC.UDPPort({
			localAddress: '0.0.0.0',
			remoteAddress: self.config.host,
			localPort: localPort,
			remotePort: remotePort,
			broadcast: true,
			metadata: true,
		})

		self.osc.on('message', (oscMsg, timeTag, info) => {
			if (self.config.verbose) {
				self.log('info', `Received OSC from ${info?.address}:${info?.port} - ${oscMsg?.address}`)
			}

			self.processResponse(oscMsg)
		})

		self.osc.on('ready', () => {
			self.oscReady = true
			self.log('info', `OSC port is in "ready" state (listening on ${localPort})`)
			self.updateStatus(InstanceStatus.Ok)
			self.getData()
			self.applyPolling()
		})

		self.osc.on('close', () => {
			self.oscReady = false
			self.log('info', 'OSC port is closed')
			self.updateStatus(InstanceStatus.ConnectionFailure, 'Connection Closed')

			//try to reconnect
			self.RECONNECT_INTERVAL = setInterval(() => {
				self.initConnection()
			}, 30000) //30 seconds
		})

		self.osc.on('error', (err) => {
			self.oscReady = false
			const message = err?.message || String(err)

			if (message.includes('EADDRINUSE')) {
				self.log(
					'error',
					`UDP port ${localPort} is already in use. Stop other OSC tools using this port (e.g. another Companion connection or bridge) or change "OSC Port to Listen To".`
				)
				self.updateStatus(
					InstanceStatus.ConnectionFailure,
					`Port ${localPort} already in use`
				)
			} else {
				self.log('error', `OSC error: ${message}`)
				self.updateStatus(InstanceStatus.UnknownError, message)
			}
		})

		// Open the socket.
		self.osc.open()

		if (self.config.verbose) {
			self.log('debug', `OSC Init finished.`)
		}
	},

	getData: function () {
		let self = this

		if (self.isSubscribedPollingEnabled()) {
			self.getSubscribedData('continuous')
			self.getSubscribedData('discrete')
		} else {
			self.getFullData()
		}
	},

	getSubscribedData: function (kind = 'continuous') {
		let self = this

		if (kind === 'discrete') {
			const corePaths = self.CORE_STATUS_PATHS || []
			for (const path of corePaths) {
				self.sendCommand(path, [])
			}
		}

		const subscribed = self.getSubscribedPollPaths(kind)
		if (self.config.verbose) {
			self.log(
				'debug',
				`Subscribed ${kind} poll paths (${subscribed.length}): ${subscribed.join(', ') || '(none)'}`
			)
		}

		for (const path of subscribed) {
			self.sendCommand(path, [])
		}
	},

	getFullData: function () {
		let self = this

		self.sendCommand('/status/matrixinputcount', [])
		self.sendCommand('/status/matrixoutputcount', [])

		self.sendCommand('/error/gnrlerr', [])
		self.sendCommand('/error/errortext', [])

		self.sendCommand('/settings/devicename', [])

		self.sendCommand('/status/statustext', [])
		self.sendCommand('/status/audionetworksamplestatus', [])

		self.sendCommand('/matrixinput/mute/*', [])
		self.sendCommand('/matrixinput/gain/*', [])
		self.sendCommand('/matrixinput/delay/*', [])
		self.sendCommand('/matrixinput/delayenable/*', [])
		self.sendCommand('/matrixinput/eqenable/*', [])
		self.sendCommand('/matrixinput/polarity/*', [])
		self.sendCommand('/matrixinput/channelname/*', [])
		self.sendCommand('/matrixinput/levelmeterpremute/*', [])
		self.sendCommand('/matrixinput/levelmeterpostmute/*', [])

		self.sendCommand('/matrixnode/enable/*/*', [])
		self.sendCommand('/matrixnode/gain/*/*', [])
		self.sendCommand('/matrixnode/delayenable/*/*', [])
		self.sendCommand('/matrixnode/delay/*/*', [])

		self.sendCommand('/matrixoutput/mute/*', [])
		self.sendCommand('/matrixoutput/gain/*', [])
		self.sendCommand('/matrixoutput/delay/*', [])
		self.sendCommand('/matrixoutput/delayenable/*', [])
		self.sendCommand('/matrixoutput/eqenable/*', [])
		self.sendCommand('/matrixoutput/polarity/*', [])
		self.sendCommand('/matrixoutput/channelname/*', [])
		self.sendCommand('/matrixoutput/levelmeterpremute/*', [])
		self.sendCommand('/matrixoutput/levelmeterpostmute/*', [])

		self.sendCommand('/positioning/source_spread/*', [])
		self.sendCommand('/positioning/source_delaymode/*', [])
		self.sendCommand('/positioning/source_position/*', [])
		self.sendCommand('/positioning/source_position_xy/*', [])
		self.sendCommand('/positioning/source_position_x/*', [])
		self.sendCommand('/positioning/source_position_y/*', [])

		self.sendCommand('/coordinatemapping/source_position/*/*', [])
		self.sendCommand('/coordinatemapping/source_position_xy/*/*', [])
		self.sendCommand('/coordinatemapping/source_position_x/*/*', [])
		self.sendCommand('/coordinatemapping/source_position_y/*/*', [])

		self.sendCommand('/matrixsettings/reverbroomid', [])
		self.sendCommand('/matrixsettings/reverbpredelayfactor', [])
		self.sendCommand('/matrixsettings/reverbrearlevel', [])

		self.sendCommand('/matrixinput/reverbsendgain/*', [])

		self.sendCommand('/reverbinput/gain/*/*', [])

		self.sendCommand('/reverbinputprocessing/mute/*', [])
		self.sendCommand('/reverbinputprocessing/gain/*', [])
		self.sendCommand('/reverbinputprocessing/levelmeter/*', [])
		self.sendCommand('/reverbinputprocessing/eqenable/*', [])

		self.sendCommand('/scene/sceneindex', [])
		self.sendCommand('/scene/scenename', [])
		self.sendCommand('/scene/scenecomment', [])

		self.sendCommand('/soundobjectrouting/mute/*/*', [])
		self.sendCommand('/soundobjectrouting/gain/*/*', [])

		self.sendCommand('/functiongroup/name/*', [])
		self.sendCommand('/functiongroup/spreadfactor/*', [])
		self.sendCommand('/functiongroup/delay/*', [])

		self.sendCommand('/positioning/speaker_position/*', [])

		self.sendCommand('/coordinatemappingsettings/p1_real/[1-4]', [])
		self.sendCommand('/coordinatemappingsettings/p2_real/[1-4]', [])
		self.sendCommand('/coordinatemappingsettings/p3_real/[1-4]', [])
		self.sendCommand('/coordinatemappingsettings/p4_real/[1-4]', [])
		self.sendCommand('/coordinatemappingsettings/p1_virtual/[1-4]', [])
		self.sendCommand('/coordinatemappingsettings/p3_virtual/[1-4]', [])
		self.sendCommand('/coordinatemappingsettings/flip/[1-4]', [])
		self.sendCommand('/coordinatemappingsettings/name/[1-4]', [])
	},

	sendCommand: function (path, args) {
		let self = this

		//append prefix if set
		if (self.PREFIX && self.PREFIX !== '') {
			path = self.PREFIX + path
		}

		if (self.config.host !== '') {
			if (self.config.verbose) {
				self.log('info', `Sending Command: ${path} with args: ${JSON.stringify(args)}`)
			}

			self.osc.send({
				address: path,
				args,
			})

			self.LAST_COMMAND = {
				path,
				args,
			}
		}
	},

	processResponse: function (oscMsg) {
		let self = this

		const address = oscMsg?.address
		if (!address) {
			return
		}

		if (!oscMsg.args || oscMsg.args.length === 0) {
			if (self.config.verbose) {
				self.log('debug', `OSC message without args: ${address}`)
			}
			return
		}

		const args = oscMsg.args[0]
		const value = args?.value

		if (self.config.verbose) {
			self.log('info', `OSC Content: ${address} = ${JSON.stringify(value)}`)
		}

		try {
			let variableObj = {}

			if (address.indexOf('/status/matrixinputcount') !== -1) {
				const newCount = value
				if (newCount !== self.matrixInputCount) {
					self.matrixInputCount = newCount
					self.buildDefaultValues()
					self.rebuildFromDeviceCounts()
					if (self.config.verbose) {
						self.log('info', `Matrix input count updated to ${newCount}`)
					}
				}
				variableObj = { status_matrixinputcount: newCount }
			} else if (address.indexOf('/status/matrixoutputcount') !== -1) {
				const newCount = value
				if (newCount !== self.matrixOutputCount) {
					self.matrixOutputCount = newCount
					self.buildDefaultValues()
					self.rebuildFromDeviceCounts()
					if (self.config.verbose) {
						self.log('info', `Matrix output count updated to ${newCount}`)
					}
				}
				variableObj = { status_matrixoutputcount: newCount }
			} else if (address.indexOf('/error/gnrlerr') !== -1) {
				self.DATA.generalError = value
				variableObj = { general_error: value }

				if (value === 0) {
					//ok
				} else {
					//error
					self.log('error', `General Error has occurred.`)
				}
			} else if (address.indexOf('/error/errortext') !== -1) {
				self.DATA.errorText = value
				variableObj = { error_text: value }

				if (value !== '' && value !== 'ok') {
					self.log('error', `Error Text: ${value}`)
				}
			} else if (address.indexOf('/settings/devicename') !== -1) {
				self.DATA.deviceName = value
				variableObj = { settings_device_name: value }
			} else if (address.indexOf('/status/statustext') !== -1) {
				self.DATA.statusText = value
				variableObj = { status_text: value }
			} else if (address.indexOf('/status/audionetworksamplestatus') !== -1) {
				self.DATA.audioNetworkSampleStatus = value
				let valueFriendly = ''
				if (value === 4) {
					valueFriendly = '48 kHz'
				} else if (value === 6) {
					valueFriendly = '96 kHz'
				} else if (value === 1) {
					valueFriendly = 'Not in Sync'
				}

				variableObj = { status_audio_network_sample_status: value }
			} else if (address.indexOf('/matrixinput/mute/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.matrixInput[id].mute = value
				let valueFriendly = value === 1 ? 'On' : 'Off'
				variableObj = { [`matrixinput${id}_mute`]: valueFriendly }
			} else if (address.indexOf('/matrixinput/reverbsendgain/') !== -1) {
				// Must be before /matrixinput/gain/ (longer path first)
				let id = address.split('/')[4].toString()
				if (self.DATA?.matrixInput?.[id]) {
					self.DATA.matrixInput[id].reverbSendGain = value
				}
				const gainDisplay = typeof value === 'number' && Number.isFinite(value) ? value.toFixed(2) : value
				variableObj = { [`matrixinput${id}_reverb_send_gain`]: gainDisplay }
			} else if (address.indexOf('/matrixinput/gain/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.matrixInput[id].gain = value
				const gainDisplay = typeof value === 'number' && Number.isFinite(value) ? value.toFixed(2) : value
				variableObj = { [`matrixinput${id}_gain`]: gainDisplay }
			} else if (address.indexOf('/matrixinput/delay/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.matrixInput[id].delay = value
				variableObj = { [`matrixinput${id}_delay`]: value }
			} else if (address.indexOf('/matrixinput/delayenable/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.matrixInput[id].delayEnable = value
				let valueFriendly = value === 1 ? 'On' : 'Off'
				variableObj = { [`matrixinput${id}_delay_enable`]: valueFriendly }
			} else if (address.indexOf('/matrixinput/eqenable/') !== -1) {
				let id = address.split('/')[4].toString()
				//console.log('id was : ' + id)
				self.DATA.matrixInput[id].eqEnable = value
				let valueFriendly = value === 1 ? 'On' : 'Off'
				variableObj = { [`matrixinput${id}_eq_enable`]: valueFriendly }
			} else if (address.indexOf('/matrixinput/polarity/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.matrixInput[id].polarity = value
				let valueFriendly = value === 0 ? 'Normal' : 'Reversed'
				variableObj = { [`matrixinput${id}_polarity`]: valueFriendly }
			} else if (address.indexOf('/matrixinput/channelname/') !== -1) {
				let id = address.split('/')[4].toString()
				//console.log('id was : ' + id)
				self.DATA.matrixInput[id].channelName = value
				variableObj = { [`matrixinput${id}_channel_name`]: value }
			} else if (address.indexOf('/matrixinput/levelmeterpremute/') !== -1) {
				let id = address.split('/')[4].toString()
				//console.log('id was : ' + id)
				self.DATA.matrixInput[id].levelMeterPreMute = value
				variableObj = { [`matrixinput${id}_level_meter_pre_mute`]: value }
			} else if (address.indexOf('/matrixinput/levelmeterpostmute/') !== -1) {
				let id = address.split('/')[4].toString()
				//console.log('id was : ' + id)
				self.DATA.matrixInput[id].levelMeterPostMute = value
				variableObj = { [`matrixinput${id}_level_meter_post_mute`]: value }
			} else if (address.indexOf('/matrixnode/enable/') !== -1) {
				let id = address.split('/')[4].toString()
				let id2 = address.split('/')[5].toString()
				self.DATA.matrixNode[id][id2].enable = value
				let valueFriendly = value === 1 ? 'On' : 'Off'
				variableObj = { [`matrixnode${id}_${id2}_enable`]: valueFriendly }
			} else if (address.indexOf('/matrixnode/gain/') !== -1) {
				let id = address.split('/')[4].toString()
				let id2 = address.split('/')[5].toString()
				self.DATA.matrixNode[id][id2].gain = value
				variableObj = { [`matrixnode${id}_${id2}_gain`]: value }
			} else if (address.indexOf('/matrixnode/delayenable/') !== -1) {
				let id = address.split('/')[4].toString()
				let id2 = address.split('/')[5].toString()
				self.DATA.matrixNode[id][id2].delayEnable = value
				let valueFriendly = value === 1 ? 'On' : 'Off'
				variableObj = { [`matrixnode${id}_${id2}_delay_enable`]: valueFriendly }
			} else if (address.indexOf('/matrixnode/delay/') !== -1) {
				let id = address.split('/')[4].toString()
				let id2 = address.split('/')[5].toString()
				self.DATA.matrixNode[id][id2].delay = value
				variableObj = { [`matrixnode${id}_${id2}_delay`]: value }
			} else if (address.indexOf('/matrixoutput/mute/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.matrixOutput[id].mute = value
				let valueFriendly = value === 1 ? 'On' : 'Off'
				variableObj = { [`matrixoutput${id}_mute`]: valueFriendly }
			} else if (address.indexOf('/matrixoutput/gain/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.matrixOutput[id].gain = value
				variableObj = { [`matrixoutput${id}_gain`]: value }
			} else if (address.indexOf('/matrixoutput/delay/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.matrixOutput[id].delay = value
				variableObj = { [`matrixoutput${id}_delay`]: value }
			} else if (address.indexOf('/matrixoutput/delayenable/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.matrixOutput[id].delayEnable = value
				let valueFriendly = value === 1 ? 'On' : 'Off'
				variableObj = { [`matrixoutput${id}_delay_enable`]: valueFriendly }
			} else if (address.indexOf('/matrixoutput/eqenable/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.matrixOutput[id].eqEnable = value
				let valueFriendly = value === 1 ? 'On' : 'Off'
				variableObj = { [`matrixoutput${id}_eq_enable`]: valueFriendly }
			} else if (address.indexOf('/matrixoutput/polarity/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.matrixOutput[id].polarity = value
				let valueFriendly = value === 0 ? 'Normal' : 'Reversed'
				variableObj = { [`matrixoutput${id}_polarity`]: valueFriendly }
			} else if (address.indexOf('/matrixoutput/channelname/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.matrixOutput[id].channelName = value
				variableObj = { [`matrixoutput${id}_channel_name`]: value }
			} else if (address.indexOf('/matrixoutput/levelmeterpremute/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.matrixOutput[id].levelMeterPreMute = value
				let valueFriendly = value === 1 ? 'On' : 'Off'
				variableObj = { [`matrixoutput${id}_level_meter_pre_mute`]: valueFriendly }
			} else if (address.indexOf('/matrixoutput/levelmeterpostmute/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.matrixOutput[id].levelMeterPostMute = value
				let valueFriendly = value === 1 ? 'On' : 'Off'
				variableObj = { [`matrixoutput${id}_level_meter_post_mute`]: valueFriendly }
			} else if (address.indexOf('/positioning/source_spread/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.positioning[id].sourceSpread = value
				variableObj = { [`positioning_${id}_source_spread`]: value }
			} else if (address.indexOf('/positioning/source_delaymode/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.positioning[id].sourceDelayMode = value
				let valueFriendly = ''
				if (value === 0) {
					valueFriendly = 'Off'
				} else if (value === 1) {
					valueFriendly = 'Tight'
				} else if (value === 2) {
					valueFriendly = 'Full'
				}
				variableObj = { [`positioning_${id}_source_delay_mode`]: valueFriendly }
			} else if (address.indexOf('/positioning/source_position/') !== -1) {
				let id = address.split('/')[4].toString()

				const arg1 = oscMsg['args'][0]
				const arg2 = oscMsg['args'][1]
				const arg3 = oscMsg['args'][2]
				const value1 = arg1['value']
				const value2 = arg2['value']
				const value3 = arg3['value']

				self.DATA.positioning[id].sourcePositionX = value1
				self.DATA.positioning[id].sourcePositionY = value2
				self.DATA.positioning[id].sourcePositionZ = value3
				variableObj = {
					positioning_source_position_x: value1,
					positioning_source_position_y: value2,
					positioning_source_position_z: value3,
				}
			} else if (address.indexOf('/positioning/source_position_xy/') !== -1) {
				let id = address.split('/')[4].toString()

				const arg1 = oscMsg['args'][0]
				const arg2 = oscMsg['args'][1]
				const value1 = arg1['value']
				const value2 = arg2['value']

				self.DATA.positioning[id].sourcePositionX = value1
				self.DATA.positioning[id].sourcePositionY = value2
				variableObj = {
					positioning_source_position_x: value1,
					positioning_source_position_y: value2,
				}
			} else if (address.indexOf('/positioning/source_position_x/') !== -1) {
				let id = address.split('/')[4].toString()

				const arg1 = oscMsg['args'][0]
				const value1 = arg1['value']

				self.DATA.positioning[id].sourcePositionX = value1
				variableObj = {
					positioning_source_position_x: value1,
				}
			} else if (address.indexOf('/positioning/source_position_y/') !== -1) {
				let id = address.split('/')[4].toString()

				const arg1 = oscMsg['args'][0]
				const value1 = arg1['value']

				self.DATA.positioning[id].sourcePositionY = value1
				variableObj = {
					positioning_source_position_y: value1,
				}
			} else if (address.indexOf('/coordinatemapping/source_position/') !== -1) {
				let id = address.split('/')[4].toString()
				let id2 = address.split('/')[5].toString()

				const arg1 = oscMsg['args'][0]
				const arg2 = oscMsg['args'][1]
				const arg3 = oscMsg['args'][2]
				const value1 = arg1['value']
				const value2 = arg2['value']
				const value3 = arg3['value']

				self.DATA.coordinateMapping[id][id2].sourcePositionX = value1
				self.DATA.coordinateMapping[id][id2].sourcePositionY = value2
				self.DATA.coordinateMapping[id][id2].sourcePositionZ = value3
				variableObj = {
					[`coordinatemapping_source_position_${id}_${id2}_x`]: value1,
					[`coordinatemapping_source_position_${id}_${id2}_y`]: value2,
					[`coordinatemapping_source_position_${id}_${id2}_z`]: value3,
				}
			} else if (address.indexOf('/coordinatemapping/source_position_xy/') !== -1) {
				let id = address.split('/')[4].toString()
				let id2 = address.split('/')[5].toString()

				const arg1 = oscMsg['args'][0]
				const arg2 = oscMsg['args'][1]
				const value1 = arg1['value']
				const value2 = arg2['value']

				self.DATA.coordinateMapping[id][id2].sourcePositionX = value1
				self.DATA.coordinateMapping[id][id2].sourcePositionY = value2
				variableObj = {
					[`coordinatemapping_source_position_${id}_${id2}_x`]: value1,
					[`coordinatemapping_source_position_${id}_${id2}_y`]: value2,
				}
			} else if (address.indexOf('/coordinatemapping/source_position_x/') !== -1) {
				let id = address.split('/')[4].toString()
				let id2 = address.split('/')[5].toString()

				const arg1 = oscMsg['args'][0]
				const value1 = arg1['value']

				self.DATA.coordinateMapping[id][id2].sourcePositionX = value1
				variableObj = {
					[`coordinatemapping_source_position_${id}_${id2}_x`]: value1,
				}
			} else if (address.indexOf('/coordinatemapping/source_position_y/') !== -1) {
				let id = address.split('/')[4].toString()
				let id2 = address.split('/')[5].toString()
				const arg1 = oscMsg['args'][0]
				const value1 = arg1['value']

				self.DATA.coordinateMapping[id][id2].sourcePositionY = value1
				variableObj = {
					[`coordinatemapping_source_position_${id}_${id2}_y`]: value1,
				}
			} else if (address.indexOf('/matrixsettings/reverbroomid') !== -1) {
				const roomId = Number(value)
				self.DATA.matrixSettings.reverbRoomId = Number.isFinite(roomId) ? roomId : value

				let valueFriendly = ''
				let reverbRoomObj = self.CHOICES_REVERB_ROOMS.find(
					(item) => Number(item.id) === Number(self.DATA.matrixSettings.reverbRoomId)
				)
				if (reverbRoomObj) {
					valueFriendly = reverbRoomObj.label
				} else if (self.DATA.matrixSettings.reverbRoomId !== null && self.DATA.matrixSettings.reverbRoomId !== undefined) {
					valueFriendly = String(self.DATA.matrixSettings.reverbRoomId)
				}
				variableObj = { matrixsettings_reverb_room_id: valueFriendly }
			} else if (address.indexOf('/matrixsettings/reverbpredelayfactor') !== -1) {
				self.DATA.matrixSettings.reverbPreDelayFactor = value
				variableObj = { matrixsettings_reverb_pre_delay_factor: value }
			} else if (address.indexOf('/matrixsettings/reverbrearlevel') !== -1) {
				self.DATA.matrixSettings.reverbRearLevel = value
				variableObj = { matrixsettings_reverb_rear_level: value }
			} else if (address.indexOf('/reverbinput/gain/') !== -1) {
				let id = address.split('/')[4].toString()
				let id2 = address.split('/')[5]?.toString()
				if (id2 && self.DATA.reverbInput?.[id]?.[id2]) {
					self.DATA.reverbInput[id][id2].gain = value
				}
				const gainDisplay = typeof value === 'number' && Number.isFinite(value) ? value.toFixed(2) : value
				variableObj = { [`reverbinput_gain_${id}_zone${id2}`]: gainDisplay }
			} else if (address.indexOf('/reverbinputprocessing/mute/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.reverbInputProcessing[id].mute = value
				let valueFriendly = value === 1 ? 'On' : 'Off'
				variableObj = { [`reverbinputprocessing_mute_${id}`]: valueFriendly }
			} else if (address.indexOf('/reverbinputprocessing/gain/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.reverbInputProcessing[id].gain = value
				variableObj = { [`reverbinputprocessing_gain_${id}`]: value }
			} else if (address.indexOf('/reverbinputprocessing/levelmeter/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.reverbInputProcessing[id].levelMeter = value
				variableObj = { [`reverbinputprocessing_level_meter_${id}`]: value }
			} else if (address.indexOf('/reverbinputprocessing/eqenable/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.reverbInputProcessing[id].eqEnable = value
				let valueFriendly = value === 1 ? 'On' : 'Off'
				variableObj = { [`reverbinputprocessing_eq_enable_${id}`]: valueFriendly }
			} else if (address.indexOf('/scene/sceneindex') !== -1) {
				self.DATA.sceneIndex = value
				variableObj = { scene_index: value }
			} else if (address.indexOf('/scene/scenename') !== -1) {
				self.DATA.sceneName = value
				variableObj = { scene_name: value }
			} else if (address.indexOf('/scene/scenecomment') !== -1) {
				self.DATA.sceneComment = value
				variableObj = { scene_comment: value }
			} else if (address.indexOf('/soundobjectrouting/mute/') !== -1) {
				let id = address.split('/')[4].toString()
				let id2 = address.split('/')[5].toString()
				const muteValue = Number(value) === 1 ? 1 : 0
				self.DATA.soundObjectRouting[id][id2].mute = muteValue
				variableObj = { [`soundobjectrouting_mute_${id}_${id2}`]: muteValue }
			} else if (address.indexOf('/soundobjectrouting/gain/') !== -1) {
				let id = address.split('/')[4].toString()
				let id2 = address.split('/')[5].toString()
				self.DATA.soundObjectRouting[id][id2].gain = value
				const gainDisplay = typeof value === 'number' && Number.isFinite(value) ? value.toFixed(2) : value
				variableObj = { [`soundobjectrouting_gain_${id}_${id2}`]: gainDisplay }
			} else if (address.indexOf('/functiongroup/name/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.functionGroup[id].name = value
				variableObj = { [`functiongroup_name_${id}`]: value }
			} else if (address.indexOf('/functiongroup/spreadfactor/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.functionGroup[id].spreadFactor = value
				variableObj = { [`functiongroup_spread_factor_${id}`]: value }
			} else if (address.indexOf('/functiongroup/delay/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.functionGroup[id].delay = value
				variableObj = { [`functiongroup_delay_${id}`]: value }
			} else if (address.indexOf('/positioning/speaker_position/') !== -1) {
				let id = address.split('/')[4].toString()

				const arg1 = oscMsg['args'][0]
				const arg2 = oscMsg['args'][1]
				const arg3 = oscMsg['args'][2]
				const arg4 = oscMsg['args'][3]
				const arg5 = oscMsg['args'][4]

				const value1 = arg1['value']
				const value2 = arg2['value']
				const value3 = arg3['value']
				const value4 = arg4['value']
				const value5 = arg5['value']

					self.DATA.speakerPosition[id].x = value1
					self.DATA.speakerPosition[id].y = value2
					self.DATA.speakerPosition[id].z = value3
					self.DATA.speakerPosition[id].h = value4
					self.DATA.speakerPosition[id].v = value5

				variableObj = {
					[`speakerposition_x_${id}`]: value1,
					[`speakerposition_y_${id}`]: value2,
					[`speakerposition_z_${id}`]: value3,
					[`speakerposition_h_${id}`]: value4,
					[`speakerposition_v_${id}`]: value5,
				}
			} else if (address.indexOf('/coordinatemappingsettings/p1_real/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.coordinateMappingSettings.p1Real[id] = value
				variableObj = { [`coordinatemappingsettings_p1_real_${id}`]: value }
			} else if (address.indexOf('/coordinatemappingsettings/p2_real/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.coordinateMappingSettings.p2Real[id] = value
				variableObj = { [`coordinatemappingsettings_p2_real_${id}`]: value }
			} else if (address.indexOf('/coordinatemappingsettings/p3_real/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.coordinateMappingSettings.p3Real[id] = value
				variableObj = { [`coordinatemappingsettings_p3_real_${id}`]: value }
			} else if (address.indexOf('/coordinatemappingsettings/p4_real/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.coordinateMappingSettings.p4Real[id] = value
				variableObj = { [`coordinatemappingsettings_p4_real_${id}`]: value }
			} else if (address.indexOf('/coordinatemappingsettings/p1_virtual/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.coordinateMappingSettings.p1Virtual[id] = value
				variableObj = { [`coordinatemappingsettings_p1_virtual_${id}`]: value }
			} else if (address.indexOf('/coordinatemappingsettings/p3_virtual/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.coordinateMappingSettings.p3Virtual[id] = value
				variableObj = { [`coordinatemappingsettings_p3_virtual_${id}`]: value }
			} else if (address.indexOf('/coordinatemappingsettings/flip/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.coordinateMappingSettings.flip[id] = value
				variableObj = { [`coordinatemappingsettings_flip_${id}`]: value }
			} else if (address.indexOf('/coordinatemappingsettings/name/') !== -1) {
				let id = address.split('/')[4].toString()
				self.DATA.coordinateMappingSettings.name[id] = value
				variableObj = { [`coordinatemappingsettings_name_${id}`]: value }
			}

			self.setVariableValues(variableObj)
			if (address.indexOf('/soundobjectrouting/mute/') !== -1) {
				self.checkFeedbacks('soundObjectRoutingMute')
			} else if (address.indexOf('/soundobjectrouting/gain/') !== -1) {
				self.checkFeedbacks('soundObjectRoutingGain')
			} else if (address.indexOf('/positioning/source_delaymode/') !== -1) {
				self.checkFeedbacks(
					'positioningSourceDelayMode',
					'positioningSourceDelayModeAll',
					'positioningSourceDelayModeTight',
					'positioningSourceDelayModeFull'
				)
			} else if (address.indexOf('/matrixinput/gain/') !== -1) {
				self.checkFeedbacks('matrixInputGain')
			} else if (address.indexOf('/matrixinput/mute/') !== -1) {
				self.checkFeedbacks('matrixInputMute')
			} else if (address.indexOf('/matrixinput/delayenable/') !== -1) {
				self.checkFeedbacks('matrixInputDelayEnable')
			} else if (address.indexOf('/matrixinput/eqenable/') !== -1) {
				self.checkFeedbacks('matrixInputEQEnable')
			} else if (address.indexOf('/matrixinput/polarity/') !== -1) {
				self.checkFeedbacks('matrixInputPolarity')
			} else if (address.indexOf('/matrixinput/channelname/') !== -1) {
				self.checkFeedbacks('matrixInputChannelName', 'specialEnSpaceInputName')
			} else if (address.indexOf('/matrixoutput/gain/') !== -1) {
				self.checkFeedbacks('matrixOutputGain')
			} else if (address.indexOf('/matrixoutput/mute/') !== -1) {
				self.checkFeedbacks('matrixOutputMute')
			} else if (address.indexOf('/matrixoutput/delayenable/') !== -1) {
				self.checkFeedbacks('matrixOutputDelayEnable')
			} else if (address.indexOf('/matrixoutput/eqenable/') !== -1) {
				self.checkFeedbacks('matrixOutputEQEnable')
			} else if (address.indexOf('/matrixoutput/polarity/') !== -1) {
				self.checkFeedbacks('matrixOutputPolarity')
			} else if (address.indexOf('/matrixnode/gain/') !== -1) {
				self.checkFeedbacks('matrixNodeGain')
			} else if (address.indexOf('/matrixnode/enable/') !== -1) {
				self.checkFeedbacks('matrixNodeEnable')
			} else if (address.indexOf('/matrixnode/delayenable/') !== -1) {
				self.checkFeedbacks('matrixNodeDelayEnable')
			} else if (address.indexOf('/scene/') !== -1) {
				self.checkFeedbacks('sceneIndex')
			} else if (address.indexOf('/matrixsettings/reverbroomid') !== -1) {
				self.checkFeedbacks('matrixSettingsReverbRoomId')
			} else if (address.indexOf('/matrixsettings/reverbpredelayfactor') !== -1) {
				self.checkFeedbacks('matrixSettingsReverbPreDelayFactor')
			} else if (address.indexOf('/matrixsettings/reverbrearlevel') !== -1) {
				self.checkFeedbacks('matrixSettingsReverbRearLevel')
			} else if (address.indexOf('/matrixinput/reverbsendgain/') !== -1) {
				self.checkFeedbacks('matrixInputReverbSendGain', 'specialEnSpaceSendGain')
			} else if (address.indexOf('/reverbinput/gain/') !== -1) {
				self.checkFeedbacks('reverbInputGain', 'specialEnSpaceZoneGain')
			} else {
				self.scheduleFeedbackCheck()
			}
		} catch (e) {
			if (self.config.verbose) {
				self.log('error', `OSC parse error for ${address}: ${e?.message ?? e}`)
			}
		}
	},

	updateSoundObjectRoutingGainLocal(functionGroup, soundObject, gain) {
		let self = this
		let fg = functionGroup.toString()
		let so = soundObject.toString()

		if (self.DATA?.soundObjectRouting?.[fg]?.[so]) {
			self.DATA.soundObjectRouting[fg][so].gain = gain
		}
		self.checkFeedbacks('soundObjectRoutingGain')
	},

	updateSoundObjectRoutingMuteLocal(functionGroup, soundObject, mute) {
		let self = this
		let fg = functionGroup.toString()
		let so = soundObject.toString()
		let muteValue = Number(mute) === 1 ? 1 : 0

		if (self.DATA?.soundObjectRouting?.[fg]?.[so]) {
			self.DATA.soundObjectRouting[fg][so].mute = muteValue
		}
		self.checkFeedbacks('soundObjectRoutingMute')
	},
}
