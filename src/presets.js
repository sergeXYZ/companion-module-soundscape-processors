import { COLORS, buttonBaseStyle, displayButtonStyle, rotaryButtonStyle } from './colours.js'
import { getEnSpaceRoomPng64 } from './enspace-rooms.js'
import { combineRgb } from '@companion-module/base'
// ALL-BUTTON-FEEDBACK
import { ALL_BUTTON_TRIPLE_STATE_ENABLED, ALL_BUTTON_PRESET_FEEDBACKS } from './all-button-feedback.js'

export default {
	initPresets: function () {
		let self = this
		let presets = {}
		let structure = []

		const expr = (value) => ({ isExpression: true, value })

		function pushSection(section) {
			structure.push(section)
		}

		function addLatchAll({ id, name, text, actionId, optionKey, feedbackId }) {
			// ALL-BUTTON-FEEDBACK: wire 3-state feedback when enabled
			const resolvedFeedbackId =
				ALL_BUTTON_TRIPLE_STATE_ENABLED && (feedbackId || ALL_BUTTON_PRESET_FEEDBACKS[id])
			presets[id] = {
				type: 'simple',
				name,
				style: { ...buttonBaseStyle, text },
				steps: [
					{ down: [{ actionId, options: { [optionKey]: 1 } }], up: [] },
					{ down: [{ actionId, options: { [optionKey]: 0 } }], up: [] },
				],
				feedbacks: resolvedFeedbackId ? [{ feedbackId: resolvedFeedbackId, options: {} }] : [],
			}
		}

		function addLatchExample({
			id,
			name,
			text,
			localVariables,
			actionId,
			onOptions,
			offOptions,
			feedbackId,
			feedbackOptions,
			activeStyle,
		}) {
			presets[id] = {
				type: 'simple',
				name,
				keywords: ['example', 'configure'],
				style: { ...buttonBaseStyle, text },
				localVariables,
				steps: [
					{ down: [{ actionId, options: onOptions }], up: [] },
					{ down: [{ actionId, options: offOptions }], up: [] },
				],
				feedbacks: feedbackId
					? [
							{
								feedbackId,
								options: feedbackOptions || {},
								style: { ...activeStyle },
							},
					  ]
					: [],
			}
		}

		function addMomentaryExample({
			id,
			name,
			text,
			localVariables,
			actionId,
			options,
			feedbacks = [],
			display = false,
		}) {
			presets[id] = {
				type: 'simple',
				name,
				keywords: display ? ['example', 'configure', 'display'] : ['example', 'configure'],
				style: { ...(display ? displayButtonStyle : buttonBaseStyle), text },
				localVariables,
				// Display buttons are read-only — no press/set action
				steps: [
					{
						down: display || !actionId ? [] : [{ actionId, options }],
						up: [],
					},
				],
				feedbacks,
			}
		}

		/** Grey Inc/Dec pair + Stream Deck rotary (left=dec, right=inc). No feedback — encoders have no display. */
		function addIncDecPair({
			idBase,
			label,
			textPlus,
			textMinus,
			textRotary,
			nameHint,
			localVariables,
			increaseActionId,
			decreaseActionId,
			options,
		}) {
			addMomentaryExample({
				id: `${idBase}_inc`,
				name: `${label} Inc — EXAMPLE: ${nameHint}`,
				text: textPlus,
				localVariables,
				actionId: increaseActionId,
				options,
			})
			addMomentaryExample({
				id: `${idBase}_dec`,
				name: `${label} Dec — EXAMPLE: ${nameHint}`,
				text: textMinus,
				localVariables,
				actionId: decreaseActionId,
				options,
			})

			presets[`${idBase}_rotary`] = {
				type: 'simple',
				name: `${label} Rotary — EXAMPLE: ${nameHint} (↻ inc / ↺ dec; hold = coarse)`,
				keywords: ['rotary', 'encoder', 'streamdeck', 'example', 'inc', 'dec'],
				style: {
					...rotaryButtonStyle,
					text: textRotary || textPlus.replace(/\s*\+$/, ''),
				},
				localVariables,
				steps: [
					{
						down: [{ actionId: 'pressRotaryEncoder', options: {} }],
						up: [{ actionId: 'releaseRotaryEncoder', options: {} }],
						rotate_left: [{ actionId: decreaseActionId, options }],
						rotate_right: [{ actionId: increaseActionId, options }],
					},
				],
				feedbacks: [],
			}
		}

		function howToLocal(vars) {
			return `After placing: Button → Local Variables → set ${vars}. Duplicate for more channels. Grey = inactive; colored feedback = active state.`
		}

		// ========== Matrix Input ==========
		addLatchAll({
			id: 'matrix_input_mute_all',
			name: 'Matrix Input Mute All',
			text: 'In ALL\nMute',
			actionId: 'setMatrixInputMuteAll',
			optionKey: 'mute',
		})
		addLatchExample({
			id: 'matrix_input_mute_example',
			name: 'Matrix Input Mute — EXAMPLE: change local variable "matrixinput"',
			text: 'In $(local:matrixinput)\nMute',
			localVariables: [{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 }],
			actionId: 'setMatrixInputMute',
			onOptions: { matrixinput: expr('$(local:matrixinput)'), mute: 1 },
			offOptions: { matrixinput: expr('$(local:matrixinput)'), mute: 0 },
			feedbackId: 'matrixInputMute',
			feedbackOptions: { matrixinput: expr('$(local:matrixinput)') },
			activeStyle: COLORS.mute,
		})

		addLatchAll({
			id: 'matrix_input_delay_enable_all',
			name: 'Matrix Input Delay Enable All',
			text: 'In ALL\nDelay',
			actionId: 'setMatrixInputDelayEnableAll',
			optionKey: 'delayenable',
		})
		addLatchExample({
			id: 'matrix_input_delay_enable_example',
			name: 'Matrix Input Delay Enable — EXAMPLE: change "matrixinput"',
			text: 'In $(local:matrixinput)\nDelay',
			localVariables: [{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 }],
			actionId: 'setMatrixInputDelayEnable',
			onOptions: { matrixinput: expr('$(local:matrixinput)'), delayenable: 1 },
			offOptions: { matrixinput: expr('$(local:matrixinput)'), delayenable: 0 },
			feedbackId: 'matrixInputDelayEnable',
			feedbackOptions: { matrixinput: expr('$(local:matrixinput)') },
			activeStyle: COLORS.delay,
		})

		addLatchAll({
			id: 'matrix_input_eq_enable_all',
			name: 'Matrix Input EQ Enable All',
			text: 'In ALL\nEQ',
			actionId: 'setMatrixInputEqEnableAll',
			optionKey: 'eqenable',
		})
		addLatchExample({
			id: 'matrix_input_eq_enable_example',
			name: 'Matrix Input EQ Enable — EXAMPLE: change "matrixinput"',
			text: 'In $(local:matrixinput)\nEQ',
			localVariables: [{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 }],
			actionId: 'setMatrixInputEqEnable',
			onOptions: { matrixinput: expr('$(local:matrixinput)'), eqenable: 1 },
			offOptions: { matrixinput: expr('$(local:matrixinput)'), eqenable: 0 },
			feedbackId: 'matrixInputEQEnable',
			feedbackOptions: { matrixinput: expr('$(local:matrixinput)') },
			activeStyle: COLORS.eq,
		})

		addLatchAll({
			id: 'matrix_input_polarity_all',
			name: 'Matrix Input Polarity All',
			text: 'In ALL\nPol',
			actionId: 'setMatrixInputPolarityAll',
			optionKey: 'polarity',
		})
		addLatchExample({
			id: 'matrix_input_polarity_example',
			name: 'Matrix Input Polarity — EXAMPLE: change "matrixinput"',
			text: 'In $(local:matrixinput)\nPol',
			localVariables: [{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 }],
			actionId: 'setMatrixInputPolarity',
			onOptions: { matrixinput: expr('$(local:matrixinput)'), polarity: 1 },
			offOptions: { matrixinput: expr('$(local:matrixinput)'), polarity: 0 },
			feedbackId: 'matrixInputPolarity',
			feedbackOptions: { matrixinput: expr('$(local:matrixinput)') },
			activeStyle: COLORS.polarity,
		})

		addMomentaryExample({
			id: 'matrix_input_gain_example',
			name: 'Display Gain — EXAMPLE: change "matrixinput" and action Gain value',
			text: 'In $(local:matrixinput)\nGain',
			localVariables: [{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 }],
			actionId: 'setMatrixInputGain',
			options: { matrixinput: expr('$(local:matrixinput)'), gain: 0 },
			display: true,
			feedbacks: [
				{
					feedbackId: 'matrixInputGain',
					options: { matrixinput: expr('$(local:matrixinput)') },
				},
			],
		})
		addMomentaryExample({
			id: 'matrix_input_gain_all',
			name: 'Matrix Input Gain All',
			text: 'In ALL\nGain',
			localVariables: [],
			actionId: 'setMatrixInputGainAll',
			options: { gain: 0 },
		})
		addMomentaryExample({
			id: 'matrix_input_delay_example',
			name: 'Display Delay — EXAMPLE: change "matrixinput" and Delay ms',
			text: 'In $(local:matrixinput)\nDelay ms',
			localVariables: [{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 }],
			actionId: 'setMatrixInputDelay',
			options: { matrixinput: expr('$(local:matrixinput)'), delay: 0 },
			display: true,
			feedbacks: [
				{
					feedbackId: 'matrixInputDelay',
					options: { matrixinput: expr('$(local:matrixinput)') },
				},
			],
		})
		addMomentaryExample({
			id: 'matrix_input_delay_all',
			name: 'Matrix Input Delay All',
			text: 'In ALL\nDelay ms',
			localVariables: [],
			actionId: 'setMatrixInputDelayAll',
			options: { delay: 0 },
		})
		addIncDecPair({
			idBase: 'matrix_input_gain',
			label: 'Gain',
			textPlus: 'In $(local:matrixinput)\nGain +',
			textMinus: 'In $(local:matrixinput)\nGain -',
			nameHint: 'change "matrixinput" and step amount',
			localVariables: [{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 }],
			increaseActionId: 'increaseMatrixInputGain',
			decreaseActionId: 'decreaseMatrixInputGain',
			options: { matrixinput: expr('$(local:matrixinput)'), gain: 0.5 },
			textRotary: 'In $(local:matrixinput)\nGain',
		})
		addIncDecPair({
			idBase: 'matrix_input_delay',
			label: 'Delay',
			textPlus: 'In $(local:matrixinput)\nDelay +',
			textMinus: 'In $(local:matrixinput)\nDelay -',
			nameHint: 'change "matrixinput" and step amount (ms)',
			localVariables: [{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 }],
			increaseActionId: 'increaseMatrixInputDelay',
			decreaseActionId: 'decreaseMatrixInputDelay',
			options: { matrixinput: expr('$(local:matrixinput)'), delay: 0.5 },
			textRotary: 'In $(local:matrixinput)\nDelay',
		})

		// En-Space input = /matrixinput/reverbsendgain
		addMomentaryExample({
			id: 'matrix_input_enspace_send_example',
			name: 'Display En-Space Send — EXAMPLE: change "matrixinput"',
			text: 'In $(local:matrixinput)\nEnSp Send',
			localVariables: [{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 }],
			actionId: 'setMatrixInputReverbSendGain',
			options: { matrixinput: expr('$(local:matrixinput)'), reverbsendgain: 0 },
			display: true,
			feedbacks: [
				{
					feedbackId: 'matrixInputReverbSendGain',
					options: { matrixinput: expr('$(local:matrixinput)') },
				},
			],
		})
		addMomentaryExample({
			id: 'matrix_input_enspace_send_all',
			name: 'En-Space Send All',
			text: 'In ALL\nEnSp Send',
			localVariables: [],
			actionId: 'setMatrixInputReverbSendGainAll',
			options: { reverbsendgain: 0 },
		})
		addIncDecPair({
			idBase: 'matrix_input_enspace_send',
			label: 'En-Space Send',
			textPlus: 'In $(local:matrixinput)\nEnSp +',
			textMinus: 'In $(local:matrixinput)\nEnSp -',
			nameHint: 'change "matrixinput" and step amount',
			localVariables: [{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 }],
			increaseActionId: 'increaseMatrixInputReverbSendGain',
			decreaseActionId: 'decreaseMatrixInputReverbSendGain',
			options: { matrixinput: expr('$(local:matrixinput)'), reverbsendgain: 0.5 },
			textRotary: 'In $(local:matrixinput)\nEnSp Send',
		})
		addIncDecPair({
			idBase: 'matrix_input_enspace_send_all',
			label: 'En-Space Send All',
			textPlus: 'In ALL\nEnSp +',
			textMinus: 'In ALL\nEnSp -',
			nameHint: 'change step amount in the action',
			localVariables: [],
			increaseActionId: 'increaseMatrixInputReverbSendGainAll',
			decreaseActionId: 'decreaseMatrixInputReverbSendGainAll',
			options: { reverbsendgain: 0.5 },
			textRotary: 'In ALL\nEnSp Send',
		})

		// En-Space input matrix = /reverbinput/gain/{input}/{zone}
		addMomentaryExample({
			id: 'matrix_input_enspace_matrix_example',
			name: 'Display En-Space Matrix — EXAMPLE: change "matrixinput" + "zone"',
			text: 'In $(local:matrixinput) Z$(local:zone)\nEnSp Mx',
			localVariables: [
				{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 },
				{ variableType: 'simple', variableName: 'zone', startupValue: 1 },
			],
			actionId: 'setReverbInputGain',
			options: {
				matrixinput: expr('$(local:matrixinput)'),
				zone: expr('$(local:zone)'),
				gain: 0,
			},
			display: true,
			feedbacks: [
				{
					feedbackId: 'reverbInputGain',
					options: {
						matrixinput: expr('$(local:matrixinput)'),
						zone: expr('$(local:zone)'),
					},
				},
			],
		})
		addMomentaryExample({
			id: 'matrix_input_enspace_matrix_all',
			name: 'En-Space Matrix All',
			text: 'In ALL Z*\nEnSp Mx',
			localVariables: [],
			actionId: 'setReverbInputGainAll',
			options: { gain: 0 },
		})
		addIncDecPair({
			idBase: 'matrix_input_enspace_matrix',
			label: 'En-Space Matrix',
			textPlus: 'In $(local:matrixinput) Z$(local:zone)\nEnSp +',
			textMinus: 'In $(local:matrixinput) Z$(local:zone)\nEnSp -',
			nameHint: 'change "matrixinput" + "zone" and step amount',
			localVariables: [
				{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 },
				{ variableType: 'simple', variableName: 'zone', startupValue: 1 },
			],
			increaseActionId: 'increaseReverbInputGain',
			decreaseActionId: 'decreaseReverbInputGain',
			options: {
				matrixinput: expr('$(local:matrixinput)'),
				zone: expr('$(local:zone)'),
				gain: 0.5,
			},
			textRotary: 'In $(local:matrixinput) Z$(local:zone)\nEnSp Mx',
		})

		pushSection({
			id: 'matrix-input',
			name: 'Matrix Input',
			description:
				'Mute=red, Delay enable=orange, EQ=blue, Polarity=yellow (from Colours/). Display=black. Inc/Dec=grey. Rotary=↻ inc / ↺ dec. En-Space Input/Matrix need En-Space option. ' +
				howToLocal('"matrixinput" (and "zone" 1–4 for En-Space Matrix)'),
			definitions: [
				{
					id: 'mi-mute',
					type: 'simple',
					name: 'Mute',
					presets: ['matrix_input_mute_all', 'matrix_input_mute_example'],
				},
				{
					id: 'mi-delay-en',
					type: 'simple',
					name: 'Delay Enable',
					presets: ['matrix_input_delay_enable_all', 'matrix_input_delay_enable_example'],
				},
				{
					id: 'mi-eq',
					type: 'simple',
					name: 'EQ Enable',
					presets: ['matrix_input_eq_enable_all', 'matrix_input_eq_enable_example'],
				},
				{
					id: 'mi-pol',
					type: 'simple',
					name: 'Polarity',
					presets: ['matrix_input_polarity_all', 'matrix_input_polarity_example'],
				},
				{
					id: 'mi-gain',
					type: 'simple',
					name: 'Display Gain',
					description: 'Black display + grey Inc/Dec + pink rotary. Edit Gain / step amount in the action after placing.',
					presets: [
						'matrix_input_gain_all',
						'matrix_input_gain_example',
						'matrix_input_gain_inc',
						'matrix_input_gain_dec',
						'matrix_input_gain_rotary',
					],
				},
				{
					id: 'mi-delay',
					type: 'simple',
					name: 'Display Delay (ms)',
					description: 'Black display + grey Inc/Dec + pink rotary. Edit Delay / step amount in the action after placing.',
					presets: [
						'matrix_input_delay_all',
						'matrix_input_delay_example',
						'matrix_input_delay_inc',
						'matrix_input_delay_dec',
						'matrix_input_delay_rotary',
					],
				},
				{
					id: 'mi-enspace-send',
					type: 'simple',
					name: 'En-Space Input (Send)',
					description:
						'En-Space send gain per matrix input (/matrixinput/reverbsendgain). Only if En-Space option is enabled.',
					presets: [
						'matrix_input_enspace_send_all',
						'matrix_input_enspace_send_example',
						'matrix_input_enspace_send_inc',
						'matrix_input_enspace_send_dec',
						'matrix_input_enspace_send_rotary',
						'matrix_input_enspace_send_all_inc',
						'matrix_input_enspace_send_all_dec',
						'matrix_input_enspace_send_all_rotary',
					],
				},
				{
					id: 'mi-enspace-matrix',
					type: 'simple',
					name: 'En-Space Input Matrix',
					description:
						'Input→Zone gain (/reverbinput/gain/{input}/{zone 1–4}). Set local variables matrixinput + zone. Only if En-Space option is enabled.',
					presets: [
						'matrix_input_enspace_matrix_all',
						'matrix_input_enspace_matrix_example',
						'matrix_input_enspace_matrix_inc',
						'matrix_input_enspace_matrix_dec',
						'matrix_input_enspace_matrix_rotary',
					],
				},
			],
		})

		// ========== Matrix Output ==========
		addLatchAll({
			id: 'matrix_output_mute_all',
			name: 'Matrix Output Mute All',
			text: 'Out ALL\nMute',
			actionId: 'setMatrixOutputMuteAll',
			optionKey: 'mute',
		})
		addLatchExample({
			id: 'matrix_output_mute_example',
			name: 'Matrix Output Mute — EXAMPLE: change "matrixoutput"',
			text: 'Out $(local:matrixoutput)\nMute',
			localVariables: [{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 }],
			actionId: 'setMatrixOutputMute',
			onOptions: { matrixoutput: expr('$(local:matrixoutput)'), mute: 1 },
			offOptions: { matrixoutput: expr('$(local:matrixoutput)'), mute: 0 },
			feedbackId: 'matrixOutputMute',
			feedbackOptions: { matrixoutput: expr('$(local:matrixoutput)') },
			activeStyle: COLORS.mute,
		})
		addLatchAll({
			id: 'matrix_output_delay_enable_all',
			name: 'Matrix Output Delay Enable All',
			text: 'Out ALL\nDelay',
			actionId: 'setMatrixOutputDelayEnableAll',
			optionKey: 'delayenable',
		})
		addLatchExample({
			id: 'matrix_output_delay_enable_example',
			name: 'Matrix Output Delay Enable — EXAMPLE: change "matrixoutput"',
			text: 'Out $(local:matrixoutput)\nDelay',
			localVariables: [{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 }],
			actionId: 'setMatrixOutputDelayEnable',
			onOptions: { matrixoutput: expr('$(local:matrixoutput)'), delayenable: 1 },
			offOptions: { matrixoutput: expr('$(local:matrixoutput)'), delayenable: 0 },
			feedbackId: 'matrixOutputDelayEnable',
			feedbackOptions: { matrixoutput: expr('$(local:matrixoutput)') },
			activeStyle: COLORS.delay,
		})
		addLatchAll({
			id: 'matrix_output_eq_enable_all',
			name: 'Matrix Output EQ Enable All',
			text: 'Out ALL\nEQ',
			actionId: 'setMatrixOutputEqEnableAll',
			optionKey: 'eqenable',
		})
		addLatchExample({
			id: 'matrix_output_eq_enable_example',
			name: 'Matrix Output EQ Enable — EXAMPLE: change "matrixoutput"',
			text: 'Out $(local:matrixoutput)\nEQ',
			localVariables: [{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 }],
			actionId: 'setMatrixOutputEqEnable',
			onOptions: { matrixoutput: expr('$(local:matrixoutput)'), eqenable: 1 },
			offOptions: { matrixoutput: expr('$(local:matrixoutput)'), eqenable: 0 },
			feedbackId: 'matrixOutputEQEnable',
			feedbackOptions: { matrixoutput: expr('$(local:matrixoutput)') },
			activeStyle: COLORS.eq,
		})
		addLatchAll({
			id: 'matrix_output_polarity_all',
			name: 'Matrix Output Polarity All',
			text: 'Out ALL\nPol',
			actionId: 'setMatrixOutputPolarityAll',
			optionKey: 'polarity',
		})
		addLatchExample({
			id: 'matrix_output_polarity_example',
			name: 'Matrix Output Polarity — EXAMPLE: change "matrixoutput"',
			text: 'Out $(local:matrixoutput)\nPol',
			localVariables: [{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 }],
			actionId: 'setMatrixOutputPolarity',
			onOptions: { matrixoutput: expr('$(local:matrixoutput)'), polarity: 1 },
			offOptions: { matrixoutput: expr('$(local:matrixoutput)'), polarity: 0 },
			feedbackId: 'matrixOutputPolarity',
			feedbackOptions: { matrixoutput: expr('$(local:matrixoutput)') },
			activeStyle: COLORS.polarity,
		})
		addMomentaryExample({
			id: 'matrix_output_gain_all',
			name: 'Matrix Output Gain All',
			text: 'Out ALL\nGain',
			localVariables: [],
			actionId: 'setMatrixOutputGainAll',
			options: { gain: 0 },
		})
		addMomentaryExample({
			id: 'matrix_output_gain_example',
			name: 'Display Gain — EXAMPLE: change "matrixoutput" and Gain',
			text: 'Out $(local:matrixoutput)\nGain',
			localVariables: [{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 }],
			actionId: 'setMatrixOutputGain',
			options: { matrixoutput: expr('$(local:matrixoutput)'), gain: 0 },
			display: true,
			feedbacks: [
				{
					feedbackId: 'matrixOutputGain',
					options: { matrixoutput: expr('$(local:matrixoutput)') },
				},
			],
		})
		addMomentaryExample({
			id: 'matrix_output_delay_all',
			name: 'Matrix Output Delay All',
			text: 'Out ALL\nDelay ms',
			localVariables: [],
			actionId: 'setMatrixOutputDelayAll',
			options: { delay: 0 },
		})
		addMomentaryExample({
			id: 'matrix_output_delay_example',
			name: 'Display Delay — EXAMPLE: change "matrixoutput" and Delay ms',
			text: 'Out $(local:matrixoutput)\nDelay ms',
			localVariables: [{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 }],
			actionId: 'setMatrixOutputDelay',
			options: { matrixoutput: expr('$(local:matrixoutput)'), delay: 0 },
			display: true,
			feedbacks: [
				{
					feedbackId: 'matrixOutputDelay',
					options: { matrixoutput: expr('$(local:matrixoutput)') },
				},
			],
		})
		addIncDecPair({
			idBase: 'matrix_output_gain',
			label: 'Gain',
			textPlus: 'Out $(local:matrixoutput)\nGain +',
			textMinus: 'Out $(local:matrixoutput)\nGain -',
			nameHint: 'change "matrixoutput" and step amount',
			localVariables: [{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 }],
			increaseActionId: 'increaseMatrixOutputGain',
			decreaseActionId: 'decreaseMatrixOutputGain',
			options: { matrixoutput: expr('$(local:matrixoutput)'), gain: 0.5 },
			textRotary: 'Out $(local:matrixoutput)\nGain',
		})
		addIncDecPair({
			idBase: 'matrix_output_delay',
			label: 'Delay',
			textPlus: 'Out $(local:matrixoutput)\nDelay +',
			textMinus: 'Out $(local:matrixoutput)\nDelay -',
			nameHint: 'change "matrixoutput" and step amount (ms)',
			localVariables: [{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 }],
			increaseActionId: 'increaseMatrixOutputDelay',
			decreaseActionId: 'decreaseMatrixOutputDelay',
			options: { matrixoutput: expr('$(local:matrixoutput)'), delay: 0.5 },
			textRotary: 'Out $(local:matrixoutput)\nDelay',
		})

		pushSection({
			id: 'matrix-output',
			name: 'Matrix Output',
			description: 'Same color rules as Matrix Input. ' + howToLocal('"matrixoutput"'),
			definitions: [
				{
					id: 'mo-mute',
					type: 'simple',
					name: 'Mute',
					presets: ['matrix_output_mute_all', 'matrix_output_mute_example'],
				},
				{
					id: 'mo-delay-en',
					type: 'simple',
					name: 'Delay Enable',
					presets: ['matrix_output_delay_enable_all', 'matrix_output_delay_enable_example'],
				},
				{
					id: 'mo-eq',
					type: 'simple',
					name: 'EQ Enable',
					presets: ['matrix_output_eq_enable_all', 'matrix_output_eq_enable_example'],
				},
				{
					id: 'mo-pol',
					type: 'simple',
					name: 'Polarity',
					presets: ['matrix_output_polarity_all', 'matrix_output_polarity_example'],
				},
				{
					id: 'mo-gain',
					type: 'simple',
					name: 'Display Gain',
					presets: [
						'matrix_output_gain_all',
						'matrix_output_gain_example',
						'matrix_output_gain_inc',
						'matrix_output_gain_dec',
						'matrix_output_gain_rotary',
					],
				},
				{
					id: 'mo-delay',
					type: 'simple',
					name: 'Display Delay (ms)',
					presets: [
						'matrix_output_delay_all',
						'matrix_output_delay_example',
						'matrix_output_delay_inc',
						'matrix_output_delay_dec',
						'matrix_output_delay_rotary',
					],
				},
			],
		})

		// ========== Matrix Node (crosspoints) ==========
		addLatchExample({
			id: 'matrix_node_enable_example',
			name: 'Matrix Node Enable — EXAMPLE: change "matrixinput" + "matrixoutput"',
			text: 'N $(local:matrixinput)/$(local:matrixoutput)\nEn',
			localVariables: [
				{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 },
				{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 },
			],
			actionId: 'setMatrixNodeEnable',
			onOptions: {
				input: expr('$(local:matrixinput)'),
				output: expr('$(local:matrixoutput)'),
				enable: 1,
			},
			offOptions: {
				input: expr('$(local:matrixinput)'),
				output: expr('$(local:matrixoutput)'),
				enable: 0,
			},
			feedbackId: 'matrixNodeEnable',
			feedbackOptions: {
				matrixinput: expr('$(local:matrixinput)'),
				matrixoutput: expr('$(local:matrixoutput)'),
			},
			activeStyle: COLORS.grey,
		})
		addLatchAll({
			id: 'matrix_node_delay_enable_all',
			name: 'Matrix Node Delay Enable All',
			text: 'Node ALL\nDelay',
			actionId: 'setMatrixNodeDelayEnableAll',
			optionKey: 'delayenable',
		})
		addLatchExample({
			id: 'matrix_node_delay_enable_example',
			name: 'Matrix Node Delay Enable — EXAMPLE: change "matrixinput" + "matrixoutput"',
			text: 'N $(local:matrixinput)/$(local:matrixoutput)\nDelay',
			localVariables: [
				{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 },
				{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 },
			],
			actionId: 'setMatrixNodeDelayEnable',
			onOptions: {
				input: expr('$(local:matrixinput)'),
				output: expr('$(local:matrixoutput)'),
				delayenable: 1,
			},
			offOptions: {
				input: expr('$(local:matrixinput)'),
				output: expr('$(local:matrixoutput)'),
				delayenable: 0,
			},
			feedbackId: 'matrixNodeDelayEnable',
			feedbackOptions: {
				matrixinput: expr('$(local:matrixinput)'),
				matrixoutput: expr('$(local:matrixoutput)'),
			},
			activeStyle: COLORS.delay,
		})
		addMomentaryExample({
			id: 'matrix_node_gain_all',
			name: 'Matrix Node Gain All',
			text: 'Node ALL\nGain',
			localVariables: [],
			actionId: 'setMatrixNodeGainAll',
			options: { gain: 0 },
		})
		addMomentaryExample({
			id: 'matrix_node_gain_example',
			name: 'Display Gain — EXAMPLE: change "matrixinput" + "matrixoutput" + Gain',
			text: 'N $(local:matrixinput)/$(local:matrixoutput)\nGain',
			localVariables: [
				{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 },
				{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 },
			],
			actionId: 'setMatrixNodeGain',
			options: {
				input: expr('$(local:matrixinput)'),
				output: expr('$(local:matrixoutput)'),
				gain: 0,
			},
			display: true,
			feedbacks: [
				{
					feedbackId: 'matrixNodeGain',
					options: {
						matrixinput: expr('$(local:matrixinput)'),
						matrixoutput: expr('$(local:matrixoutput)'),
					},
				},
			],
		})
		addMomentaryExample({
			id: 'matrix_node_delay_all',
			name: 'Matrix Node Delay All',
			text: 'Node ALL\nDelay ms',
			localVariables: [],
			actionId: 'setMatrixNodeDelayAll',
			options: { delay: 0 },
		})
		addMomentaryExample({
			id: 'matrix_node_delay_example',
			name: 'Display Delay — EXAMPLE: change "matrixinput" + "matrixoutput" + Delay',
			text: 'N $(local:matrixinput)/$(local:matrixoutput)\nDelay ms',
			localVariables: [
				{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 },
				{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 },
			],
			actionId: 'setMatrixNodeDelay',
			options: {
				input: expr('$(local:matrixinput)'),
				output: expr('$(local:matrixoutput)'),
				delay: 0,
			},
			display: true,
			feedbacks: [
				{
					feedbackId: 'matrixNodeDelay',
					options: {
						matrixinput: expr('$(local:matrixinput)'),
						matrixoutput: expr('$(local:matrixoutput)'),
					},
				},
			],
		})
		addIncDecPair({
			idBase: 'matrix_node_gain',
			label: 'Gain',
			textPlus: 'N $(local:matrixinput)/$(local:matrixoutput)\nGain +',
			textMinus: 'N $(local:matrixinput)/$(local:matrixoutput)\nGain -',
			nameHint: 'change "matrixinput" + "matrixoutput" and step amount',
			localVariables: [
				{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 },
				{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 },
			],
			increaseActionId: 'increaseMatrixNodeGain',
			decreaseActionId: 'decreaseMatrixNodeGain',
			options: {
				input: expr('$(local:matrixinput)'),
				output: expr('$(local:matrixoutput)'),
				gain: 0.5,
			},
			textRotary: 'N $(local:matrixinput)/$(local:matrixoutput)\nGain',
		})
		addIncDecPair({
			idBase: 'matrix_node_delay',
			label: 'Delay',
			textPlus: 'N $(local:matrixinput)/$(local:matrixoutput)\nDelay +',
			textMinus: 'N $(local:matrixinput)/$(local:matrixoutput)\nDelay -',
			nameHint: 'change "matrixinput" + "matrixoutput" and step amount (ms)',
			localVariables: [
				{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 },
				{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 },
			],
			increaseActionId: 'increaseMatrixNodeDelay',
			decreaseActionId: 'decreaseMatrixNodeDelay',
			options: {
				input: expr('$(local:matrixinput)'),
				output: expr('$(local:matrixoutput)'),
				delay: 0.5,
			},
			textRotary: 'N $(local:matrixinput)/$(local:matrixoutput)\nDelay',
		})

		pushSection({
			id: 'matrix-node',
			name: 'Matrix Node (Crosspoints)',
			description: howToLocal('"matrixinput" and "matrixoutput"'),
			definitions: [
				{
					id: 'mn-en',
					type: 'simple',
					name: 'Enable',
					presets: ['matrix_node_enable_example'],
				},
				{
					id: 'mn-delay-en',
					type: 'simple',
					name: 'Delay Enable',
					presets: ['matrix_node_delay_enable_all', 'matrix_node_delay_enable_example'],
				},
				{
					id: 'mn-gain',
					type: 'simple',
					name: 'Display Gain',
					presets: [
						'matrix_node_gain_all',
						'matrix_node_gain_example',
						'matrix_node_gain_inc',
						'matrix_node_gain_dec',
						'matrix_node_gain_rotary',
					],
				},
				{
					id: 'mn-delay',
					type: 'simple',
					name: 'Display Delay (ms)',
					presets: [
						'matrix_node_delay_all',
						'matrix_node_delay_example',
						'matrix_node_delay_inc',
						'matrix_node_delay_dec',
						'matrix_node_delay_rotary',
					],
				},
			],
		})

		// ========== Reverb / En-Space processing ==========
		addLatchAll({
			id: 'reverb_proc_mute_all',
			name: 'Reverb Processing Mute All',
			text: 'Rev ALL\nMute',
			actionId: 'setReverbInputProcessingMuteAll',
			optionKey: 'mute',
		})
		addLatchExample({
			id: 'reverb_proc_mute_example',
			name: 'Reverb Processing Mute — EXAMPLE: change "reverbzone"',
			text: 'Rev Z$(local:reverbzone)\nMute',
			localVariables: [{ variableType: 'simple', variableName: 'reverbzone', startupValue: 1 }],
			actionId: 'setReverbInputProcessingMute',
			onOptions: { matrixinput: expr('$(local:reverbzone)'), mute: 1 },
			offOptions: { matrixinput: expr('$(local:reverbzone)'), mute: 0 },
			feedbackId: 'reverbInputProcessingMute',
			feedbackOptions: { reverbinputprocessing: expr('$(local:reverbzone)') },
			activeStyle: COLORS.mute,
		})
		addLatchAll({
			id: 'reverb_proc_eq_all',
			name: 'Reverb Processing EQ Enable All',
			text: 'Rev ALL\nEQ',
			actionId: 'setReverbInputProcessingEqEnableAll',
			optionKey: 'eqenable',
		})
		addLatchExample({
			id: 'reverb_proc_eq_example',
			name: 'Reverb Processing EQ — EXAMPLE: change "reverbzone"',
			text: 'Rev Z$(local:reverbzone)\nEQ',
			localVariables: [{ variableType: 'simple', variableName: 'reverbzone', startupValue: 1 }],
			actionId: 'setReverbInputProcessingEqEnable',
			onOptions: { matrixinput: expr('$(local:reverbzone)'), eqenable: 1 },
			offOptions: { matrixinput: expr('$(local:reverbzone)'), eqenable: 0 },
			feedbackId: 'reverbInputProcessingEQEnable',
			feedbackOptions: { reverbinputprocessing: expr('$(local:reverbzone)') },
			activeStyle: COLORS.eq,
		})
		addMomentaryExample({
			id: 'reverb_proc_gain_all',
			name: 'Reverb Processing Gain All',
			text: 'Rev ALL\nGain',
			localVariables: [],
			actionId: 'setReverbInputProcessingGainAll',
			options: { gain: 0 },
		})
		addMomentaryExample({
			id: 'reverb_proc_gain_example',
			name: 'Display Gain — EXAMPLE: change "reverbzone" + Gain',
			text: 'Rev Z$(local:reverbzone)\nGain',
			localVariables: [{ variableType: 'simple', variableName: 'reverbzone', startupValue: 1 }],
			actionId: 'setReverbInputProcessingGain',
			options: { matrixinput: expr('$(local:reverbzone)'), gain: 0 },
			display: true,
			feedbacks: [
				{
					feedbackId: 'reverbInputProcessingGain',
					options: { reverbinputprocessing: expr('$(local:reverbzone)') },
				},
			],
		})
		addIncDecPair({
			idBase: 'reverb_proc_gain',
			label: 'Gain',
			textPlus: 'Rev Z$(local:reverbzone)\nGain +',
			textMinus: 'Rev Z$(local:reverbzone)\nGain -',
			nameHint: 'change "reverbzone" and step amount',
			localVariables: [{ variableType: 'simple', variableName: 'reverbzone', startupValue: 1 }],
			increaseActionId: 'increaseReverbInputProcessingGain',
			decreaseActionId: 'decreaseReverbInputProcessingGain',
			options: { matrixinput: expr('$(local:reverbzone)'), gain: 0.5 },
			textRotary: 'Rev Z$(local:reverbzone)\nGain',
		})

		pushSection({
			id: 'reverb-processing',
			name: 'Reverb Input Processing',
			description: howToLocal('"reverbzone" (1–4)'),
			definitions: [
				{
					id: 'rp-mute',
					type: 'simple',
					name: 'Mute',
					presets: ['reverb_proc_mute_all', 'reverb_proc_mute_example'],
				},
				{
					id: 'rp-eq',
					type: 'simple',
					name: 'EQ Enable',
					presets: ['reverb_proc_eq_all', 'reverb_proc_eq_example'],
				},
				{
					id: 'rp-gain',
					type: 'simple',
					name: 'Display Gain',
					presets: [
						'reverb_proc_gain_all',
						'reverb_proc_gain_example',
						'reverb_proc_gain_inc',
						'reverb_proc_gain_dec',
						'reverb_proc_gain_rotary',
					],
				},
			],
		})

		// ========== Sound Object Routing ==========
		addLatchAll({
			id: 'sor_mute_all',
			name: 'SOR Mute All',
			text: 'SOR ALL\nMute',
			actionId: 'setSoundObjectRoutingMuteAll',
			optionKey: 'mute',
		})

		presets.sor_mute_all_fg_example = {
			type: 'simple',
			name: 'SOR Mute All in Function Group — EXAMPLE: change local variable "functiongroup"',
			keywords: ['example', 'configure', 'sor', 'mute', 'all'],
			style: { ...buttonBaseStyle, text: 'FG$(local:functiongroup) ALL\nMute' },
			localVariables: [{ variableType: 'simple', variableName: 'functiongroup', startupValue: 1 }],
			steps: [
				{
					down: [
						{
							actionId: 'setSoundObjectRoutingMuteAllInFunctionGroup',
							options: { functiongroup: expr('$(local:functiongroup)'), mute: 1 },
						},
					],
					up: [],
				},
				{
					down: [
						{
							actionId: 'setSoundObjectRoutingMuteAllInFunctionGroup',
							options: { functiongroup: expr('$(local:functiongroup)'), mute: 0 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets.sor_mute_example = {
			type: 'simple',
			name: 'SOR Mute — EXAMPLE: change "functiongroup" + "soundobject"',
			keywords: ['example', 'configure', 'sor'],
			style: { ...buttonBaseStyle, text: 'FG$(local:functiongroup) SO$(local:soundobject)\nMute' },
			localVariables: [
				{ variableType: 'simple', variableName: 'functiongroup', startupValue: 1 },
				{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 },
			],
			steps: [
				{
					down: [
						{
							actionId: 'toggleSoundObjectRoutingMute',
							options: {
								functiongroup: expr('$(local:functiongroup)'),
								soundobject: expr('$(local:soundobject)'),
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'soundObjectRoutingMute',
					options: {
						functiongroup: expr('$(local:functiongroup)'),
						soundobject: expr('$(local:soundobject)'),
					},
					style: { ...COLORS.mute },
				},
			],
		}
		addMomentaryExample({
			id: 'sor_gain_example',
			name: 'Display Gain — EXAMPLE: change "functiongroup" + "soundobject" + Gain',
			text: 'FG$(local:functiongroup) SO$(local:soundobject)\nGain',
			localVariables: [
				{ variableType: 'simple', variableName: 'functiongroup', startupValue: 1 },
				{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 },
			],
			actionId: 'setSoundObjectRoutingGain',
			options: {
				functiongroup: expr('$(local:functiongroup)'),
				soundobject: expr('$(local:soundobject)'),
				gain: 0,
			},
			display: true,
			feedbacks: [
				{
					feedbackId: 'soundObjectRoutingGain',
					options: {
						functiongroup: expr('$(local:functiongroup)'),
						soundobject: expr('$(local:soundobject)'),
					},
				},
			],
		})
		addIncDecPair({
			idBase: 'sor_gain',
			label: 'Gain',
			textPlus: 'FG$(local:functiongroup) SO$(local:soundobject)\nGain +',
			textMinus: 'FG$(local:functiongroup) SO$(local:soundobject)\nGain -',
			nameHint: 'change "functiongroup" + "soundobject" and step amount',
			localVariables: [
				{ variableType: 'simple', variableName: 'functiongroup', startupValue: 1 },
				{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 },
			],
			increaseActionId: 'increaseSoundObjectRoutingGain',
			decreaseActionId: 'decreaseSoundObjectRoutingGain',
			options: {
				functiongroup: expr('$(local:functiongroup)'),
				soundobject: expr('$(local:soundobject)'),
				gain: 0.5,
			},
			textRotary: 'FG$(local:functiongroup) SO$(local:soundobject)\nGain',
		})

		pushSection({
			id: 'sound-object-routing',
			name: 'Sound Object Routing',
			description:
				howToLocal('"functiongroup" and "soundobject"') +
				' Mute All (FG) mutes every Sound Object in one Function Group — set local variable "functiongroup".',
			definitions: [
				{
					id: 'sor-mute',
					type: 'simple',
					name: 'Mute',
					description:
						'ALL = every FG/SO. Mute All FG = one Function Group (edit local variable functiongroup). Example = single SO.',
					presets: ['sor_mute_all', 'sor_mute_all_fg_example', 'sor_mute_example'],
				},
				{
					id: 'sor-gain',
					type: 'simple',
					name: 'Display Gain',
					presets: ['sor_gain_example', 'sor_gain_inc', 'sor_gain_dec',
						'sor_gain_rotary'],
				},
			],
		})

		// ========== Positioning ==========
		presets.pos_delay_mode_all = {
			type: 'simple',
			name: 'Source Delay Mode All',
			style: { ...buttonBaseStyle, text: 'SO ALL\nOff' },
			steps: [
				{
					down: [{ actionId: 'setPositioningSourceDelayModeAll', options: { sourcedelaymode: 0 } }],
					up: [],
				},
				{
					down: [{ actionId: 'setPositioningSourceDelayModeAll', options: { sourcedelaymode: 1 } }],
					up: [],
				},
				{
					down: [{ actionId: 'setPositioningSourceDelayModeAll', options: { sourcedelaymode: 2 } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'positioningSourceDelayModeAll',
					options: {},
				},
			],
		}

		presets.pos_delay_mode_cycle_example = {
			type: 'simple',
			name: 'Source Delay Mode Cycle — EXAMPLE: change "soundobject" (Off → Tight → Full)',
			keywords: ['example', 'configure', 'cycle'],
			style: { ...buttonBaseStyle, text: 'SO$(local:soundobject)\nOff' },
			localVariables: [{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 }],
			steps: [
				{
					down: [
						{
							actionId: 'cyclePositioningSourceDelayMode',
							options: { soundobject: expr('$(local:soundobject)') },
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'positioningSourceDelayMode',
					options: { soundobject: expr('$(local:soundobject)') },
				},
			],
		}

		addMomentaryExample({
			id: 'pos_spread_example',
			name: 'Display Spread — EXAMPLE: change "soundobject" + Spread value',
			text: 'SO$(local:soundobject)\nSpread',
			localVariables: [{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 }],
			actionId: 'setPositioningSourceSpread',
			options: { soundobject: expr('$(local:soundobject)'), sourcespread: 0 },
			display: true,
			feedbacks: [
				{
					feedbackId: 'positioningSourceSpread',
					options: { matrixinput: expr('$(local:soundobject)') },
				},
			],
		})
		addMomentaryExample({
			id: 'pos_xy_example',
			name: 'Display Position X — EXAMPLE: change "soundobject" + X in action',
			text: 'SO$(local:soundobject)\nPos X',
			localVariables: [{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 }],
			actionId: 'setPositioningSourcePositionX',
			options: { soundobject: expr('$(local:soundobject)'), sourceposition: '0' },
			display: true,
			feedbacks: [
				{
					feedbackId: 'positioningSourcePositionX',
					options: { matrixinput: expr('$(local:soundobject)') },
				},
			],
		})
		addIncDecPair({
			idBase: 'pos_spread',
			label: 'Spread',
			textPlus: 'SO$(local:soundobject)\nSpread +',
			textMinus: 'SO$(local:soundobject)\nSpread -',
			nameHint: 'change "soundobject" and step amount',
			localVariables: [{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 }],
			increaseActionId: 'increasePositioningSourceSpread',
			decreaseActionId: 'decreasePositioningSourceSpread',
			options: { soundobject: expr('$(local:soundobject)'), sourcespread: 0.1 },
			textRotary: 'SO$(local:soundobject)\nSpread',
		})
		addIncDecPair({
			idBase: 'pos_xy',
			label: 'Position X',
			textPlus: 'SO$(local:soundobject)\nPos X +',
			textMinus: 'SO$(local:soundobject)\nPos X -',
			nameHint: 'change "soundobject" and step amount',
			localVariables: [{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 }],
			increaseActionId: 'increasePositioningSourcePositionX',
			decreaseActionId: 'decreasePositioningSourcePositionX',
			options: { soundobject: expr('$(local:soundobject)'), sourceposition: 0.1 },
			textRotary: 'SO$(local:soundobject)\nPos X',
		})

		pushSection({
			id: 'positioning',
			name: 'Positioning',
			description:
				'Delay Mode buttons show Off / Tight / Full on the display (grey / orange / olive). Cycle = one SO; All = latch for every Sound Object. Display buttons = black. Inc/Dec = grey. ' +
				howToLocal('"soundobject"'),
			definitions: [
				{
					id: 'pos-delay-mode',
					type: 'simple',
					name: 'Source Delay Mode',
					description:
						'All = latch Off/Tight/Full for every SO (display shows last set). Example = cycle one SO (edit local variable soundobject).',
					presets: ['pos_delay_mode_all', 'pos_delay_mode_cycle_example'],
				},
				{
					id: 'pos-spread',
					type: 'simple',
					name: 'Display Spread',
					presets: ['pos_spread_example', 'pos_spread_inc', 'pos_spread_dec',
						'pos_spread_rotary'],
				},
				{
					id: 'pos-xy',
					type: 'simple',
					name: 'Display Position',
					presets: ['pos_xy_example', 'pos_xy_inc', 'pos_xy_dec',
						'pos_xy_rotary'],
				},
			],
		})

		// ========== Function Group ==========
		addMomentaryExample({
			id: 'fg_spread_example',
			name: 'Display Function Group Spreadfactor — EXAMPLE: change "functiongroup"',
			text: 'FG$(local:functiongroup)\nSpreadfactor',
			localVariables: [{ variableType: 'simple', variableName: 'functiongroup', startupValue: 1 }],
			actionId: 'setFunctionGroupSpreadFactor',
			options: { functiongroup: expr('$(local:functiongroup)'), spreadfactor: 1 },
			display: true,
			feedbacks: [
				{
					feedbackId: 'functionGroupSpreadFactor',
					options: { functiongroup: expr('$(local:functiongroup)') },
				},
			],
		})
		addIncDecPair({
			idBase: 'fg_spread',
			label: 'Function Group Spreadfactor',
			textPlus: 'FG$(local:functiongroup)\nSpread +',
			textMinus: 'FG$(local:functiongroup)\nSpread -',
			nameHint: 'change "functiongroup" and step amount',
			localVariables: [{ variableType: 'simple', variableName: 'functiongroup', startupValue: 1 }],
			increaseActionId: 'increaseFunctionGroupSpreadFactor',
			decreaseActionId: 'decreaseFunctionGroupSpreadFactor',
			options: { functiongroup: expr('$(local:functiongroup)'), spreadfactor: 0.1 },
			textRotary: 'FG$(local:functiongroup)\nSpreadfactor',
		})

		pushSection({
			id: 'function-group',
			name: 'Function Group',
			description: 'Black display + grey Inc/Dec + pink rotary. ' + howToLocal('"functiongroup"'),
			definitions: [
				{
					id: 'fg-spreadfactor',
					type: 'simple',
					name: 'Function Group Spreadfactor',
					presets: ['fg_spread_example', 'fg_spread_inc', 'fg_spread_dec',
						'fg_spread_rotary'],
				},
			],
		})

		// ========== Scene ==========
		addMomentaryExample({
			id: 'scene_recall_example',
			name: 'Display Scene — EXAMPLE: change Scene Number in action',
			text: 'Scene\nRecall',
			localVariables: [],
			actionId: 'recallSceneMajor',
			options: { scenenumber: 0 },
			display: true,
			feedbacks: [{ feedbackId: 'sceneIndex', options: {} }],
		})

		pushSection({
			id: 'scene',
			name: 'Scene',
			description: 'Black display buttons. Edit Scene Number in the action after placing.',
			definitions: [
				{
					id: 'scene-display',
					type: 'simple',
					name: 'Display Scene',
					presets: ['scene_recall_example'],
				},
			],
		})

		// ========== En-Space ==========
		addMomentaryExample({
			id: 'enspace_room_example',
			name: 'Display Room Id — shows current room name + photo',
			text: 'off',
			localVariables: [],
			actionId: 'setMatrixSettingsReverbRoomId',
			options: { reverbroomid: 0 },
			display: true,
			feedbacks: [{ feedbackId: 'matrixSettingsReverbRoomId', options: {} }],
		})

		const enSpaceRoomPresetIds = []
		for (const room of self.CHOICES_REVERB_ROOMS) {
			const roomId = Number(room.id)
			// Factory rooms 0–9 only (custom rooms have no photos)
			if (roomId > 9) continue

			const id = `enspace_room_select_${roomId}`
			enSpaceRoomPresetIds.push(id)
			const png64 = getEnSpaceRoomPng64(roomId)
			presets[id] = {
				type: 'simple',
				name: `Select Room: ${room.label}`,
				keywords: ['enspace', 'room', 'select'],
				style: {
					...(png64 ? { ...displayButtonStyle, png64, pngalignment: 'center:center' } : displayButtonStyle),
					text: room.label,
					color: combineRgb(0, 255, 0),
					size: '14',
				},
				steps: [
					{
						down: [
							{
								actionId: 'setMatrixSettingsReverbRoomId',
								options: { reverbroomid: roomId },
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
		}

		pushSection({
			id: 'enspace',
			name: 'En-Space',
			description:
				'Display shows the current room name (rooms 1–9 with photo, off = black). Select buttons set the room.',
			definitions: [
				{
					id: 'enspace-room-display',
					type: 'simple',
					name: 'Display Room Id',
					presets: ['enspace_room_example'],
				},
				{
					id: 'enspace-room-select',
					type: 'simple',
					name: 'Select Room',
					presets: enSpaceRoomPresetIds,
				},
			],
		})

		const specialZoneStyle = {
			size: '14',
			...COLORS.specialZoneOff,
		}

		presets.special_enspace_input_dec = {
			type: 'simple',
			name: 'Special En-Space - Matrix Input Dec',
			keywords: ['special', 'enspace', 'matrixinput'],
			style: { ...buttonBaseStyle, text: 'Input -' },
			steps: [{ down: [{ actionId: 'decreaseSpecialEnSpaceInput', options: {} }], up: [] }],
			feedbacks: [{ feedbackId: 'specialEnSpaceInput', options: { suffix: '-' } }],
		}
		presets.special_enspace_input_inc = {
			type: 'simple',
			name: 'Special En-Space - Matrix Input Inc',
			keywords: ['special', 'enspace', 'matrixinput'],
			style: { ...buttonBaseStyle, text: 'Input +' },
			steps: [{ down: [{ actionId: 'increaseSpecialEnSpaceInput', options: {} }], up: [] }],
			feedbacks: [{ feedbackId: 'specialEnSpaceInput', options: { suffix: '+' } }],
		}
		presets.special_enspace_input_rotary = {
			type: 'simple',
			name: 'Special En-Space - Matrix Input Rotary (↻ +1 / ↺ −1; hold = ±10)',
			keywords: ['special', 'enspace', 'matrixinput', 'rotary', 'encoder'],
			style: { ...rotaryButtonStyle, text: 'Input' },
			steps: [
				{
					down: [{ actionId: 'pressRotaryEncoder', options: {} }],
					up: [{ actionId: 'releaseRotaryEncoder', options: {} }],
					rotate_left: [{ actionId: 'decreaseSpecialEnSpaceInput', options: {} }],
					rotate_right: [{ actionId: 'increaseSpecialEnSpaceInput', options: {} }],
				},
			],
			feedbacks: [],
		}
		presets.special_enspace_input_name_display = {
			type: 'simple',
			name: 'Special En-Space - Display Input Name',
			keywords: ['special', 'enspace', 'matrixinput', 'name', 'display', 'channel'],
			style: {
				...displayButtonStyle,
				color: COLORS.specialTextGreen,
				text: 'In ?\n—',
			},
			steps: [{ down: [], up: [] }],
			feedbacks: [{ feedbackId: 'specialEnSpaceInputName', options: {} }],
		}

		presets.special_enspace_send_display = {
			type: 'simple',
			name: 'Special En-Space - Display Send Gain',
			keywords: ['special', 'enspace', 'send', 'gain', 'display'],
			style: {
				...displayButtonStyle,
				color: COLORS.specialTextGreen,
				text: 'In ?\n— dB',
			},
			steps: [{ down: [], up: [] }],
			feedbacks: [{ feedbackId: 'specialEnSpaceSendGain', options: {} }],
		}
		presets.special_enspace_send_dec = {
			type: 'simple',
			name: 'Special En-Space - Send Gain Dec',
			keywords: ['special', 'enspace', 'send', 'gain'],
			style: { ...buttonBaseStyle, text: 'EnSp Send -' },
			steps: [
				{
					down: [{ actionId: 'decreaseSpecialEnSpaceSendGain', options: { reverbsendgain: 0.5 } }],
					up: [],
				},
			],
			feedbacks: [],
		}
		presets.special_enspace_send_inc = {
			type: 'simple',
			name: 'Special En-Space - Send Gain Inc',
			keywords: ['special', 'enspace', 'send', 'gain'],
			style: { ...buttonBaseStyle, text: 'EnSp Send +' },
			steps: [
				{
					down: [{ actionId: 'increaseSpecialEnSpaceSendGain', options: { reverbsendgain: 0.5 } }],
					up: [],
				},
			],
			feedbacks: [],
		}
		presets.special_enspace_send_rotary = {
			type: 'simple',
			name: 'Special En-Space - Send Gain Rotary (↻ inc / ↺ dec; hold = 6 dB)',
			keywords: ['special', 'enspace', 'send', 'gain', 'rotary', 'encoder'],
			style: { ...rotaryButtonStyle, text: 'EnSp Send' },
			steps: [
				{
					down: [{ actionId: 'pressRotaryEncoder', options: {} }],
					up: [{ actionId: 'releaseRotaryEncoder', options: {} }],
					rotate_left: [
						{ actionId: 'decreaseSpecialEnSpaceSendGain', options: { reverbsendgain: 0.5 } },
					],
					rotate_right: [
						{ actionId: 'increaseSpecialEnSpaceSendGain', options: { reverbsendgain: 0.5 } },
					],
				},
			],
			feedbacks: [],
		}
		presets.special_enspace_send_all_off = {
			type: 'simple',
			name: 'Special En-Space - All In EnSp -120',
			keywords: ['special', 'enspace', 'send', 'gain', 'all', '-120'],
			style: { ...specialZoneStyle, text: 'All In\nEnSp -120' },
			steps: [
				{
					down: [{ actionId: 'setSpecialEnSpaceSendGainAllOff', options: {} }],
					up: [],
				},
			],
			feedbacks: [],
		}

		for (let zone = 1; zone <= 4; zone++) {
			presets[`special_enspace_zone_${zone}`] = {
				type: 'simple',
				name: `Special En-Space - Zone ${zone} (-120 / 0)`,
				keywords: ['special', 'enspace', 'zone', String(zone)],
				style: { ...specialZoneStyle, text: `Z${zone}\n-120` },
				steps: [
					{
						down: [
							{
								actionId: 'toggleSpecialEnSpaceZoneGain',
								options: { zone },
							},
						],
						up: [],
					},
				],
				feedbacks: [{ feedbackId: 'specialEnSpaceZoneGain', options: { zone } }],
			}
		}

		presets.special_enspace_all_zones_off = {
			type: 'simple',
			name: 'Special En-Space - All Zones All Inputs -120',
			keywords: ['special', 'enspace', 'zone', 'all', '-120'],
			style: { ...specialZoneStyle, text: 'All Zones\nAll In\n-120' },
			steps: [
				{
					down: [{ actionId: 'setSpecialEnSpaceAllZonesOff', options: {} }],
					up: [],
				},
			],
			feedbacks: [],
		}

		pushSection({
			id: 'special-presets',
			name: 'Special Presets',
			description:
				'En-Space Input Bank: shared Matrix Input selector, Send Gain ±, Zone 1–4 toggle (-120 default / 0). Only one zone can be 0 at a time (others go to -120). Colours: off=black, Z1=blue, Z2=white, Z3=red, Z4=dark green; text always green.',
			definitions: [
				{
					id: 'special-enspace-input',
					type: 'simple',
					name: 'Matrix Input Select',
					presets: [
						'special_enspace_input_dec',
						'special_enspace_input_inc',
						'special_enspace_input_rotary',
						'special_enspace_input_name_display',
					],
				},
				{
					id: 'special-enspace-send',
					type: 'simple',
					name: 'En-Space Send Gain',
					presets: [
						'special_enspace_send_display',
						'special_enspace_send_dec',
						'special_enspace_send_inc',
						'special_enspace_send_rotary',
						'special_enspace_send_all_off',
					],
				},
				{
					id: 'special-enspace-zones',
					type: 'simple',
					name: 'En-Space Zone Gain (-120 / 0)',
					presets: [
						'special_enspace_zone_1',
						'special_enspace_zone_2',
						'special_enspace_zone_3',
						'special_enspace_zone_4',
						'special_enspace_all_zones_off',
					],
				},
			],
		})

		self.setPresetDefinitions(structure, presets)
	},
}
