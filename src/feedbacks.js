import { combineRgb } from '@companion-module/base'
import { COLORS } from './colours.js'

export default {
	initFeedbacks: function () {
		let self = this
		let feedbacks = {}

		const colorGreen = combineRgb(0, 255, 0) // Green
		const advancedTextStyle = (text) => ({
			text,
			color: colorGreen,
			size: 14,
		})

		feedbacks.matrixInputMute = {
			type: 'boolean',
			name: 'Matrix Input - Mute',
			description: 'Change the button color based on the Matrix Input Mute State',
			defaultStyle: { ...COLORS.mute },
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
     max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback, bank) {
				let options = feedback.options
				let input = options.matrixinput

				if (self.DATA.matrixInput[input].mute === 1) {
					return true
				}

				return false
			},
		}

		feedbacks.matrixInputDelayEnable = {
			type: 'boolean',
			name: 'Matrix Input - Delay Enable',
			description: 'Change the button color based on the Matrix Input Delay Enable State',
			defaultStyle: { ...COLORS.delay },
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
     max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback, bank) {
				let options = feedback.options
				let input = options.matrixinput

				if (self.DATA.matrixInput[input].delayEnable === 1) {
					return true
				}

				return false
			},
		}

		feedbacks.matrixInputEQEnable = {
			type: 'boolean',
			name: 'Matrix Input - EQ Enable',
			description: 'Change the button color based on the Matrix Input EQ Enable State',
			defaultStyle: { ...COLORS.eq },
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
     max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback, bank) {
				let options = feedback.options
				let input = options.matrixinput

				if (self.DATA.matrixInput[input].eqEnable === 1) {
					return true
				}

				return false
			},
		}

		feedbacks.matrixInputPolarity = {
			type: 'boolean',
			name: 'Matrix Input - Polarity',
			description: 'Change the button color based on the Matrix Input Polarity State',
			defaultStyle: { ...COLORS.polarity },
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
     max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback, bank) {
				let options = feedback.options
				let input = options.matrixinput

				if (self.DATA.matrixInput[input].polarity === 1) {
					return true
				}

				return false
			},
		}

		feedbacks.matrixInputLevelMeterPreMute = {
			type: 'boolean',
			name: 'Matrix Input - Level Meter Pre Mute Above Threshold',
			description: 'Lights up when the Matrix Input Pre-Mute level meter reading (dBFS) is at or above the threshold',
			defaultStyle: { ...COLORS.grey },
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
     max: self.matrixInputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Threshold (dBFS)',
					id: 'threshold',
					default: -60,
					min: -120,
					max: 0,
					required: true,
				},
			],
			callback: function (feedback, bank) {
				let options = feedback.options
				let input = options.matrixinput
				const level = self.DATA.matrixInput[input]?.levelMeterPreMute
				return level !== null && level !== undefined && level >= options.threshold
			},
		}

		feedbacks.matrixInputLevelMeterPostMute = {
			type: 'boolean',
			name: 'Matrix Input - Level Meter Post Mute Above Threshold',
			description: 'Lights up when the Matrix Input Post-Mute level meter reading (dBFS) is at or above the threshold',
			defaultStyle: { ...COLORS.grey },
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
     max: self.matrixInputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Threshold (dBFS)',
					id: 'threshold',
					default: -60,
					min: -120,
					max: 0,
					required: true,
				},
			],
			callback: function (feedback, bank) {
				let options = feedback.options
				let input = options.matrixinput
				const level = self.DATA.matrixInput[input]?.levelMeterPostMute
				return level !== null && level !== undefined && level >= options.threshold
			},
		}

		feedbacks.matrixNodeEnable = {
			type: 'boolean',
			name: 'Matrix Node - Enable',
			description: 'Change the button color based on the Matrix Node Enable State',
			defaultStyle: { ...COLORS.grey },
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Matrix Output',
					id: 'matrixoutput',
					default: 1,
					min: 1,
					max: self.matrixOutputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const input = feedback.options.matrixinput
				const output = feedback.options.matrixoutput
				return self.DATA?.matrixNode?.[input]?.[output]?.enable === 1
			},
		}

		feedbacks.matrixNodeDelayEnable = {
			type: 'boolean',
			name: 'Matrix Node - Delay Enable',
			description: 'Change the button color based on the Matrix Node Delay Enable State',
			defaultStyle: { ...COLORS.delay },
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Matrix Output',
					id: 'matrixoutput',
					default: 1,
					min: 1,
					max: self.matrixOutputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const input = feedback.options.matrixinput
				const output = feedback.options.matrixoutput
				return self.DATA?.matrixNode?.[input]?.[output]?.delayEnable === 1
			},
		}

		feedbacks.matrixOutputMute = {
			type: 'boolean',
			name: 'Matrix Output - Mute',
			description: 'Change the button color based on the Matrix Output Mute State',
			defaultStyle: { ...COLORS.mute },
			options: [
				{
					type: 'number',
					label: 'Matrix Output',
					id: 'matrixoutput',
					default: 1,
					min: 1,
     max: self.matrixOutputCount,
					required: true,
				},
			],
			callback: function (feedback, bank) {
				let options = feedback.options
				let output = options.matrixoutput

				if (self.DATA.matrixOutput[output].mute === 1) {
					return true
				}

				return false
			},
		}

		feedbacks.matrixOutputDelayEnable = {
			type: 'boolean',
			name: 'Matrix Output - Delay Enable',
			description: 'Change the button color based on the Matrix Output Delay Enable State',
			defaultStyle: { ...COLORS.delay },
			options: [
				{
					type: 'number',
					label: 'Matrix Output',
					id: 'matrixoutput',
					default: 1,
					min: 1,
     max: self.matrixOutputCount,
					required: true,
				},
			],
			callback: function (feedback, bank) {
				let options = feedback.options
				let output = options.matrixoutput

				if (self.DATA.matrixOutput[output].delayEnable === 1) {
					return true
				}

				return false
			},
		}

		feedbacks.matrixOutputEQEnable = {
			type: 'boolean',
			name: 'Matrix Output - EQ Enable',
			description: 'Change the button color based on the Matrix Output EQ Enable State',
			defaultStyle: { ...COLORS.eq },
			options: [
				{
					type: 'number',
					label: 'Matrix Output',
					id: 'matrixoutput',
					default: 1,
					min: 1,
     max: self.matrixOutputCount,
					required: true,
				},
			],
			callback: function (feedback, bank) {
				let options = feedback.options
				let output = options.matrixoutput

				if (self.DATA.matrixOutput[output].eqEnable === 1) {
					return true
				}

				return false
			},
		}

		feedbacks.matrixOutputPolarity = {
			type: 'boolean',
			name: 'Matrix Output - Polarity',
			description: 'Change the button color based on the Matrix Output Polarity State',
			defaultStyle: { ...COLORS.polarity },
			options: [
				{
					type: 'number',
					label: 'Matrix Output',
					id: 'matrixoutput',
					default: 1,
					min: 1,
     max: self.matrixOutputCount,
					required: true,
				},
			],
			callback: function (feedback, bank) {
				let options = feedback.options
				let output = options.matrixoutput

				if (self.DATA.matrixOutput[output].polarity === 1) {
					return true
				}

				return false
			},
		}

		feedbacks.matrixOutputLevelMeterPreMute = {
			type: 'boolean',
			name: 'Matrix Output - Level Meter Pre Mute Above Threshold',
			description: 'Lights up when the Matrix Output Pre-Mute level meter reading (dBFS) is at or above the threshold',
			defaultStyle: { ...COLORS.grey },
			options: [
				{
					type: 'number',
					label: 'Matrix Output',
					id: 'matrixoutput',
					default: 1,
					min: 1,
     max: self.matrixOutputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Threshold (dBFS)',
					id: 'threshold',
					default: -60,
					min: -120,
					max: 0,
					required: true,
				},
			],
			callback: function (feedback, bank) {
				let options = feedback.options
				let output = options.matrixoutput
				const level = self.DATA.matrixOutput[output]?.levelMeterPreMute
				return level !== null && level !== undefined && level >= options.threshold
			},
		}

		feedbacks.matrixOutputLevelMeterPostMute = {
			type: 'boolean',
			name: 'Matrix Output - Level Meter Post Mute Above Threshold',
			description: 'Lights up when the Matrix Output Post-Mute level meter reading (dBFS) is at or above the threshold',
			defaultStyle: { ...COLORS.grey },
			options: [
				{
					type: 'number',
					label: 'Matrix Output',
					id: 'matrixoutput',
					default: 1,
					min: 1,
     max: self.matrixOutputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Threshold (dBFS)',
					id: 'threshold',
					default: -60,
					min: -120,
					max: 0,
					required: true,
				},
			],
			callback: function (feedback, bank) {
				let options = feedback.options
				let output = options.matrixoutput
				const level = self.DATA.matrixOutput[output]?.levelMeterPostMute
				return level !== null && level !== undefined && level >= options.threshold
			},
		}

		feedbacks.reverbInputProcessingMute = {
			type: 'boolean',
			name: 'Reverb Input Processing - Mute',
			description: 'Change the button color based on the Reverb Input Processing Mute State',
			defaultStyle: { ...COLORS.mute },
			options: [
				{
					type: 'number',
					label: 'Reverb Input Processing',
					id: 'reverbinputprocessing',
					default: 1,
					min: 1,
					max: 64,
					required: true,
				},
			],
			callback: function (feedback, bank) {
				let options = feedback.options
				let input = options.reverbinputprocessing

				if (self.reverbInputProcessing[input].mute === 1) {
					return true
				}

				return false
			},
		}

		feedbacks.reverbInputProcessingEQEnable = {
			type: 'boolean',
			name: 'Reverb Input Processing - EQ Enable',
			description: 'Change the button color based on the Reverb Input Processing EQ Enable State',
			defaultStyle: { ...COLORS.eq },
			options: [
				{
					type: 'number',
					label: 'Reverb Input Processing',
					id: 'reverbinputprocessing',
					default: 1,
					min: 1,
					max: 64,
					required: true,
				},
			],
			callback: function (feedback, bank) {
				let options = feedback.options
				let input = options.reverbinputprocessing

				if (self.DATA?.reverbInputProcessing?.[input]?.eqEnable === 1) {
					return true
				}

				return false
			},
		}

		feedbacks.soundObjectRoutingMute = {
			type: 'boolean',
			name: 'Sound Object Routing - Mute',
			description: 'Change the button color based on the Sound Object Routing Mute State',
			defaultStyle: { ...COLORS.mute },
			options: [
				{
					type: 'number',
					label: 'Function Group',
					id: 'functiongroup',
					default: 1,
					min: 1,
					max: self.FUNCTION_GROUP_COUNT,
					required: true,
				},
				{
					type: 'number',
					label: 'Sound Object',
					id: 'soundobject',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback, bank) {
				let options = feedback.options
				let group = Number(options.functiongroup)
				let soundObject = Number(options.soundobject)
				let mute = self.DATA?.soundObjectRouting?.[group]?.[soundObject]?.mute

				return Number(mute) === 1
			},
		}

		feedbacks.soundObjectRoutingGain = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Sound Object Routing - Gain',
			description: 'Show the current Sound Object Routing Gain on the button',
			options: [
				{
					type: 'number',
					label: 'Function Group',
					id: 'functiongroup',
					default: 1,
					min: 1,
					max: self.FUNCTION_GROUP_COUNT,
					required: true,
				},
				{
					type: 'number',
					label: 'Sound Object',
					id: 'soundobject',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback, bank) {
				let options = feedback.options
				let group = options.functiongroup
				let soundObject = options.soundobject
				let gain = self.DATA?.soundObjectRouting[group]?.[soundObject]?.gain

				if (gain === null || gain === undefined) {
					return advancedTextStyle('— dB')
				}

				return advancedTextStyle(`${Number(gain).toFixed(2)} dB`)
			},
		}

		feedbacks.matrixInputGain = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Matrix Input - Gain',
			description: 'Show the current Matrix Input Gain on the button',
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const input = feedback.options.matrixinput
				const gain = self.DATA?.matrixInput?.[input]?.gain
				if (gain === null || gain === undefined) return advancedTextStyle('— dB')
				return advancedTextStyle(`${Number(gain).toFixed(2)} dB`)
			},
		}

		feedbacks.matrixInputDelay = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Matrix Input - Delay',
			description: 'Show the current Matrix Input Delay on the button',
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const input = feedback.options.matrixinput
				const delay = self.DATA?.matrixInput?.[input]?.delay
				if (delay === null || delay === undefined) return advancedTextStyle('— ms')
				return advancedTextStyle(`${Number(delay).toFixed(2)} ms`)
			},
		}

		feedbacks.matrixInputChannelName = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Matrix Input - Channel Name',
			description: 'Show the Matrix Input channel name on the button',
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const input = feedback.options.matrixinput
				const name = self.DATA?.matrixInput?.[input]?.channelName
				return advancedTextStyle(name || '—')
			},
		}

		feedbacks.matrixInputReverbSendGain = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Matrix Input - Reverb Send Gain',
			description: 'Show the Matrix Input reverb send gain on the button',
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const input = feedback.options.matrixinput
				const gain = self.DATA?.matrixInput?.[input]?.reverbSendGain
				if (gain === null || gain === undefined) return advancedTextStyle('— dB')
				return advancedTextStyle(`${Number(gain).toFixed(2)} dB`)
			},
		}

		feedbacks.matrixOutputGain = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Matrix Output - Gain',
			description: 'Show the current Matrix Output Gain on the button',
			options: [
				{
					type: 'number',
					label: 'Matrix Output',
					id: 'matrixoutput',
					default: 1,
					min: 1,
					max: self.matrixOutputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const output = feedback.options.matrixoutput
				const gain = self.DATA?.matrixOutput?.[output]?.gain
				if (gain === null || gain === undefined) return advancedTextStyle('— dB')
				return advancedTextStyle(`${Number(gain).toFixed(2)} dB`)
			},
		}

		feedbacks.matrixOutputDelay = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Matrix Output - Delay',
			description: 'Show the current Matrix Output Delay on the button',
			options: [
				{
					type: 'number',
					label: 'Matrix Output',
					id: 'matrixoutput',
					default: 1,
					min: 1,
					max: self.matrixOutputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const output = feedback.options.matrixoutput
				const delay = self.DATA?.matrixOutput?.[output]?.delay
				if (delay === null || delay === undefined) return advancedTextStyle('— ms')
				return advancedTextStyle(`${Number(delay).toFixed(2)} ms`)
			},
		}

		feedbacks.matrixOutputChannelName = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Matrix Output - Channel Name',
			description: 'Show the Matrix Output channel name on the button',
			options: [
				{
					type: 'number',
					label: 'Matrix Output',
					id: 'matrixoutput',
					default: 1,
					min: 1,
					max: self.matrixOutputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const output = feedback.options.matrixoutput
				const name = self.DATA?.matrixOutput?.[output]?.channelName
				return advancedTextStyle(name || '—')
			},
		}

		feedbacks.matrixNodeGain = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Matrix Node - Gain',
			description: 'Show the current Matrix Node Gain on the button',
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Matrix Output',
					id: 'matrixoutput',
					default: 1,
					min: 1,
					max: self.matrixOutputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const input = feedback.options.matrixinput
				const output = feedback.options.matrixoutput
				const gain = self.DATA?.matrixNode?.[input]?.[output]?.gain
				if (gain === null || gain === undefined) return advancedTextStyle('— dB')
				return advancedTextStyle(`${Number(gain).toFixed(2)} dB`)
			},
		}

		feedbacks.matrixNodeDelay = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Matrix Node - Delay',
			description: 'Show the current Matrix Node Delay on the button',
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Matrix Output',
					id: 'matrixoutput',
					default: 1,
					min: 1,
					max: self.matrixOutputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const input = feedback.options.matrixinput
				const output = feedback.options.matrixoutput
				const delay = self.DATA?.matrixNode?.[input]?.[output]?.delay
				if (delay === null || delay === undefined) return advancedTextStyle('— ms')
				return advancedTextStyle(`${Number(delay).toFixed(2)} ms`)
			},
		}

		feedbacks.reverbInputGain = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Reverb Input - Gain',
			description: 'Show the Reverb Input Gain on the button',
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const input = feedback.options.matrixinput
				const gain = self.DATA?.reverbInput?.[input]?.gain
				if (gain === null || gain === undefined) return advancedTextStyle('— dB')
				return advancedTextStyle(`${Number(gain).toFixed(2)} dB`)
			},
		}

		feedbacks.reverbInputProcessingGain = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Reverb Input Processing - Gain',
			description: 'Show the Reverb Input Processing Gain on the button',
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const input = feedback.options.matrixinput
				const gain = self.DATA?.reverbInputProcessing?.[input]?.gain
				if (gain === null || gain === undefined) return advancedTextStyle('— dB')
				return advancedTextStyle(`${Number(gain).toFixed(2)} dB`)
			},
		}

		feedbacks.functionGroupSpreadFactor = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Function Group - Spread Factor',
			description: 'Show the Function Group spread factor on the button',
			options: [
				{
					type: 'number',
					label: 'Function Group',
					id: 'functiongroup',
					default: 1,
					min: 1,
					max: self.FUNCTION_GROUP_COUNT,
					required: true,
				},
			],
			callback: function (feedback) {
				const group = feedback.options.functiongroup
				const value = self.DATA?.functionGroup?.[group]?.spreadFactor
				if (value === null || value === undefined) return advancedTextStyle('—')
				return advancedTextStyle(`${Number(value).toFixed(2)}`)
			},
		}

		feedbacks.functionGroupDelay = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Function Group - Delay',
			description: 'Show the Function Group delay on the button',
			options: [
				{
					type: 'number',
					label: 'Function Group',
					id: 'functiongroup',
					default: 1,
					min: 1,
					max: self.FUNCTION_GROUP_COUNT,
					required: true,
				},
			],
			callback: function (feedback) {
				const group = feedback.options.functiongroup
				const value = self.DATA?.functionGroup?.[group]?.delay
				if (value === null || value === undefined) return advancedTextStyle('— ms')
				return advancedTextStyle(`${Number(value).toFixed(2)} ms`)
			},
		}

		feedbacks.functionGroupName = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Function Group - Name',
			description: 'Show the Function Group name on the button',
			options: [
				{
					type: 'number',
					label: 'Function Group',
					id: 'functiongroup',
					default: 1,
					min: 1,
					max: self.FUNCTION_GROUP_COUNT,
					required: true,
				},
			],
			callback: function (feedback) {
				const group = feedback.options.functiongroup
				const name = self.DATA?.functionGroup?.[group]?.name
				return advancedTextStyle(name || '—')
			},
		}

		
		feedbacks.positioningSourceDelayModeTight = {
			type: 'boolean',
			name: 'Positioning - Source Delay Mode Tight',
			description: 'Active when Source Delay Mode is Tight',
			defaultStyle: { ...COLORS.tight },
			options: [
				{
					type: 'number',
					label: 'Sound Object',
					id: 'soundobject',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const so = feedback.options.soundobject
				return Number(self.DATA?.positioning?.[so]?.sourceDelayMode) === 1
			},
		}

		feedbacks.positioningSourceDelayModeFull = {
			type: 'boolean',
			name: 'Positioning - Source Delay Mode Full',
			description: 'Active when Source Delay Mode is Full',
			defaultStyle: { ...COLORS.full },
			options: [
				{
					type: 'number',
					label: 'Sound Object',
					id: 'soundobject',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const so = feedback.options.soundobject
				return Number(self.DATA?.positioning?.[so]?.sourceDelayMode) === 2
			},
		}

		feedbacks.positioningSourceSpread = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Positioning - Source Spread',
			description: 'Show the positioning source spread on the button',
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const input = feedback.options.matrixinput
				const value = self.DATA?.positioning?.[input]?.sourceSpread
				if (value === null || value === undefined) return advancedTextStyle('—')
				return advancedTextStyle(`${Number(value).toFixed(2)}`)
			},
		}

		feedbacks.positioningSourcePositionX = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Positioning - Source Position X',
			description: 'Show the positioning source X on the button',
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const input = feedback.options.matrixinput
				const value = self.DATA?.positioning?.[input]?.sourcePositionX
				if (value === null || value === undefined) return advancedTextStyle('—')
				return advancedTextStyle(`X ${Number(value).toFixed(2)}`)
			},
		}

		feedbacks.positioningSourcePositionY = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Positioning - Source Position Y',
			description: 'Show the positioning source Y on the button',
			options: [
				{
					type: 'number',
					label: 'Matrix Input',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: self.matrixInputCount,
					required: true,
				},
			],
			callback: function (feedback) {
				const input = feedback.options.matrixinput
				const value = self.DATA?.positioning?.[input]?.sourcePositionY
				if (value === null || value === undefined) return advancedTextStyle('—')
				return advancedTextStyle(`Y ${Number(value).toFixed(2)}`)
			},
		}

		feedbacks.matrixSettingsReverbRoomId = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'En-Space - Reverb Room Id',
			description: 'Show the current reverb room id on the button',
			options: [],
			callback: function () {
				const value = self.DATA?.matrixSettings?.reverbRoomId
				if (value === null || value === undefined) return advancedTextStyle('—')
				return advancedTextStyle(`Room ${value}`)
			},
		}

		feedbacks.matrixSettingsReverbPreDelayFactor = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'En-Space - Reverb Predelay Factor',
			description: 'Show the reverb predelay factor on the button',
			options: [],
			callback: function () {
				const value = self.DATA?.matrixSettings?.reverbPreDelayFactor
				if (value === null || value === undefined) return advancedTextStyle('—')
				return advancedTextStyle(`${Number(value).toFixed(2)}`)
			},
		}

		feedbacks.matrixSettingsReverbRearLevel = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'En-Space - Reverb Rear Level',
			description: 'Show the reverb rear level on the button',
			options: [],
			callback: function () {
				const value = self.DATA?.matrixSettings?.reverbRearLevel
				if (value === null || value === undefined) return advancedTextStyle('— dB')
				return advancedTextStyle(`${Number(value).toFixed(2)} dB`)
			},
		}

		feedbacks.sceneIndex = {
			type: 'advanced',
			affectedProperties: ['text', 'color', 'size'],
			name: 'Scene - Index / Name',
			description: 'Show the current scene index and name on the button',
			options: [],
			callback: function () {
				const index = self.DATA?.sceneIndex
				const name = self.DATA?.sceneName
				if (index === null || index === undefined) return advancedTextStyle('—')
				return advancedTextStyle(name ? `${index}\n${name}` : `${index}`)
			},
		}

		self.attachPollSubscriptions(feedbacks)
		self.setFeedbackDefinitions(feedbacks)
	},
}
