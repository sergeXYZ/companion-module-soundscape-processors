export default {
	initActions: function () {
		let self = this
		let actions = {}

		/*actions.setDeviceName = {
			name: 'Set Device Name',
			description: 'Set the name of the devic. When connected to R1, this will be overwritten by R1.',
			options: [
				{
					type: 'textinput',
					label: 'Device Name',
					id: 'devicename',
					default: 'MyDS100',
					useVariables: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let deviceName = options.devicename

				let args = [
					{
						type: 's',
						value: '' + deviceName,
					},
				]

				self.sendCommand('/settings/devicename', args)
			},
		}*/

		actions.setMatrixInputMute = {
			name: 'Matrix Input - Mute',
			description: 'Mute or Unmute a Matrix Input',
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
					type: 'dropdown',
					label: 'Mute',
					id: 'mute',
					default: 1,
					choices: [
						{ id: 1, label: 'Mute' },
						{ id: 0, label: 'Unmute' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput
				let mute = options.mute

				let args = [
					{
						type: 'i',
						value: mute,
					},
				]

				self.sendCommand('/matrixinput/mute/' + matrixInput, args)
			},
		}

		actions.setMatrixInputMuteAll = {
			name: 'Matrix Input - Mute All',
			description: 'Mute or Unmute all Matrix Inputs',
			options: [
				{
					type: 'dropdown',
					label: 'Mute',
					id: 'mute',
					default: 1,
					choices: [
						{ id: 1, label: 'Mute' },
						{ id: 0, label: 'Unmute' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let mute = options.mute

				let args = [
					{
						type: 'i',
						value: mute,
					},
				]

				self.sendCommand('/matrixinput/mute/' + '*', args)
			},
		}

		actions.setMatrixInputGain = {
			name: 'Matrix Input - Gain',
			description: 'Set the Gain of a Matrix Input',
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
					label: 'Gain',
					id: 'gain',
					default: 0,
					min: -120.0,
					max: 24.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput
				let gain = options.gain

				let args = [
					{
						type: 'f',
						value: gain,
					},
				]

				self.sendCommand('/matrixinput/gain/' + matrixInput, args)

				console.log('Matrix Input Gain: ' + matrixInput + ' ' + gain)
			},
		}

		actions.setMatrixInputGainAll = {
			name: 'Matrix Input - Gain All',
			description: 'Set the Gain of all Matrix Inputs',
			options: [
				{
					type: 'number',
					label: 'Gain',
					id: 'gain',
					default: 0,
					min: -120.0,
					max: 24.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let gain = options.gain

				let args = [
					{
						type: 'f',
						value: gain,
					},
				]

				self.sendCommand('/matrixinput/gain/' + '*', args)
			},
		}

		actions.increaseMatrixInputGain = {
			name: 'Matrix Input - Increase Gain',
			description: 'Increase the Gain of a Matrix Input',
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
					label: 'Gain Increase Amount',
					id: 'gain',
					default: 1,
					min: 0.1,
					max: 6.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput.toString()
				let gain = options.gain

				let currentGain = self.DATA?.matrixInput[matrixInput].gain

				if (currentGain !== undefined) {
					let newGain = currentGain + gain

					if (newGain > 24.0) {
						newGain = 24.0
					}

					let args = [
						{
							type: 'f',
							value: newGain,
						},
					]

					self.sendCommand('/matrixinput/gain/' + matrixInput, args)
				}
			},
		}

		actions.decreaseMatrixInputGain = {
			name: 'Matrix Input - Decrease Gain',
			description: 'Decrease the Gain of a Matrix Input',
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
					label: 'Gain Decrease Amount',
					id: 'gain',
					default: 1,
					min: 0.1,
					max: 6.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput.toString()
				let gain = options.gain

				let currentGain = self.DATA?.matrixInput[matrixInput].gain

				if (currentGain !== undefined) {
					let newGain = currentGain - gain

					if (newGain < -120.0) {
						newGain = -120.0
					}

					let args = [
						{
							type: 'f',
							value: newGain,
						},
					]

					self.sendCommand('/matrixinput/gain/' + matrixInput, args)
				}
			},
		}

		actions.setMatrixInputDelay = {
			name: 'Matrix Input - Delay',
			description: 'Set the Delay of a Matrix Input',
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
					label: 'Delay (ms)',
					id: 'delay',
					default: 0,
					min: 0.0,
					max: 500.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput
				let delay = options.delay

				let args = [
					{
						type: 'f',
						value: delay,
					},
				]

				self.sendCommand('/matrixinput/delay/' + matrixInput, args)
			},
		}

		actions.setMatrixInputDelayAll = {
			name: 'Matrix Input - Delay All',
			description: 'Set the Delay of all Matrix Inputs',
			options: [
				{
					type: 'number',
					label: 'Delay (ms)',
					id: 'delay',
					default: 0,
					min: 0.0,
					max: 500.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let delay = options.delay

				let args = [
					{
						type: 'f',
						value: delay,
					},
				]

				self.sendCommand('/matrixinput/delay/' + '*', args)
			},
		}

		actions.increaseMatrixInputDelay = {
			name: 'Matrix Input - Increase Delay',
			description: 'Increase the Delay of a Matrix Input',
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
					label: 'Delay Increase Amount',
					id: 'delay',
					default: 1,
					min: 0.1,
					max: 6.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput.toString()
				let delay = options.delay

				let currentDelay = self.DATA?.matrixInput[matrixInput].delay

				if (currentDelay !== undefined) {
					let newDelay = currentDelay + delay

					if (newDelay > 500.0) {
						newDelay = 500.0
					}

					let args = [
						{
							type: 'f',
							value: newDelay,
						},
					]

					self.sendCommand('/matrixinput/delay/' + matrixInput, args)
				}
			},
		}

		actions.decreaseMatrixInputDelay = {
			name: 'Matrix Input - Decrease Delay',
			description: 'Decrease the Delay of a Matrix Input',
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
					label: 'Delay Decrease Amount',
					id: 'delay',
					default: 1,
					min: 0.1,
					max: 6.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput.toString()
				let delay = options.delay

				let currentDelay = self.DATA?.matrixInput[matrixInput].delay

				if (currentDelay !== undefined) {
					let newDelay = currentDelay - delay

					if (newDelay < 0.0) {
						newDelay = 0.0
					}

					let args = [
						{
							type: 'f',
							value: newDelay,
						},
					]

					self.sendCommand('/matrixinput/delay/' + matrixInput, args)
				}
			},
		}

		actions.setMatrixInputDelayEnable = {
			name: 'Matrix Input - Delay Enable',
			description: 'Enable or Disable Delay of a Matrix Input',
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
					type: 'dropdown',
					label: 'Delay Enable',
					id: 'delayenable',
					default: 1,
					choices: [
						{ id: 1, label: 'Enable' },
						{ id: 0, label: 'Disable' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput
				let delayEnable = options.delayenable

				let args = [
					{
						type: 'i',
						value: delayEnable,
					},
				]

				self.sendCommand('/matrixinput/delayenable/' + matrixInput, args)
			},
		}

		actions.setMatrixInputDelayEnableAll = {
			name: 'Matrix Input - Delay Enable All',
			description: 'Enable or Disable Delay of all Matrix Inputs',
			options: [
				{
					type: 'dropdown',
					label: 'Delay Enable',
					id: 'delayenable',
					default: 1,
					choices: [
						{ id: 1, label: 'Enable' },
						{ id: 0, label: 'Disable' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let delayEnable = options.delayenable

				let args = [
					{
						type: 'i',
						value: delayEnable,
					},
				]

				self.sendCommand('/matrixinput/delayenable/' + '*', args)
			},
		}

		actions.setMatrixInputEqEnable = {
			name: 'Matrix Input - EQ Enable',
			description: 'Enable or Disable EQ of a Matrix Input',
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
					type: 'dropdown',
					label: 'EQ Enable',
					id: 'eqenable',
					default: 1,
					choices: [
						{ id: 1, label: 'Enable' },
						{ id: 0, label: 'Disable' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput
				let eqEnable = options.eqenable

				let args = [
					{
						type: 'i',
						value: eqEnable,
					},
				]

				self.sendCommand('/matrixinput/eqenable/' + matrixInput, args)
			},
		}

		actions.setMatrixInputEqEnableAll = {
			name: 'Matrix Input - EQ Enable All',
			description: 'Enable or Disable EQ of all Matrix Inputs',
			options: [
				{
					type: 'dropdown',
					label: 'EQ Enable',
					id: 'eqenable',
					default: 1,
					choices: [
						{ id: 1, label: 'Enable' },
						{ id: 0, label: 'Disable' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let eqEnable = options.eqenable

				let args = [
					{
						type: 'i',
						value: eqEnable,
					},
				]

				self.sendCommand('/matrixinput/eqenable/' + '*', args)
			},
		}

		actions.setMatrixInputPolarity = {
			name: 'Matrix Input - Polarity',
			description: 'Set the Polarity of a Matrix Input',
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
					type: 'dropdown',
					label: 'Polarity',
					id: 'polarity',
					default: 1,
					choices: [
						{ id: 1, label: 'Reversed' },
						{ id: 0, label: 'Normal' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput
				let polarity = options.polarity

				let args = [
					{
						type: 'i',
						value: polarity,
					},
				]

				self.sendCommand('/matrixinput/polarity/' + matrixInput, args)
			},
		}

		actions.setMatrixInputPolarityAll = {
			name: 'Matrix Input - Polarity All',
			description: 'Set the Polarity of all Matrix Inputs',
			options: [
				{
					type: 'dropdown',
					label: 'Polarity',
					id: 'polarity',
					default: 1,
					choices: [
						{ id: 1, label: 'Reversed' },
						{ id: 0, label: 'Normal' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let polarity = options.polarity

				let args = [
					{
						type: 'i',
						value: polarity,
					},
				]

				self.sendCommand('/matrixinput/polarity/' + '*', args)
			},
		}

		actions.setMatrixInputChannelName = {
			name: 'Matrix Input - Channel Name',
			description: 'Set the Channel Name of a Matrix Input',
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
					type: 'textinput',
					label: 'Channel Name',
					id: 'channelname',
					default: 'Channel',
					useVariables: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput
				let channelName = options.channelname

				let args = [
					{
						type: 's',
						value: '' + channelName,
					},
				]

				self.sendCommand('/matrixinput/channelname/' + matrixInput, args)
			},
		}

		actions.setMatrixNodeEnable = {
			name: 'Matrix Node - Enable',
			description: 'Enable or Disable a Matrix Node',
			options: [
				{
					type: 'number',
					label: 'Matrix Node Input',
					id: 'input',
					default: 1,
					min: 1,
     max: self.matrixInputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Matrix Node Output',
					id: 'output',
					default: 1,
					min: 1,
     max: self.matrixOutputCount,
					required: true,
				},
				{
					type: 'dropdown',
					label: 'Enable',
					id: 'enable',
					default: 1,
					choices: [
						{ id: 1, label: 'Enable' },
						{ id: 0, label: 'Disable' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixNode = options.input + '/' + options.output
				let enable = options.enable

				let args = [
					{
						type: 'i',
						value: enable,
					},
				]

				self.sendCommand('/matrixnode/enable/' + matrixNode, args)
			},
		}

		actions.setMatrixNodeGain = {
			name: 'Matrix Node - Gain',
			description: 'Set the Gain of a Matrix Node',
			options: [
				{
					type: 'number',
					label: 'Matrix Node Input',
					id: 'input',
					default: 1,
					min: 1,
     max: self.matrixInputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Matrix Node Output',
					id: 'output',
					default: 1,
					min: 1,
     max: self.matrixOutputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Gain',
					id: 'gain',
					default: 0,
					min: -120.0,
					max: 10.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixNode = options.input + '/' + options.output
				let gain = options.gain

				let args = [
					{
						type: 'f',
						value: gain,
					},
				]

				self.sendCommand('/matrixnode/gain/' + matrixNode, args)
			},
		}

		actions.setMatrixNodeGainAll = {
			name: 'Matrix Node - Gain All',
			description: 'Set the Gain of all Matrix Nodes',
			options: [
				{
					type: 'number',
					label: 'Gain',
					id: 'gain',
					default: 0,
					min: -120.0,
					max: 10.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let gain = options.gain

				let args = [
					{
						type: 'f',
						value: gain,
					},
				]

				self.sendCommand('/matrixnode/gain/' + '*', args)
			},
		}

		actions.increaseMatrixNodeGain = {
			name: 'Matrix Node - Increase Gain',
			description: 'Increase the Gain of a Matrix Node',
			options: [
				{
					type: 'number',
					label: 'Matrix Node Input',
					id: 'input',
					default: 1,
					min: 1,
     max: self.matrixInputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Matrix Node Output',
					id: 'output',
					default: 1,
					min: 1,
     max: self.matrixOutputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Gain Increase Amount',
					id: 'gain',
					default: 1,
					min: 0.1,
					max: 6.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let input = options.input.toString()
				let output = options.output.toString()
				let matrixNode = options.input + '/' + options.output
				let gain = options.gain

				let currentGain = self.DATA?.matrixNode[input][output].gain

				if (currentGain !== undefined) {
					let newGain = currentGain + gain

					if (newGain > 10.0) {
						newGain = 10.0
					}

					let args = [
						{
							type: 'f',
							value: newGain,
						},
					]

					self.sendCommand('/matrixnode/gain/' + matrixNode, args)
				}
			},
		}

		actions.decreaseMatrixNodeGain = {
			name: 'Matrix Node - Decrease Gain',
			description: 'Decrease the Gain of a Matrix Node',
			options: [
				{
					type: 'number',
					label: 'Matrix Node Input',
					id: 'input',
					default: 1,
					min: 1,
     max: self.matrixInputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Matrix Node Output',
					id: 'output',
					default: 1,
					min: 1,
     max: self.matrixOutputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Gain Decrease Amount',
					id: 'gain',
					default: 1,
					min: 0.1,
					max: 6.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let input = options.input.toString()
				let output = options.output.toString()
				let matrixNode = options.input + '/' + options.output
				let gain = options.gain

				let currentGain = self.DATA?.matrixNode[input][output].gain

				if (currentGain !== undefined) {
					let newGain = currentGain - gain

					if (newGain < -120.0) {
						newGain = -120.0
					}

					let args = [
						{
							type: 'f',
							value: newGain,
						},
					]

					self.sendCommand('/matrixnode/gain/' + matrixNode, args)
				}
			},
		}

		actions.setMatrixNodeDelayEnable = {
			name: 'Matrix Node - Delay Enable',
			description: 'Enable or Disable Delay of a Matrix Node',
			options: [
				{
					type: 'number',
					label: 'Matrix Node Input',
					id: 'input',
					default: 1,
					min: 1,
     max: self.matrixInputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Matrix Node Output',
					id: 'output',
					default: 1,
					min: 1,
     max: self.matrixOutputCount,
					required: true,
				},
				{
					type: 'dropdown',
					label: 'Delay Enable',
					id: 'delayenable',
					default: 1,
					choices: [
						{ id: 1, label: 'Enable' },
						{ id: 0, label: 'Disable' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixNode = options.input + '/' + options.output
				let delayEnable = options.delayenable

				let args = [
					{
						type: 'i',
						value: delayEnable,
					},
				]

				self.sendCommand('/matrixnode/delayenable/' + matrixNode, args)
			},
		}

		actions.setMatrixNodeDelayEnableAll = {
			name: 'Matrix Node - Delay Enable All',
			description: 'Enable or Disable Delay of all Matrix Nodes',
			options: [
				{
					type: 'dropdown',
					label: 'Delay Enable',
					id: 'delayenable',
					default: 1,
					choices: [
						{ id: 1, label: 'Enable' },
						{ id: 0, label: 'Disable' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let delayEnable = options.delayenable

				let args = [
					{
						type: 'i',
						value: delayEnable,
					},
				]

				self.sendCommand('/matrixnode/delayenable/' + '*' + '/' + '*', args)
			},
		}

		actions.setMatrixNodeDelay = {
			name: 'Matrix Node - Delay',
			description: 'Set the Delay of a Matrix Node',
			options: [
				{
					type: 'number',
					label: 'Matrix Node Input',
					id: 'input',
					default: 1,
					min: 1,
     max: self.matrixInputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Matrix Node Output',
					id: 'output',
					default: 1,
					min: 1,
     max: self.matrixOutputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Delay (ms)',
					id: 'delay',
					default: 0,
					min: 0.0,
					max: 500.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixNode = options.input + '/' + options.output
				let delay = options.delay

				let args = [
					{
						type: 'f',
						value: delay,
					},
				]

				self.sendCommand('/matrixnode/delay/' + matrixNode, args)
			},
		}

		actions.setMatrixNodeDelayAll = {
			name: 'Matrix Node - Delay All',
			description: 'Set the Delay of all Matrix Nodes',
			options: [
				{
					type: 'number',
					label: 'Delay (ms)',
					id: 'delay',
					default: 0,
					min: 0.0,
					max: 500.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let delay = options.delay

				let args = [
					{
						type: 'f',
						value: delay,
					},
				]

				self.sendCommand('/matrixnode/delay/' + '*' + '/' + '*', args)
			},
		}

		actions.increaseMatrixNodeDelay = {
			name: 'Matrix Node - Increase Delay',
			description: 'Increase the Delay of a Matrix Node',
			options: [
				{
					type: 'number',
					label: 'Matrix Node Input',
					id: 'input',
					default: 1,
					min: 1,
     max: self.matrixInputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Matrix Node Output',
					id: 'output',
					default: 1,
					min: 1,
     max: self.matrixOutputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Delay Increase Amount',
					id: 'delay',
					default: 1,
					min: 0.1,
					max: 6.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let input = options.input.toString()
				let output = options.output.toString()
				let matrixNode = options.input + '/' + options.output
				let delay = options.delay

				let currentDelay = self.DATA?.matrixNode[input][output].delay

				if (currentDelay !== undefined) {
					let newDelay = currentDelay + delay

					if (newDelay > 500.0) {
						newDelay = 500.0
					}

					let args = [
						{
							type: 'f',
							value: newDelay,
						},
					]

					self.sendCommand('/matrixnode/delay/' + matrixNode, args)
				}
			},
		}

		actions.decreaseMatrixNodeDelay = {
			name: 'Matrix Node - Decrease Delay',
			description: 'Decrease the Delay of a Matrix Node',
			options: [
				{
					type: 'number',
					label: 'Matrix Node Input',
					id: 'input',
					default: 1,
					min: 1,
     max: self.matrixInputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Matrix Node Output',
					id: 'output',
					default: 1,
					min: 1,
     max: self.matrixOutputCount,
					required: true,
				},
				{
					type: 'number',
					label: 'Delay Decrease Amount',
					id: 'delay',
					default: 1,
					min: 0.1,
					max: 6.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let input = options.input.toString()
				let output = options.output.toString()
				let matrixNode = options.input + '/' + options.output
				let delay = options.delay

				let currentDelay = self.DATA?.matrixNode[input][output].delay

				if (currentDelay !== undefined) {
					let newDelay = currentDelay - delay

					if (newDelay < 0.0) {
						newDelay = 0.0
					}

					let args = [
						{
							type: 'f',
							value: newDelay,
						},
					]

					self.sendCommand('/matrixnode/delay/' + matrixNode, args)
				}
			},
		}

		actions.setMatrixOutputMute = {
			name: 'Matrix Output - Mute',
			description: 'Mute or Unmute a Matrix Output',
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
					type: 'dropdown',
					label: 'Mute',
					id: 'mute',
					default: 1,
					choices: [
						{ id: 1, label: 'Mute' },
						{ id: 0, label: 'Unmute' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput
				let mute = options.mute

				let args = [
					{
						type: 'i',
						value: mute,
					},
				]

				self.sendCommand('/matrixoutput/mute/' + matrixOutput, args)
			},
		}

		actions.setMatrixOutputMuteAll = {
			name: 'Matrix Output - Mute All',
			description: 'Mute or Unmute all Matrix Outputs',
			options: [
				{
					type: 'dropdown',
					label: 'Mute',
					id: 'mute',
					default: 1,
					choices: [
						{ id: 1, label: 'Mute' },
						{ id: 0, label: 'Unmute' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let mute = options.mute

				let args = [
					{
						type: 'i',
						value: mute,
					},
				]

				self.sendCommand('/matrixoutput/mute/' + '*', args)
			},
		}

		actions.setMatrixOutputGain = {
			name: 'Matrix Output - Gain',
			description: 'Set the Gain of a Matrix Output',
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
					label: 'Gain',
					id: 'gain',
					default: 0,
					min: -120.0,
					max: 24.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput
				let gain = options.gain

				let args = [
					{
						type: 'f',
						value: gain,
					},
				]

				self.sendCommand('/matrixoutput/gain/' + matrixOutput, args)
			},
		}

		actions.setMatrixOutputGainAll = {
			name: 'Matrix Output - Gain All',
			description: 'Set the Gain of all Matrix Outputs',
			options: [
				{
					type: 'number',
					label: 'Gain',
					id: 'gain',
					default: 0,
					min: -120.0,
					max: 24.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let gain = options.gain

				let args = [
					{
						type: 'f',
						value: gain,
					},
				]

				self.sendCommand('/matrixoutput/gain/' + '*', args)
			},
		}

		actions.increaseMatrixOutputGain = {
			name: 'Matrix Output - Increase Gain',
			description: 'Increase the Gain of a Matrix Output',
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
					label: 'Gain Increase Amount',
					id: 'gain',
					default: 1,
					min: 0.1,
					max: 6.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput.toString()
				let gain = options.gain

				let currentGain = self.DATA?.matrixOutput[matrixOutput].gain

				if (currentGain !== undefined) {
					let newGain = currentGain + gain

					if (newGain > 24.0) {
						newGain = 24.0
					}

					let args = [
						{
							type: 'f',
							value: newGain,
						},
					]

					self.sendCommand('/matrixoutput/gain/' + matrixOutput, args)
				}
			},
		}

		actions.decreaseMatrixOutputGain = {
			name: 'Matrix Output - Decrease Gain',
			description: 'Decrease the Gain of a Matrix Output',
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
					label: 'Gain Decrease Amount',
					id: 'gain',
					default: 1,
					min: 0.1,
					max: 6.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput.toString()
				let gain = options.gain

				let currentGain = self.DATA?.matrixOutput[matrixOutput].gain

				if (currentGain !== undefined) {
					let newGain = currentGain - gain

					if (newGain < -120.0) {
						newGain = -120.0
					}

					let args = [
						{
							type: 'f',
							value: newGain,
						},
					]

					self.sendCommand('/matrixoutput/gain/' + matrixOutput, args)
				}
			},
		}

		actions.setMatrixOutputDelay = {
			name: 'Matrix Output - Delay',
			description: 'Set the Delay of a Matrix Output',
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
					label: 'Delay (ms)',
					id: 'delay',
					default: 0,
					min: 0.0,
					max: 500.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput
				let delay = options.delay

				let args = [
					{
						type: 'f',
						value: delay,
					},
				]

				self.sendCommand('/matrixoutput/delay/' + matrixOutput, args)
			},
		}

		actions.setMatrixOutputDelayAll = {
			name: 'Matrix Output - Delay All',
			description: 'Set the Delay of all Matrix Outputs',
			options: [
				{
					type: 'number',
					label: 'Delay (ms)',
					id: 'delay',
					default: 0,
					min: 0.0,
					max: 500.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let delay = options.delay

				let args = [
					{
						type: 'f',
						value: delay,
					},
				]

				self.sendCommand('/matrixoutput/delay/' + '*', args)
			},
		}

		actions.increaseMatrixOutputDelay = {
			name: 'Matrix Output - Increase Delay',
			description: 'Increase the Delay of a Matrix Output',
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
					label: 'Delay Increase Amount',
					id: 'delay',
					default: 1,
					min: 0.1,
					max: 6.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput.toString()
				let delay = options.delay

				let currentDelay = self.DATA?.matrixOutput[matrixOutput].delay

				if (currentDelay !== undefined) {
					let newDelay = currentDelay + delay

					if (newDelay > 500.0) {
						newDelay = 500.0
					}

					let args = [
						{
							type: 'f',
							value: newDelay,
						},
					]

					self.sendCommand('/matrixoutput/delay/' + matrixOutput, args)
				}
			},
		}

		actions.decreaseMatrixOutputDelay = {
			name: 'Matrix Output - Decrease Delay',
			description: 'Decrease the Delay of a Matrix Output',
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
					label: 'Delay Decrease Amount',
					id: 'delay',
					default: 1,
					min: 0.1,
					max: 6.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput.toString()
				let delay = options.delay

				let currentDelay = self.DATA?.matrixOutput[matrixOutput].delay

				if (currentDelay !== undefined) {
					let newDelay = currentDelay - delay

					if (newDelay < 0.0) {
						newDelay = 0.0
					}

					let args = [
						{
							type: 'f',
							value: newDelay,
						},
					]

					self.sendCommand('/matrixoutput/delay/' + matrixOutput, args)
				}
			},
		}

		actions.setMatrixOutputDelayEnable = {
			name: 'Matrix Output - Delay Enable',
			description: 'Enable or Disable Delay of a Matrix Output',
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
					type: 'dropdown',
					label: 'Delay Enable',
					id: 'delayenable',
					default: 1,
					choices: [
						{ id: 1, label: 'Enable' },
						{ id: 0, label: 'Disable' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput
				let delayEnable = options.delayenable

				let args = [
					{
						type: 'i',
						value: delayEnable,
					},
				]

				self.sendCommand('/matrixoutput/delayenable/' + matrixOutput, args)
			},
		}

		actions.setMatrixOutputDelayEnableAll = {
			name: 'Matrix Output - Delay Enable All',
			description: 'Enable or Disable Delay of all Matrix Outputs',
			options: [
				{
					type: 'dropdown',
					label: 'Delay Enable',
					id: 'delayenable',
					default: 1,
					choices: [
						{ id: 1, label: 'Enable' },
						{ id: 0, label: 'Disable' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let delayEnable = options.delayenable

				let args = [
					{
						type: 'i',
						value: delayEnable,
					},
				]

				self.sendCommand('/matrixoutput/delayenable/' + '*', args)
			},
		}

		actions.setMatrixOutputEqEnable = {
			name: 'Matrix Output - EQ Enable',
			description: 'Enable or Disable EQ of a Matrix Output',
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
					type: 'dropdown',
					label: 'EQ Enable',
					id: 'eqenable',
					default: 1,
					choices: [
						{ id: 1, label: 'Enable' },
						{ id: 0, label: 'Disable' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput
				let eqEnable = options.eqenable

				let args = [
					{
						type: 'i',
						value: eqEnable,
					},
				]

				self.sendCommand('/matrixoutput/eqenable/' + matrixOutput, args)
			},
		}

		actions.setMatrixOutputEqEnableAll = {
			name: 'Matrix Output - EQ Enable All',
			description: 'Enable or Disable EQ of all Matrix Outputs',
			options: [
				{
					type: 'dropdown',
					label: 'EQ Enable',
					id: 'eqenable',
					default: 1,
					choices: [
						{ id: 1, label: 'Enable' },
						{ id: 0, label: 'Disable' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let eqEnable = options.eqenable

				let args = [
					{
						type: 'i',
						value: eqEnable,
					},
				]

				self.sendCommand('/matrixoutput/eqenable/' + '*', args)
			},
		}

		actions.setMatrixOutputPolarity = {
			name: 'Matrix Output - Polarity',
			description: 'Set the Polarity of a Matrix Output',
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
					type: 'dropdown',
					label: 'Polarity',
					id: 'polarity',
					default: 1,
					choices: [
						{ id: 1, label: 'Reversed' },
						{ id: 0, label: 'Normal' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput
				let polarity = options.polarity

				let args = [
					{
						type: 'i',
						value: polarity,
					},
				]

				self.sendCommand('/matrixoutput/polarity/' + matrixOutput, args)
			},
		}

		actions.setMatrixOutputPolarityAll = {
			name: 'Matrix Output - Polarity All',
			description: 'Set the Polarity of all Matrix Outputs',
			options: [
				{
					type: 'dropdown',
					label: 'Polarity',
					id: 'polarity',
					default: 1,
					choices: [
						{ id: 1, label: 'Reversed' },
						{ id: 0, label: 'Normal' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let polarity = options.polarity

				let args = [
					{
						type: 'i',
						value: polarity,
					},
				]

				self.sendCommand('/matrixoutput/polarity/' + '*', args)
			},
		}

		actions.setMatrixOutputChannelName = {
			name: 'Matrix Output - Channel Name',
			description: 'Set the Channel Name of a Matrix Output',
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
					type: 'textinput',
					label: 'Channel Name',
					id: 'channelname',
					default: 'Channel',
					useVariables: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput
				let channelName = options.channelname

				let args = [
					{
						type: 's',
						value: '' + channelName,
					},
				]

				self.sendCommand('/matrixoutput/channelname/' + matrixOutput, args)
			},
		}

		actions.setMatrixOutputLevelMeterPreMute = {
			name: 'Matrix Output - Level Meter Pre Mute',
			description: 'Set the Level Meter Pre Mute of a Matrix Output',
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
					label: 'Level Meter Pre Mute',
					id: 'levelmeterpremute',
					default: 0,
					min: -120.0,
					max: 0.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput
				let levelMeterPreMute = options.levelmeterpremute

				let args = [
					{
						type: 'f',
						value: levelMeterPreMute,
					},
				]

				self.sendCommand('/matrixoutput/levelmeterpremute/' + matrixOutput, args)
			},
		}

		actions.setMatrixOutputLevelMeterPreMuteAll = {
			name: 'Matrix Output - Level Meter Pre Mute All',
			description: 'Set the Level Meter Pre Mute of all Matrix Outputs',
			options: [
				{
					type: 'number',
					label: 'Level Meter Pre Mute',
					id: 'levelmeterpremute',
					default: 0,
					min: -120.0,
					max: 0.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let levelMeterPreMute = options.levelmeterpremute

				let args = [
					{
						type: 'f',
						value: levelMeterPreMute,
					},
				]

				self.sendCommand('/matrixoutput/levelmeterpremute/' + '*', args)
			},
		}

		actions.increaseMatrixOutputLevelMeterPreMute = {
			name: 'Matrix Output - Increase Level Meter Pre Mute',
			description: 'Increase the Level Meter Pre Mute of a Matrix Output',
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
					label: 'Level Meter Pre Mute Increase Amount',
					id: 'levelmeterpremute',
					default: 1,
					min: 0.1,
					max: 6.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput.toString()
				let levelMeterPreMute = options.levelmeterpremute

				let currentLevelMeterPreMute = self.DATA?.matrixOutput[matrixOutput].levelMeterPreMute

				if (currentLevelMeterPreMute !== undefined) {
					let newLevelMeterPreMute = currentLevelMeterPreMute + levelMeterPreMute

					if (levelMeterPreMute > 0.0) {
						levelMeterPreMute = 0.0
					}

					let args = [
						{
							type: 'f',
							value: newLevelMeterPreMute,
						},
					]

					self.sendCommand('/matrixoutput/levelmeterpremute/' + matrixOutput, args)
				}
			},
		}

		actions.decreaseMatrixOutputLevelMeterPreMute = {
			name: 'Matrix Output - Decrease Level Meter Pre Mute',
			description: 'Decrease the Level Meter Pre Mute of a Matrix Output',
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
					label: 'Level Meter Pre Mute Decrease Amount',
					id: 'levelmeterpremute',
					default: 1,
					min: 0.1,
					max: 6.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput.toString()
				let levelMeterPreMute = options.levelmeterpremute

				let currentLevelMeterPreMute = self.DATA?.matrixOutput[matrixOutput].levelMeterPreMute

				if (currentLevelMeterPreMute !== undefined) {
					let newLevelMeterPreMute = currentLevelMeterPreMute - levelMeterPreMute

					if (levelMeterPreMute < -120.0) {
						levelMeterPreMute = -120.0
					}

					let args = [
						{
							type: 'f',
							value: newLevelMeterPreMute,
						},
					]

					self.sendCommand('/matrixoutput/levelmeterpremute/' + matrixOutput, args)
				}
			},
		}

		actions.setMatrixOutputLevelMeterPostMute = {
			name: 'Matrix Output - Level Meter Post Mute',
			description: 'Set the Level Meter Post Mute of a Matrix Output',
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
					label: 'Level Meter Post Mute',
					id: 'levelmeterpostmute',
					default: 0,
					min: -120.0,
					max: 0.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput
				let levelMeterPostMute = options.levelmeterpostmute

				let args = [
					{
						type: 'f',
						value: levelMeterPostMute,
					},
				]

				self.sendCommand('/matrixoutput/levelmeterpostmute/' + matrixOutput, args)
			},
		}

		actions.setMatrixOutputLevelMeterPostMuteAll = {
			name: 'Matrix Output - Level Meter Post Mute All',
			description: 'Set the Level Meter Post Mute of all Matrix Outputs',
			options: [
				{
					type: 'number',
					label: 'Level Meter Post Mute',
					id: 'levelmeterpostmute',
					default: 0,
					min: -120.0,
					max: 0.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let levelMeterPostMute = options.levelmeterpostmute

				let args = [
					{
						type: 'f',
						value: levelMeterPostMute,
					},
				]

				self.sendCommand('/matrixoutput/levelmeterpostmute/' + '*', args)
			},
		}

		actions.increaseMatrixOutputLevelMeterPostMute = {
			name: 'Matrix Output - Increase Level Meter Post Mute',
			description: 'Increase the Level Meter Post Mute of a Matrix Output',
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
					label: 'Level Meter Post Mute Increase Amount',
					id: 'levelmeterpostmute',
					default: 1,
					min: 0.1,
					max: 6.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput.toString()
				let levelMeterPostMute = options.levelmeterpostmute

				let currentLevelMeterPostMute = self.DATA?.matrixOutput[matrixOutput].levelMeterPostMute

				if (currentLevelMeterPostMute !== undefined) {
					let newLevelMeterPostMute = currentLevelMeterPostMute + levelMeterPostMute

					if (levelMeterPostMute > 0.0) {
						levelMeterPostMute = 0.0
					}

					let args = [
						{
							type: 'f',
							value: newLevelMeterPostMute,
						},
					]

					self.sendCommand('/matrixoutput/levelmeterpostmute/' + matrixOutput, args)
				}
			},
		}

		actions.decreaseMatrixOutputLevelMeterPostMute = {
			name: 'Matrix Output - Decrease Level Meter Post Mute',
			description: 'Decrease the Level Meter Post Mute of a Matrix Output',
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
					label: 'Level Meter Post Mute Decrease Amount',
					id: 'levelmeterpostmute',
					default: 1,
					min: 0.1,
					max: 6.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixOutput = options.matrixoutput.toString()
				let levelMeterPostMute = options.levelmeterpostmute

				let currentLevelMeterPostMute = self.DATA?.matrixOutput[matrixOutput].levelMeterPostMute

				if (currentLevelMeterPostMute !== undefined) {
					let newLevelMeterPostMute = currentLevelMeterPostMute - levelMeterPostMute

					if (levelMeterPostMute < -120.0) {
						levelMeterPostMute = -120.0
					}

					let args = [
						{
							type: 'f',
							value: newLevelMeterPostMute,
						},
					]

					self.sendCommand('/matrixoutput/levelmeterpostmute/' + matrixOutput, args)
				}
			},
		}

		actions.setPositioningSourceSpread = {
			name: 'Positioning - Source Spread',
			description: 'Set the Source Spread for a Sound Object',
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
				{
					type: 'number',
					label: 'Source Spread',
					id: 'sourcespread',
					default: 0,
					min: 0.0,
					max: 1.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let soundObject = options.soundobject
				let sourceSpread = options.sourcespread

				let args = [
					{
						type: 'f',
						value: sourceSpread,
					},
				]

				self.sendCommand('/positioning/source_spread/' + soundObject, args)
			},
		}

		actions.increasePositioningSourceSpread = {
			name: 'Positioning - Increase Source Spread',
			description: 'Increase the Source Spread for a Sound Object',
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
				{
					type: 'number',
					label: 'Source Spread Increase Amount',
					id: 'sourcespread',
					default: 0.1,
					min: 0.1,
					max: 1.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let soundObject = options.soundobject.toString()
				let sourceSpread = options.sourcespread

				let currentSourceSpread = self.DATA?.soundObject[soundObject].sourceSpread

				if (currentSourceSpread !== undefined) {
					let newSourceSpread = currentSourceSpread + sourceSpread

					if (sourceSpread > 1.0) {
						sourceSpread = 1.0
					}

					let args = [
						{
							type: 'f',
							value: newSourceSpread,
						},
					]

					self.sendCommand('/positioning/source_spread/' + soundObject, args)
				}
			},
		}

		actions.decreasePositioningSourceSpread = {
			name: 'Positioning - Decrease Source Spread',
			description: 'Decrease the Source Spread for a Sound Object',
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
				{
					type: 'number',
					label: 'Source Spread Decrease Amount',
					id: 'sourcespread',
					default: 0.1,
					min: 0.1,
					max: 1.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let soundObject = options.soundobject.toString()
				let sourceSpread = options.sourcespread

				let currentSourceSpread = self.DATA?.soundObject[soundObject].sourceSpread

				if (currentSourceSpread !== undefined) {
					let newSourceSpread = currentSourceSpread - sourceSpread

					if (sourceSpread < 0.0) {
						sourceSpread = 0.0
					}

					let args = [
						{
							type: 'f',
							value: newSourceSpread,
						},
					]

					self.sendCommand('/positioning/source_spread/' + soundObject, args)
				}
			},
		}

		actions.setPositioningSourceDelayMode = {
			name: 'Positioning - Source Delay Mode',
			description: 'Set the Source Delay Mode for a Sound Object',
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
				{
					type: 'dropdown',
					label: 'Source Delay Mode',
					id: 'sourcedelaymode',
					default: 0,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: 1, label: 'Tight' },
						{ id: 2, label: 'Full' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let soundObject = options.soundobject
				let sourceDelayMode = options.sourcedelaymode

				let args = [
					{
						type: 'i',
						value: sourceDelayMode,
					},
				]

				self.sendCommand('/positioning/source_delaymode/' + soundObject, args)
				const so = soundObject.toString()
				if (self.DATA?.positioning?.[so]) {
					self.DATA.positioning[so].sourceDelayMode = sourceDelayMode
				}
				self.checkFeedbacks(
					'positioningSourceDelayMode',
					'positioningSourceDelayModeAll',
					'positioningSourceDelayModeTight',
					'positioningSourceDelayModeFull'
				)
			},
		}

		actions.cyclePositioningSourceDelayMode = {
			name: 'Positioning - Cycle Source Delay Mode',
			description: 'Cycle Source Delay Mode for a Sound Object: Off → Tight → Full → Off',
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
			callback: async function (action) {
				let options = action.options
				let soundObject = options.soundobject
				let so = soundObject.toString()
				let current = Number(self.DATA?.positioning?.[so]?.sourceDelayMode)
				if (!Number.isFinite(current) || current < 0 || current > 2) {
					current = 0
				}
				let next = (current + 1) % 3

				let args = [
					{
						type: 'i',
						value: next,
					},
				]

				self.sendCommand('/positioning/source_delaymode/' + soundObject, args)
				if (self.DATA?.positioning?.[so]) {
					self.DATA.positioning[so].sourceDelayMode = next
				}
				self.checkFeedbacks(
					'positioningSourceDelayMode',
					'positioningSourceDelayModeAll',
					'positioningSourceDelayModeTight',
					'positioningSourceDelayModeFull'
				)
			},
		}

		actions.setPositioningSourceDelayModeAll = {
			name: 'Positioning - Source Delay Mode All',
			description: 'Set the Source Delay Mode for all Sound Objects',
			options: [
				{
					type: 'dropdown',
					label: 'Source Delay Mode',
					id: 'sourcedelaymode',
					default: 0,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: 1, label: 'Tight' },
						{ id: 2, label: 'Full' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let sourceDelayMode = options.sourcedelaymode

				let args = [
					{
						type: 'i',
						value: sourceDelayMode,
					},
				]

				self.sendCommand('/positioning/source_delaymode/*', args)

				self.DATA.positioningDelayModeAll = sourceDelayMode
				if (self.DATA?.positioning) {
					for (let i = 1; i < self.DATA.positioning.length; i++) {
						if (self.DATA.positioning[i]) {
							self.DATA.positioning[i].sourceDelayMode = sourceDelayMode
						}
					}
				}
				self.checkFeedbacks(
					'positioningSourceDelayMode',
					'positioningSourceDelayModeAll',
					'positioningSourceDelayModeTight',
					'positioningSourceDelayModeFull'
				)
			},
		}

		actions.setPositioningSourcePosition = {
			name: 'Positioning - Source Position',
			description: 'Set the Source Position for a Sound Object',
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
				{
					type: 'textinput',
					label: 'Source Position X',
					id: 'sourceposition',
					default: '0',
				},
				{
					type: 'textinput',
					label: 'Source Position Y',
					id: 'sourceposition',
					default: '0',
				},
				{
					type: 'textinput',
					label: 'Source Position Z',
					id: 'sourceposition',
					default: '0',
				},
			],
			callback: async function (action) {
				let options = action.options
				let soundObject = options.soundobject
				let sourcePositionX = options.sourceposition
				let sourcePositionY = options.sourceposition
				let sourcePositionZ = options.sourceposition

				let args = [
					{
						type: 'f',
						value: sourcePositionX,
					},
					{
						type: 'f',
						value: sourcePositionY,
					},
					{
						type: 'f',
						value: sourcePositionZ,
					},
				]

				self.sendCommand('/positioning/source_position/' + soundObject, args)
			},
		}

		actions.setPositioningSourcePositionXY = {
			name: 'Positioning - Source Position XY',
			description: 'Set the Source Position XY for a Sound Object',
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
				{
					type: 'textinput',
					label: 'Source Position X',
					id: 'sourceposition',
					default: '0',
				},
				{
					type: 'textinput',
					label: 'Source Position Y',
					id: 'sourceposition',
					default: '0',
				},
			],
			callback: async function (action) {
				let options = action.options
				let soundObject = options.soundobject
				let sourcePositionX = options.sourceposition
				let sourcePositionY = options.sourceposition

				let args = [
					{
						type: 'f',
						value: sourcePositionX,
					},
					{
						type: 'f',
						value: sourcePositionY,
					},
				]

				self.sendCommand('/positioning/source_position_xy/' + soundObject, args)
			},
		}

		actions.setPositioningSourcePositionX = {
			name: 'Positioning - Source Position X',
			description: 'Set the Source Position X for a Sound Object',
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
				{
					type: 'textinput',
					label: 'Source Position X',
					id: 'sourceposition',
					default: '0',
				},
			],
			callback: async function (action) {
				let options = action.options
				let soundObject = options.soundobject
				let sourcePositionX = options.sourceposition

				let args = [
					{
						type: 'f',
						value: sourcePositionX,
					},
				]

				self.sendCommand('/positioning/source_position_x/' + soundObject, args)
			},
		}

		actions.increasePositioningSourcePositionX = {
			name: 'Positioning - Increase Source Position X',
			description: 'Increase the Source Position X for a Sound Object',
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
				{
					type: 'number',
					label: 'Source Position X Increase Amount',
					id: 'sourceposition',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let soundObject = options.soundobject.toString()
				let sourcePositionX = options.sourceposition

				let currentSourcePositionX = self.DATA?.positioning[id].sourcePositionX

				if (currentSourcePositionX !== undefined) {
					let newSourcePositionX = currentSourcePositionX + sourcePositionX

					let args = [
						{
							type: 'f',
							value: newSourcePositionX,
						},
					]

					self.sendCommand('/positioning/source_position_x/' + soundObject, args)
				}
			},
		}

		actions.decreasePositioningSourcePositionX = {
			name: 'Positioning - Decrease Source Position X',
			description: 'Decrease the Source Position X for a Sound Object',
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
				{
					type: 'number',
					label: 'Source Position X Decrease Amount',
					id: 'sourceposition',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let soundObject = options.soundobject.toString()
				let sourcePositionX = options.sourceposition

				let currentSourcePositionX = self.DATA?.positioning[id].sourcePositionX

				if (currentSourcePositionX !== undefined) {
					let newSourcePositionX = currentSourcePositionX - sourcePositionX

					let args = [
						{
							type: 'f',
							value: newSourcePositionX,
						},
					]

					self.sendCommand('/positioning/source_position_x/' + soundObject, args)
				}
			},
		}

		actions.setPositioningSourcePositionY = {
			name: 'Positioning - Source Position Y',
			description: 'Set the Source Position Y for a Sound Object',
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
				{
					type: 'textinput',
					label: 'Source Position Y',
					id: 'sourceposition',
					default: '0',
				},
			],
			callback: async function (action) {
				let options = action.options
				let soundObject = options.soundobject
				let sourcePositionY = options.sourceposition

				let args = [
					{
						type: 'f',
						value: sourcePositionY,
					},
				]

				self.sendCommand('/positioning/source_position_y/' + soundObject, args)
			},
		}

		actions.increasePositioningSourcePositionY = {
			name: 'Positioning - Increase Source Position Y',
			description: 'Increase the Source Position Y for a Sound Object',
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
				{
					type: 'number',
					label: 'Source Position Y Increase Amount',
					id: 'sourceposition',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let soundObject = options.soundobject.toString()
				let sourcePositionY = options.sourceposition

				let currentSourcePositionY = self.DATA?.positioning[id].sourcePositionY

				if (currentSourcePositionY !== undefined) {
					let newSourcePositionY = currentSourcePositionY + sourcePositionY

					let args = [
						{
							type: 'f',
							value: newSourcePositionY,
						},
					]

					self.sendCommand('/positioning/source_position_y/' + soundObject, args)
				}
			},
		}

		actions.decreasePositioningSourcePositionY = {
			name: 'Positioning - Decrease Source Position Y',
			description: 'Decrease the Source Position Y for a Sound Object',
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
				{
					type: 'number',
					label: 'Source Position Y Decrease Amount',
					id: 'sourceposition',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let soundObject = options.soundobject.toString()
				let sourcePositionY = options.sourceposition

				let currentSourcePositionY = self.DATA?.positioning[id].sourcePositionY

				if (currentSourcePositionY !== undefined) {
					let newSourcePositionY = currentSourcePositionY - sourcePositionY

					let args = [
						{
							type: 'f',
							value: newSourcePositionY,
						},
					]

					self.sendCommand('/positioning/source_position_y/' + soundObject, args)
				}
			},
		}

		actions.setCoordinateMappingSourcePosition = {
			name: 'Coordinate Mapping - Source Position',
			description: 'Set the Source Position for a Sound Object',
			options: [
				{
					type: 'number',
					label: 'Coordinate Mapping Area',
					id: 'coordinatemappingarea',
					default: 1,
					min: 1,
					max: 4,
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
				{
					type: 'textinput',
					label: 'Source Position X',
					id: 'sourceposition',
					default: '0',
				},
				{
					type: 'textinput',
					label: 'Source Position Y',
					id: 'sourceposition',
					default: '0',
				},
				{
					type: 'textinput',
					label: 'Source Position Z',
					id: 'sourceposition',
					default: '0',
				},
			],
			callback: async function (action) {
				let options = action.options
				let coordinateMappingArea = options.coordinatemappingarea
				let soundObject = options.soundobject
				let sourcePositionX = options.sourceposition
				let sourcePositionY = options.sourceposition
				let sourcePositionZ = options.sourceposition

				let args = [
					{
						type: 'f',
						value: sourcePositionX,
					},
					{
						type: 'f',
						value: sourcePositionY,
					},
					{
						type: 'f',
						value: sourcePositionZ,
					},
				]

				self.sendCommand(
					'/coordinatemapping/source_position/' + coordinateMappingArea + '/' + soundObject,
					args
				)
			},
		}

		actions.setCoordinateMappingSourcePositionXY = {
			name: 'Coordinate Mapping - Source Position XY',
			description: 'Set the Source Position XY for a Sound Object',
			options: [
				{
					type: 'number',
					label: 'Coordinate Mapping Area',
					id: 'coordinatemappingarea',
					default: 1,
					min: 1,
					max: 4,
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
				{
					type: 'textinput',
					label: 'Source Position X',
					id: 'sourceposition',
					default: '0',
				},
				{
					type: 'textinput',
					label: 'Source Position Y',
					id: 'sourceposition',
					default: '0',
				},
			],
			callback: async function (action) {
				let options = action.options
				let coordinateMappingArea = options.coordinatemappingarea
				let soundObject = options.soundobject
				let sourcePositionX = options.sourceposition
				let sourcePositionY = options.sourceposition

				let args = [
					{
						type: 'f',
						value: sourcePositionX,
					},
					{
						type: 'f',
						value: sourcePositionY,
					},
				]

				self.sendCommand(
					'/coordinatemapping/source_position_xy/' + coordinateMappingArea + '/' + soundObject,
					args
				)
			},
		}

		actions.setCoordinateMappingSourcePositionX = {
			name: 'Coordinate Mapping - Source Position X',
			description: 'Set the Source Position X for a Sound Object',
			options: [
				{
					type: 'number',
					label: 'Coordinate Mapping Area',
					id: 'coordinatemappingarea',
					default: 1,
					min: 1,
					max: 4,
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
				{
					type: 'textinput',
					label: 'Source Position X',
					id: 'sourceposition',
					default: '0',
				},
			],
			callback: async function (action) {
				let options = action.options
				let coordinateMappingArea = options.coordinatemappingarea
				let soundObject = options.soundobject
				let sourcePositionX = options.sourceposition

				let args = [
					{
						type: 'f',
						value: sourcePositionX,
					},
				]

				self.sendCommand(
					'/coordinatemapping/source_position_x/' + coordinateMappingArea + '/' + soundObject,
					args
				)
			},
		}

		actions.increaseCoordinateMappingSourcePositionX = {
			name: 'Coordinate Mapping - Increase Source Position X',
			description: 'Increase the Source Position X for a Sound Object',
			options: [
				{
					type: 'number',
					label: 'Coordinate Mapping Area',
					id: 'coordinatemappingarea',
					default: 1,
					min: 1,
					max: 4,
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
				{
					type: 'number',
					label: 'Source Position X Increase Amount',
					id: 'sourceposition',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let coordinateMappingArea = options.coordinatemappingarea.toString()
				let soundObject = options.soundobject.toString()
				let sourcePositionX = options.sourceposition

				let currentSourcePositionX =
					self.DATA?.coordinateMapping[coordinateMappingArea][soundObject].sourcePositionX

				if (currentSourcePositionX !== undefined) {
					let newSourcePositionX = currentSourcePositionX + sourcePositionX

					let args = [
						{
							type: 'f',
							value: newSourcePositionX,
						},
					]

					self.sendCommand(
						'/coordinatemapping/source_position_x/' + coordinateMappingArea + '/' + soundObject,
						args
					)
				}
			},
		}

		actions.decreaseCoordinateMappingSourcePositionX = {
			name: 'Coordinate Mapping - Decrease Source Position X',
			description: 'Decrease the Source Position X for a Sound Object',
			options: [
				{
					type: 'number',
					label: 'Coordinate Mapping Area',
					id: 'coordinatemappingarea',
					default: 1,
					min: 1,
					max: 4,
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
				{
					type: 'number',
					label: 'Source Position X Decrease Amount',
					id: 'sourceposition',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let coordinateMappingArea = options.coordinatemappingarea.toString()
				let soundObject = options.soundobject.toString()
				let sourcePositionX = options.sourceposition

				let currentSourcePositionX =
					self.DATA?.coordinateMapping[coordinateMappingArea][soundObject].sourcePositionX

				if (currentSourcePositionX !== undefined) {
					let newSourcePositionX = currentSourcePositionX - sourcePositionX

					let args = [
						{
							type: 'f',
							value: newSourcePositionX,
						},
					]

					self.sendCommand(
						'/coordinatemapping/source_position_x/' + coordinateMappingArea + '/' + soundObject,
						args
					)
				}
			},
		}

		actions.setCoordinateMappingSourcePositionY = {
			name: 'Coordinate Mapping - Source Position Y',
			description: 'Set the Source Position Y for a Sound Object',
			options: [
				{
					type: 'number',
					label: 'Coordinate Mapping Area',
					id: 'coordinatemappingarea',
					default: 1,
					min: 1,
					max: 4,
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
				{
					type: 'textinput',
					label: 'Source Position Y',
					id: 'sourceposition',
					default: '0',
				},
			],
			callback: async function (action) {
				let options = action.options
				let coordinateMappingArea = options.coordinatemappingarea
				let soundObject = options.soundobject
				let sourcePositionY = options.sourceposition

				let args = [
					{
						type: 'f',
						value: sourcePositionY,
					},
				]

				self.sendCommand(
					'/coordinatemapping/source_position_y/' + coordinateMappingArea + '/' + soundObject,
					args
				)
			},
		}

		actions.increaseCoordinateMappingSourcePositionY = {
			name: 'Coordinate Mapping - Increase Source Position Y',
			description: 'Increase the Source Position Y for a Sound Object',
			options: [
				{
					type: 'number',
					label: 'Coordinate Mapping Area',
					id: 'coordinatemappingarea',
					default: 1,
					min: 1,
					max: 4,
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
				{
					type: 'number',
					label: 'Source Position Y Increase Amount',
					id: 'sourceposition',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let coordinateMappingArea = options.coordinatemappingarea.toString()
				let soundObject = options.soundobject.toString()

				let currentSourcePositionY =
					self.DATA?.coordinateMapping[coordinateMappingArea][soundObject].sourcePositionY

				if (currentSourcePositionY !== undefined) {
					let newSourcePositionY = currentSourcePositionY + sourcePositionY

					let args = [
						{
							type: 'f',
							value: newSourcePositionY,
						},
					]

					self.sendCommand(
						'/coordinatemapping/source_position_y/' + coordinateMappingArea + '/' + soundObject,
						args
					)
				}
			},
		}

		actions.decreaseCoordinateMappingSourcePositionY = {
			name: 'Coordinate Mapping - Decrease Source Position Y',
			description: 'Decrease the Source Position Y for a Sound Object',
			options: [
				{
					type: 'number',
					label: 'Coordinate Mapping Area',
					id: 'coordinatemappingarea',
					default: 1,
					min: 1,
					max: 4,
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
				{
					type: 'number',
					label: 'Source Position Y Decrease Amount',
					id: 'sourceposition',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let coordinateMappingArea = options.coordinatemappingarea.toString()
				let soundObject = options.soundobject.toString()
				let sourcePositionY = options.sourceposition

				let currentSourcePositionY =
					self.DATA?.coordinateMapping[coordinateMappingArea][soundObject].sourcePositionY

				if (currentSourcePositionY !== undefined) {
					let newSourcePositionY = currentSourcePositionY - sourcePositionY

					let args = [
						{
							type: 'f',
							value: newSourcePositionY,
						},
					]

					self.sendCommand(
						'/coordinatemapping/source_position_y/' + coordinateMappingArea + '/' + soundObject,
						args
					)
				}
			},
		}

		actions.setMatrixSettingsReverbRoomId = {
			name: 'Matrix Settings - Reverb Room ID',
			description: 'Set the Reverb Room ID',
			options: [
				{
					type: 'dropdown',
					label: 'Room Number',
					id: 'reverbroomid',
					default: 5,
					choices: self.CHOICES_REVERB_ROOMS,
				},
			],
			callback: async function (action) {
				let options = action.options
				let reverbRoomId = options.reverbroomid

				let args = [
					{
						type: 'i',
						value: reverbRoomId,
					},
				]

				self.sendCommand('/matrixsettings/reverbroomid', args)
			},
		}

		actions.setMatrixSettingsReverbPreDelayFactor = {
			name: 'Matrix Settings - Reverb Pre Delay Factor',
			description: 'Set the Reverb Pre Delay Factor',
			options: [
				{
					type: 'number',
					label: 'Pre Delay Factor',
					id: 'reverbpredelayfactor',
					default: 0,
					min: 0.2,
					max: 2.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let reverbPreDelayFactor = options.reverbpredelayfactor

				let args = [
					{
						type: 'f',
						value: reverbPreDelayFactor,
					},
				]

				self.sendCommand('/matrixsettings/reverbpredelayfactor', args)
			},
		}

		actions.increaseMatrixSettingsReverbPreDelayFactor = {
			name: 'Matrix Settings - Increase Reverb Pre Delay Factor',
			description: 'Increase the Reverb Pre Delay Factor',
			options: [
				{
					type: 'number',
					label: 'Pre Delay Factor Increase Amount',
					id: 'reverbpredelayfactor',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let reverbPreDelayFactor = options.reverbpredelayfactor

				let currentReverbPreDelayFactor = self.DATA?.matrixSettings.reverbPreDelayFactor

				if (currentReverbPreDelayFactor !== undefined) {
					let newReverbPreDelayFactor = currentReverbPreDelayFactor + reverbPreDelayFactor

					if (reverbPreDelayFactor > 2.0) {
						reverbPreDelayFactor = 2.0
					}

					let args = [
						{
							type: 'f',
							value: newReverbPreDelayFactor,
						},
					]

					self.sendCommand('/matrixsettings/reverbpredelayfactor', args)
				}
			},
		}

		actions.decreaseMatrixSettingsReverbPreDelayFactor = {
			name: 'Matrix Settings - Decrease Reverb Pre Delay Factor',
			description: 'Decrease the Reverb Pre Delay Factor',
			options: [
				{
					type: 'number',
					label: 'Pre Delay Factor Decrease Amount',
					id: 'reverbpredelayfactor',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let reverbPreDelayFactor = options.reverbpredelayfactor

				let currentReverbPreDelayFactor = self.DATA?.matrixSettings.reverbPreDelayFactor

				if (currentReverbPreDelayFactor !== undefined) {
					let newReverbPreDelayFactor = currentReverbPreDelayFactor - reverbPreDelayFactor

					if (reverbPreDelayFactor < 0.2) {
						reverbPreDelayFactor = 0.2
					}

					let args = [
						{
							type: 'f',
							value: newReverbPreDelayFactor,
						},
					]

					self.sendCommand('/matrixsettings/reverbpredelayfactor', args)
				}
			},
		}

		actions.setMatrixSettingsReverbRearLevel = {
			name: 'Matrix Settings - Reverb Rear Level',
			description: 'Set the Reverb Rear Level',
			options: [
				{
					type: 'number',
					label: 'Rear Level',
					id: 'reverbrearlevel',
					default: 0,
					min: -24.0,
					max: 24.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let reverbRearLevel = options.reverbrearlevel

				let args = [
					{
						type: 'f',
						value: reverbRearLevel,
					},
				]

				self.sendCommand('/matrixsettings/reverbrearlevel', args)
			},
		}

		actions.increaseMatrixSettingsReverbRearLevel = {
			name: 'Matrix Settings - Increase Reverb Rear Level',
			description: 'Increase the Reverb Rear Level',
			options: [
				{
					type: 'number',
					label: 'Rear Level Increase Amount',
					id: 'reverbrearlevel',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let reverbRearLevel = options.reverbrearlevel

				let currentReverbRearLevel = self.DATA?.matrixSettings.reverbRearLevel

				if (currentReverbRearLevel !== undefined) {
					let newReverbRearLevel = currentReverbRearLevel + reverbRearLevel

					if (reverbRearLevel > 24.0) {
						reverbRearLevel = 24.0
					}

					let args = [
						{
							type: 'f',
							value: newReverbRearLevel,
						},
					]

					self.sendCommand('/matrixsettings/reverbrearlevel', args)
				}
			},
		}

		actions.decreaseMatrixSettingsReverbRearLevel = {
			name: 'Matrix Settings - Decrease Reverb Rear Level',
			description: 'Decrease the Reverb Rear Level',
			options: [
				{
					type: 'number',
					label: 'Rear Level Decrease Amount',
					id: 'reverbrearlevel',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let reverbRearLevel = options.reverbrearlevel

				let currentReverbRearLevel = self.DATA?.matrixSettings.reverbRearLevel

				if (currentReverbRearLevel !== undefined) {
					let newReverbRearLevel = currentReverbRearLevel - reverbRearLevel

					if (reverbRearLevel < -24.0) {
						reverbRearLevel = -24.0
					}

					let args = [
						{
							type: 'f',
							value: newReverbRearLevel,
						},
					]

					self.sendCommand('/matrixsettings/reverbrearlevel', args)
				}
			},
		}

		actions.setMatrixInputReverbSendGain = {
			name: 'Matrix Input - Reverb Send Gain',
			description: 'Set the Reverb Send Gain of a Matrix Input',
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
					label: 'Reverb Send Gain',
					id: 'reverbsendgain',
					default: 0,
					min: -120.0,
					max: 24.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput
				let reverbSendGain = options.reverbsendgain

				let args = [
					{
						type: 'f',
						value: reverbSendGain,
					},
				]

				self.sendCommand('/matrixinput/reverbsendgain/' + matrixInput, args)
			},
		}

		actions.setMatrixInputReverbSendGainAll = {
			name: 'Matrix Input - Reverb Send Gain (All)',
			description: 'Set the Reverb Send Gain of all Matrix Inputs',
			options: [
				{
					type: 'number',
					label: 'Reverb Send Gain',
					id: 'reverbsendgain',
					default: 0,
					min: -120.0,
					max: 24.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let reverbSendGain = options.reverbsendgain

				let args = [
					{
						type: 'f',
						value: reverbSendGain,
					},
				]

				self.sendCommand('/matrixinput/reverbsendgain/' + '*', args)
			},
		}

		actions.increaseMatrixInputReverbSendGain = {
			name: 'Matrix Input - Increase Reverb Send Gain',
			description: 'Increase the Reverb Send Gain of a Matrix Input',
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
					label: 'Reverb Send Gain Increase Amount',
					id: 'reverbsendgain',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput.toString()
				let reverbSendGain = options.reverbsendgain

				let currentReverbSendGain = self.DATA?.matrixInput[matrixInput].reverbSendGain

				if (currentReverbSendGain !== undefined) {
					let newReverbSendGain = currentReverbSendGain + reverbSendGain

					let args = [
						{
							type: 'f',
							value: newReverbSendGain,
						},
					]

					self.sendCommand('/matrixinput/reverbsendgain/' + matrixInput, args)
				}
			},
		}

		actions.decreaseMatrixInputReverbSendGain = {
			name: 'Matrix Input - Decrease Reverb Send Gain',
			description: 'Decrease the Reverb Send Gain of a Matrix Input',
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
					label: 'Reverb Send Gain Decrease Amount',
					id: 'reverbsendgain',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput.toString()
				let reverbSendGain = options.reverbsendgain

				let currentReverbSendGain = self.DATA?.matrixInput[matrixInput].reverbSendGain

				if (currentReverbSendGain !== undefined) {
					let newReverbSendGain = currentReverbSendGain - reverbSendGain

					let args = [
						{
							type: 'f',
							value: newReverbSendGain,
						},
					]

					self.sendCommand('/matrixinput/reverbsendgain/' + matrixInput, args)
				}
			},
		}

		actions.setReverbInputGain = {
			name: 'Reverb Input - Gain',
			description: 'Set the Gain of a Reverb Input',
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
					label: 'Gain',
					id: 'gain',
					default: 0,
					min: -120.0,
					max: 24.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput
				let gain = options.gain

				let args = [
					{
						type: 'f',
						value: gain,
					},
				]

				self.sendCommand('/reverbinput/gain/' + matrixInput, args)
			},
		}

		actions.setReverbInputGainAll = {
			name: 'Reverb Input - Gain (All)',
			description: 'Set the Gain of all Reverb Inputs',
			options: [
				{
					type: 'number',
					label: 'Gain',
					id: 'gain',
					default: 0,
					min: -120.0,
					max: 24.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let gain = options.gain

				let args = [
					{
						type: 'f',
						value: gain,
					},
				]

				self.sendCommand('/reverbinput/gain/' + '*', args)
			},
		}

		actions.increaseReverbInputGain = {
			name: 'Reverb Input - Increase Gain',
			description: 'Increase the Gain of a Reverb Input',
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
					label: 'Gain Increase Amount',
					id: 'gain',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput.toString()
				let gain = options.gain

				let currentGain = self.DATA?.reverbInput[matrixInput].gain

				if (currentGain !== undefined) {
					let newGain = currentGain + gain

					let args = [
						{
							type: 'f',
							value: newGain,
						},
					]

					self.sendCommand('/reverbinput/gain/' + matrixInput, args)
				}
			},
		}

		actions.decreaseReverbInputGain = {
			name: 'Reverb Input - Decrease Gain',
			description: 'Decrease the Gain of a Reverb Input',
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
					label: 'Gain Decrease Amount',
					id: 'gain',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput.toString()
				let gain = options.gain

				let currentGain = self.DATA?.reverbInput[matrixInput].gain

				if (currentGain !== undefined) {
					let newGain = currentGain - gain

					let args = [
						{
							type: 'f',
							value: newGain,
						},
					]

					self.sendCommand('/reverbinput/gain/' + matrixInput, args)
				}
			},
		}

		actions.setReverbInputProcessingMute = {
			name: 'Reverb Input Processing - Mute',
			description: 'Mute or Unmute the Processing of a Reverb Input',
			options: [
				{
					type: 'number',
					label: 'Zone',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: 4,
					required: true,
				},
				{
					type: 'dropdown',
					label: 'Mute',
					id: 'mute',
					default: 1,
					choices: [
						{ id: 1, label: 'Mute' },
						{ id: 0, label: 'Unmute' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput
				let mute = options.mute

				let args = [
					{
						type: 'i',
						value: mute,
					},
				]

				self.sendCommand('/reverbinputprocessing/mute/' + matrixInput, args)
			},
		}

		actions.setReverbInputProcessingMuteAll = {
			name: 'Reverb Input Processing - Mute (All)',
			description: 'Mute or Unmute the Processing of all Reverb Inputs',
			options: [
				{
					type: 'dropdown',
					label: 'Mute',
					id: 'mute',
					default: 1,
					choices: [
						{ id: 1, label: 'Mute' },
						{ id: 0, label: 'Unmute' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let mute = options.mute

				let args = [
					{
						type: 'i',
						value: mute,
					},
				]

				self.sendCommand('/reverbinputprocessing/mute/' + '*', args)
			},
		}

		actions.setReverbInputProcessingGain = {
			name: 'Reverb Input Processing - Gain',
			description: 'Set the Gain of a Reverb Input Processing',
			options: [
				{
					type: 'number',
					label: 'Zone',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: 4,
					required: true,
				},
				{
					type: 'number',
					label: 'Gain',
					id: 'gain',
					default: 0,
					min: -120.0,
					max: 24.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput
				let gain = options.gain

				let args = [
					{
						type: 'f',
						value: gain,
					},
				]

				self.sendCommand('/reverbinputprocessing/gain/' + matrixInput, args)
			},
		}

		actions.setReverbInputProcessingGainAll = {
			name: 'Reverb Input Processing - Gain (All)',
			description: 'Set the Gain of all Reverb Input Processings',
			options: [
				{
					type: 'number',
					label: 'Gain',
					id: 'gain',
					default: 0,
					min: -120.0,
					max: 24.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let gain = options.gain

				let args = [
					{
						type: 'f',
						value: gain,
					},
				]

				self.sendCommand('/reverbinputprocessing/gain/' + '*', args)
			},
		}

		actions.increaseReverbInputProcessingGain = {
			name: 'Reverb Input Processing - Increase Gain',
			description: 'Increase the Gain of a Reverb Input Processing',
			options: [
				{
					type: 'number',
					label: 'Zone',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: 4,
					required: true,
				},
				{
					type: 'number',
					label: 'Gain Increase Amount',
					id: 'gain',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput.toString()
				let gain = options.gain

				let currentGain = self.DATA?.reverbInputProcessing[matrixInput].gain

				if (currentGain !== undefined) {
					let newGain = currentGain + gain

					let args = [
						{
							type: 'f',
							value: newGain,
						},
					]

					self.sendCommand('/reverbinputprocessing/gain/' + matrixInput, args)
				}
			},
		}

		actions.decreaseReverbInputProcessingGain = {
			name: 'Reverb Input Processing - Decrease Gain',
			description: 'Decrease the Gain of a Reverb Input Processing',
			options: [
				{
					type: 'number',
					label: 'Zone',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: 4,
					required: true,
				},
				{
					type: 'number',
					label: 'Gain Decrease Amount',
					id: 'gain',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput.toString()
				let gain = options.gain

				let currentGain = self.DATA?.reverbInputProcessing[matrixInput].gain

				if (currentGain !== undefined) {
					let newGain = currentGain - gain

					let args = [
						{
							type: 'f',
							value: newGain,
						},
					]

					self.sendCommand('/reverbinputprocessing/gain/' + matrixInput, args)
				}
			},
		}

		actions.setReverbInputProcessingLevelMeter = {
			name: 'Reverb Input Processing - Level Meter',
			description: 'Set the Level Meter of a Reverb Input Processing',
			options: [
				{
					type: 'number',
					label: 'Zone',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: 4,
					required: true,
				},
				{
					type: 'number',
					label: 'Level Meter',
					id: 'levelmeter',
					default: 0,
					min: -120.0,
					max: 0.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput
				let levelMeter = options.levelmeter

				let args = [
					{
						type: 'f',
						value: levelMeter,
					},
				]

				self.sendCommand('/reverbinputprocessing/levelmeter/' + matrixInput, args)
			},
		}

		actions.setReverbInputProcessingLevelMeterAll = {
			name: 'Reverb Input Processing - Level Meter (All)',
			description: 'Set the Level Meter of all Reverb Input Processings',
			options: [
				{
					type: 'number',
					label: 'Level Meter',
					id: 'levelmeter',
					default: 0,
					min: -120.0,
					max: 0.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let levelMeter = options.levelmeter

				let args = [
					{
						type: 'f',
						value: levelMeter,
					},
				]

				self.sendCommand('/reverbinputprocessing/levelmeter/' + '*', args)
			},
		}

		actions.increaseReverbInputProcessingLevelMeter = {
			name: 'Reverb Input Processing - Increase Level Meter',
			description: 'Increase the Level Meter of a Reverb Input Processing',
			options: [
				{
					type: 'number',
					label: 'Zone',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: 4,
					required: true,
				},
				{
					type: 'number',
					label: 'Level Meter Increase Amount',
					id: 'levelmeter',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput.toString()
				let levelMeter = options.levelmeter

				let currentLevelMeter = self.DATA?.reverbInputProcessing[matrixInput].levelMeter

				if (currentLevelMeter !== undefined) {
					let newLevelMeter = currentLevelMeter + levelMeter

					let args = [
						{
							type: 'f',
							value: newLevelMeter,
						},
					]

					self.sendCommand('/reverbinputprocessing/levelmeter/' + matrixInput, args)
				}
			},
		}

		actions.decreaseReverbInputProcessingLevelMeter = {
			name: 'Reverb Input Processing - Decrease Level Meter',
			description: 'Decrease the Level Meter of a Reverb Input Processing',
			options: [
				{
					type: 'number',
					label: 'Zone',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: 4,
					required: true,
				},
				{
					type: 'number',
					label: 'Level Meter Decrease Amount',
					id: 'levelmeter',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput.toString()
				let levelMeter = options.levelmeter

				let currentLevelMeter = self.DATA?.reverbInputProcessing[matrixInput].levelMeter

				if (currentLevelMeter !== undefined) {
					let newLevelMeter = currentLevelMeter - levelMeter

					let args = [
						{
							type: 'f',
							value: newLevelMeter,
						},
					]

					self.sendCommand('/reverbinputprocessing/levelmeter/' + matrixInput, args)
				}
			},
		}

		actions.setReverbInputProcessingEqEnable = {
			name: 'Reverb Input Processing - EQ Enable',
			description: 'Enable or Disable EQ of a Reverb Input Processing',
			options: [
				{
					type: 'number',
					label: 'Zone',
					id: 'matrixinput',
					default: 1,
					min: 1,
					max: 4,
					required: true,
				},
				{
					type: 'dropdown',
					label: 'EQ Enable',
					id: 'eqenable',
					default: 1,
					choices: [
						{ id: 1, label: 'Enable' },
						{ id: 0, label: 'Disable' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let matrixInput = options.matrixinput
				let eqEnable = options.eqenable

				let args = [
					{
						type: 'i',
						value: eqEnable,
					},
				]

				self.sendCommand('/reverbinputprocessing/eqenable/' + matrixInput, args)
			},
		}

		actions.setReverbInputProcessingEqEnableAll = {
			name: 'Reverb Input Processing - EQ Enable (All)',
			description: 'Enable or Disable EQ of all Reverb Input Processings',
			options: [
				{
					type: 'dropdown',
					label: 'EQ Enable',
					id: 'eqenable',
					default: 1,
					choices: [
						{ id: 1, label: 'Enable' },
						{ id: 0, label: 'Disable' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let eqEnable = options.eqenable

				let args = [
					{
						type: 'i',
						value: eqEnable,
					},
				]

				self.sendCommand('/reverbinputprocessing/eqenable/' + '*', args)
			},
		}

		actions.setDeviceClear = {
			name: 'Device - Clear',
			description: 'Resets the device to factory defaults, except the remote settings',
			callback: async function (action) {
				self.sendCommand('/device/clear')
			},
		}

		actions.recallScenePrevious = {
			name: 'Recall Scene - Previous',
			description: 'Recall the previous scene',
			callback: async function (action) {
				self.sendCommand('/scene/previous')
			},
		}

		actions.recallSceneNext = {
			name: 'Recall Scene - Next',
			description: 'Recall the next scene',
			callback: async function (action) {
				self.sendCommand('/scene/next')
			},
		}

		actions.recallSceneMajor = {
			name: 'Recall Scene (Major)',
			description: 'Recall a specific scene',
			options: [
				{
					type: 'number',
					label: 'Scene Number',
					id: 'scenenumber',
					default: 0,
					min: 0,
					max: 999,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let sceneNumber = options.scenenumber

				let args = [
					{
						type: 'i',
						value: sceneNumber,
					},
				]

				self.sendCommand('/scene/recall', args)
			},
		}

		actions.recallSceneMajorMinor = {
			name: 'Recall Scene (Major/Minor)',
			description: 'Recall a specific scene',
			options: [
				{
					type: 'number',
					label: 'Major Scene Number',
					id: 'majorscenenumber',
					default: 0,
					min: 0,
					max: 999,
					required: true,
				},
				{
					type: 'number',
					label: 'Minor Scene Number',
					id: 'minorscenenumber',
					default: 0,
					min: 0,
					max: 99,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let majorSceneNumber = options.majorscenenumber
				let minorSceneNumber = options.minorscenenumber

				let args = [
					{
						type: 'i',
						value: majorSceneNumber,
					},
					{
						type: 'i',
						value: minorSceneNumber,
					},
				]

				self.sendCommand('/scene/recall', args)
			},
		}

		actions.setSoundObjectRoutingMute = {
			name: 'Sound Object Routing - Mute',
			description: 'Mute or Unmute a Sound Object Routing',
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
				{
					type: 'dropdown',
					label: 'Mute',
					id: 'mute',
					default: 1,
					choices: [
						{ id: 1, label: 'Mute' },
						{ id: 0, label: 'Unmute' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let functionGroup = options.functiongroup
				let soundObject = options.soundobject
				let mute = options.mute

				let args = [
					{
						type: 'i',
						value: mute,
					},
				]

				self.sendCommand('/soundobjectrouting/mute/' + functionGroup + '/' + soundObject, args)
				self.updateSoundObjectRoutingMuteLocal(functionGroup, soundObject, mute)
			},
		}

		actions.toggleSoundObjectRoutingMute = {
			name: 'Sound Object Routing - Toggle Mute',
			description: 'Toggle the Mute state of a Sound Object Routing',
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
			callback: async function (action) {
				let options = action.options
				let functionGroup = options.functiongroup
				let soundObject = options.soundobject
				let currentMute = self.DATA?.soundObjectRouting[functionGroup]?.[soundObject]?.mute ?? 0
				let mute = currentMute === 1 ? 0 : 1

				let args = [
					{
						type: 'i',
						value: mute,
					},
				]

				self.sendCommand('/soundobjectrouting/mute/' + functionGroup + '/' + soundObject, args)
				self.updateSoundObjectRoutingMuteLocal(functionGroup, soundObject, mute)
			},
		}

		actions.setSoundObjectRoutingMuteAll = {
			name: 'Sound Object Routing - Mute All',
			description: 'Mute or Unmute all Sound Object Routing combinations',
			options: [
				{
					type: 'dropdown',
					label: 'Mute',
					id: 'mute',
					default: 1,
					choices: [
						{ id: 1, label: 'Mute' },
						{ id: 0, label: 'Unmute' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let mute = options.mute

				let args = [
					{
						type: 'i',
						value: mute,
					},
				]

				self.sendCommand('/soundobjectrouting/mute/*/*', args)
			},
		}

		actions.setSoundObjectRoutingMuteAllInFunctionGroup = {
			name: 'Sound Object Routing - Mute All in Function Group',
			description: 'Mute or Unmute all Sound Objects in one Function Group',
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
					type: 'dropdown',
					label: 'Mute',
					id: 'mute',
					default: 1,
					choices: [
						{ id: 1, label: 'Mute' },
						{ id: 0, label: 'Unmute' },
					],
				},
			],
			callback: async function (action) {
				let options = action.options
				let functionGroup = options.functiongroup
				let mute = options.mute

				let args = [
					{
						type: 'i',
						value: mute,
					},
				]

				self.sendCommand('/soundobjectrouting/mute/' + functionGroup + '/*', args)
			},
		}

		actions.setSoundObjectRoutingGain = {
			name: 'Sound Object Routing - Gain',
			description: 'Set the Gain of a Sound Object Routing',
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
				{
					type: 'number',
					label: 'Gain',
					id: 'gain',
					default: 0,
					min: -120.0,
					max: 10.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let functionGroup = options.functiongroup
				let soundObject = options.soundobject
				let gain = options.gain

				let args = [
					{
						type: 'f',
						value: gain,
					},
				]

				self.sendCommand('/soundobjectrouting/gain/' + functionGroup + '/' + soundObject, args)
				self.updateSoundObjectRoutingGainLocal(functionGroup, soundObject, gain)
			},
		}

		actions.increaseSoundObjectRoutingGain = {
			name: 'Sound Object Routing - Increase Gain',
			description: 'Increase the Gain of a Sound Object Routing',
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
				{
					type: 'number',
					label: 'Gain Increase Amount',
					id: 'gain',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let functionGroup = options.functiongroup.toString()
				let soundObject = options.soundobject.toString()
				let gain = options.gain

				let currentGain = self.DATA?.soundObjectRouting?.[functionGroup]?.[soundObject]?.gain
				if (currentGain === null || currentGain === undefined) {
					currentGain = 0
				}

				let newGain = currentGain + gain

				let args = [
					{
						type: 'f',
						value: newGain,
					},
				]

				self.sendCommand('/soundobjectrouting/gain/' + functionGroup + '/' + soundObject, args)
				self.updateSoundObjectRoutingGainLocal(functionGroup, soundObject, newGain)
			},
		}

		actions.decreaseSoundObjectRoutingGain = {
			name: 'Sound Object Routing - Decrease Gain',
			description: 'Decrease the Gain of a Sound Object Routing',
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
				{
					type: 'number',
					label: 'Gain Decrease Amount',
					id: 'gain',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let functionGroup = options.functiongroup.toString()
				let soundObject = options.soundobject.toString()
				let gain = options.gain

				let currentGain = self.DATA?.soundObjectRouting?.[functionGroup]?.[soundObject]?.gain
				if (currentGain === null || currentGain === undefined) {
					currentGain = 0
				}

				let newGain = currentGain - gain

				let args = [
					{
						type: 'f',
						value: newGain,
					},
				]

				self.sendCommand('/soundobjectrouting/gain/' + functionGroup + '/' + soundObject, args)
				self.updateSoundObjectRoutingGainLocal(functionGroup, soundObject, newGain)
			},
		}

		actions.setFunctionGroupSpreadFactor = {
			name: 'Function Group - Spread Factor',
			description: 'Set the Spread Factor of a Function Group',
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
					label: 'Spread Factor',
					id: 'spreadfactor',
					default: 0,
					min: 0.5,
					max: 2.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let functionGroup = options.functiongroup
				let spreadFactor = options.spreadfactor

				let args = [
					{
						type: 'f',
						value: spreadFactor,
					},
				]

				self.sendCommand('/functiongroup/spreadfactor/' + functionGroup, args)
			},
		}

		actions.increaseFunctionGroupSpreadFactor = {
			name: 'Function Group - Increase Spread Factor',
			description: 'Increase the Spread Factor of a Function Group',
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
					label: 'Spread Factor Increase Amount',
					id: 'spreadfactor',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let functionGroup = options.functiongroup.toString()
				let spreadFactor = options.spreadfactor

				let currentSpreadFactor = self.DATA?.functionGroup[functionGroup].spreadFactor

				if (currentSpreadFactor !== undefined) {
					let newSpreadFactor = currentSpreadFactor + spreadFactor

					if (newSpreadFactor > 2.0) {
						newSpreadFactor = 2.0
					}

					let args = [
						{
							type: 'f',
							value: newSpreadFactor,
						},
					]

					self.sendCommand('/functiongroup/spreadfactor/' + functionGroup, args)
				}
			},
		}

		actions.decreaseFunctionGroupSpreadFactor = {
			name: 'Function Group - Decrease Spread Factor',
			description: 'Decrease the Spread Factor of a Function Group',
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
					label: 'Spread Factor Decrease Amount',
					id: 'spreadfactor',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let functionGroup = options.functiongroup.toString()
				let spreadFactor = options.spreadfactor

				let currentSpreadFactor = self.DATA?.functionGroup[functionGroup].spreadFactor

				if (currentSpreadFactor !== undefined) {
					let newSpreadFactor = currentSpreadFactor - spreadFactor

					if (newSpreadFactor < 0.5) {
						newSpreadFactor = 0.5
					}

					let args = [
						{
							type: 'f',
							value: newSpreadFactor,
						},
					]

					self.sendCommand('/functiongroup/spreadfactor/' + functionGroup, args)
				}
			},
		}

		actions.setFunctionGroupDelay = {
			name: 'Function Group - Delay',
			description: 'Set the Delay of a Function Group',
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
					label: 'Delay',
					id: 'delay',
					default: 0,
					min: 0.0,
					max: 500.0,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let functionGroup = options.functiongroup
				let delay = options.delay

				let args = [
					{
						type: 'f',
						value: delay,
					},
				]

				self.sendCommand('/functiongroup/delay/' + functionGroup, args)
			},
		}

		actions.increaseFunctionGroupDelay = {
			name: 'Function Group - Increase Delay',
			description: 'Increase the Delay of a Function Group',
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
					label: 'Delay Increase Amount',
					id: 'delay',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let functionGroup = options.functiongroup.toString()
				let delay = options.delay

				let currentDelay = self.DATA?.functionGroup[functionGroup].delay

				if (currentDelay !== undefined) {
					let newDelay = currentDelay + delay

					if (newDelay > 500.0) {
						newDelay = 500.0
					}

					let args = [
						{
							type: 'f',
							value: newDelay,
						},
					]

					self.sendCommand('/functiongroup/delay/' + functionGroup, args)
				}
			},
		}

		actions.decreaseFunctionGroupDelay = {
			name: 'Function Group - Decrease Delay',
			description: 'Decrease the Delay of a Function Group',
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
					label: 'Delay Decrease Amount',
					id: 'delay',
					default: 0.1,
					min: 0.1,
					required: true,
				},
			],
			callback: async function (action) {
				let options = action.options
				let functionGroup = options.functiongroup.toString()
				let delay = options.delay

				let currentDelay = self.DATA?.functionGroup[functionGroup].delay

				if (currentDelay !== undefined) {
					let newDelay = currentDelay - delay

					if (newDelay < 0.0) {
						newDelay = 0.0
					}

					let args = [
						{
							type: 'f',
							value: newDelay,
						},
					]

					self.sendCommand('/functiongroup/delay/' + functionGroup, args)
				}
			},
		}

		self.attachPollSubscriptions(actions)
		self.setActionDefinitions(actions)
	},
}
