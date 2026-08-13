import { COLORS, buttonBaseStyle } from './colours.js'

export default {
	initPresets: function () {
		let self = this
		let presets = {}
		let structure = []

		const expr = (value) => ({ isExpression: true, value })

		function pushSection(section) {
			structure.push(section)
		}

		function addLatchAll({ id, name, text, actionId, optionKey }) {
			presets[id] = {
				type: 'simple',
				name,
				style: { ...buttonBaseStyle, text },
				steps: [
					{ down: [{ actionId, options: { [optionKey]: 1 } }], up: [] },
					{ down: [{ actionId, options: { [optionKey]: 0 } }], up: [] },
				],
				feedbacks: [],
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
				feedbacks: [
					{
						feedbackId,
						options: feedbackOptions,
						style: { ...activeStyle },
					},
				],
			}
		}

		function addMomentaryExample({ id, name, text, localVariables, actionId, options, feedbacks = [] }) {
			presets[id] = {
				type: 'simple',
				name,
				keywords: ['example', 'configure'],
				style: { ...buttonBaseStyle, text },
				localVariables,
				steps: [{ down: [{ actionId, options }], up: [] }],
				feedbacks,
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
			name: 'Matrix Input Gain — EXAMPLE: change "matrixinput" and action Gain value',
			text: 'In $(local:matrixinput)\nGain',
			localVariables: [{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 }],
			actionId: 'setMatrixInputGain',
			options: { matrixinput: expr('$(local:matrixinput)'), gain: 0 },
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
			name: 'Matrix Input Delay — EXAMPLE: change "matrixinput" and Delay ms',
			text: 'In $(local:matrixinput)\nDelay ms',
			localVariables: [{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 }],
			actionId: 'setMatrixInputDelay',
			options: { matrixinput: expr('$(local:matrixinput)'), delay: 0 },
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

		pushSection({
			id: 'matrix-input',
			name: 'Matrix Input',
			description:
				'Mute=red, Delay enable=orange, EQ=blue, Polarity=yellow (from Colours/). Other states=grey. ' +
				howToLocal('"matrixinput" (and Gain/Delay values in the action)'),
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
					name: 'Gain',
					description: 'Grey buttons. Edit Gain in the action after placing.',
					presets: ['matrix_input_gain_all', 'matrix_input_gain_example'],
				},
				{
					id: 'mi-delay',
					type: 'simple',
					name: 'Delay (ms)',
					description: 'Grey buttons. Edit Delay in the action after placing.',
					presets: ['matrix_input_delay_all', 'matrix_input_delay_example'],
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
			name: 'Matrix Output Gain — EXAMPLE: change "matrixoutput" and Gain',
			text: 'Out $(local:matrixoutput)\nGain',
			localVariables: [{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 }],
			actionId: 'setMatrixOutputGain',
			options: { matrixoutput: expr('$(local:matrixoutput)'), gain: 0 },
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
			name: 'Matrix Output Delay — EXAMPLE: change "matrixoutput" and Delay ms',
			text: 'Out $(local:matrixoutput)\nDelay ms',
			localVariables: [{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 }],
			actionId: 'setMatrixOutputDelay',
			options: { matrixoutput: expr('$(local:matrixoutput)'), delay: 0 },
			feedbacks: [
				{
					feedbackId: 'matrixOutputDelay',
					options: { matrixoutput: expr('$(local:matrixoutput)') },
				},
			],
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
					name: 'Gain',
					presets: ['matrix_output_gain_all', 'matrix_output_gain_example'],
				},
				{
					id: 'mo-delay',
					type: 'simple',
					name: 'Delay (ms)',
					presets: ['matrix_output_delay_all', 'matrix_output_delay_example'],
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
			name: 'Matrix Node Gain — EXAMPLE: change "matrixinput" + "matrixoutput" + Gain',
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
			name: 'Matrix Node Delay — EXAMPLE: change "matrixinput" + "matrixoutput" + Delay',
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
					name: 'Gain',
					presets: ['matrix_node_gain_all', 'matrix_node_gain_example'],
				},
				{
					id: 'mn-delay',
					type: 'simple',
					name: 'Delay (ms)',
					presets: ['matrix_node_delay_all', 'matrix_node_delay_example'],
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
			name: 'Reverb Processing Gain — EXAMPLE: change "reverbzone" + Gain',
			text: 'Rev Z$(local:reverbzone)\nGain',
			localVariables: [{ variableType: 'simple', variableName: 'reverbzone', startupValue: 1 }],
			actionId: 'setReverbInputProcessingGain',
			options: { matrixinput: expr('$(local:reverbzone)'), gain: 0 },
			feedbacks: [
				{
					feedbackId: 'reverbInputProcessingGain',
					options: { reverbinputprocessing: expr('$(local:reverbzone)') },
				},
			],
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
					name: 'Gain',
					presets: ['reverb_proc_gain_all', 'reverb_proc_gain_example'],
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
			name: 'SOR Gain — EXAMPLE: change "functiongroup" + "soundobject" + Gain',
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
					name: 'Gain',
					presets: ['sor_gain_example'],
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
			name: 'Source Spread — EXAMPLE: change "soundobject" + Spread value',
			text: 'SO$(local:soundobject)\nSpread',
			localVariables: [{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 }],
			actionId: 'setPositioningSourceSpread',
			options: { soundobject: expr('$(local:soundobject)'), sourcespread: 0 },
			feedbacks: [
				{
					feedbackId: 'positioningSourceSpread',
					options: { matrixinput: expr('$(local:soundobject)') },
				},
			],
		})
		addMomentaryExample({
			id: 'pos_xy_example',
			name: 'Source Position X — EXAMPLE: change "soundobject" + X in action',
			text: 'SO$(local:soundobject)\nPos X',
			localVariables: [{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 }],
			actionId: 'setPositioningSourcePositionX',
			options: { soundobject: expr('$(local:soundobject)'), sourceposition: '0' },
			feedbacks: [
				{
					feedbackId: 'positioningSourcePositionX',
					options: { matrixinput: expr('$(local:soundobject)') },
				},
			],
		})

		pushSection({
			id: 'positioning',
			name: 'Positioning',
			description:
				'Delay Mode buttons show Off / Tight / Full on the display (grey / orange / olive). Cycle = one SO; All = latch for every Sound Object. ' +
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
					name: 'Source Spread',
					presets: ['pos_spread_example'],
				},
				{
					id: 'pos-xy',
					type: 'simple',
					name: 'Source Position',
					presets: ['pos_xy_example'],
				},
			],
		})

		// ========== Function Group / Scene / En-Space globals ==========
		addMomentaryExample({
			id: 'fg_spread_example',
			name: 'Function Group Spread — EXAMPLE: change "functiongroup"',
			text: 'FG$(local:functiongroup)\nSpread',
			localVariables: [{ variableType: 'simple', variableName: 'functiongroup', startupValue: 1 }],
			actionId: 'setFunctionGroupSpreadFactor',
			options: { functiongroup: expr('$(local:functiongroup)'), spreadfactor: 1 },
			feedbacks: [
				{
					feedbackId: 'functionGroupSpreadFactor',
					options: { functiongroup: expr('$(local:functiongroup)') },
				},
			],
		})
		addMomentaryExample({
			id: 'scene_recall_example',
			name: 'Scene Recall — EXAMPLE: change Scene Number in action',
			text: 'Scene\nRecall',
			localVariables: [],
			actionId: 'recallSceneMajor',
			options: { scenenumber: 0 },
			feedbacks: [{ feedbackId: 'sceneIndex', options: {} }],
		})
		addMomentaryExample({
			id: 'enspace_room_example',
			name: 'En-Space Room Id — EXAMPLE: change Room Number in action',
			text: 'En-Space\nRoom',
			localVariables: [],
			actionId: 'setMatrixSettingsReverbRoomId',
			options: { reverbroomid: 1 },
			feedbacks: [{ feedbackId: 'matrixSettingsReverbRoomId', options: {} }],
		})

		pushSection({
			id: 'global',
			name: 'Function Group / Scene / En-Space',
			description: 'Grey example buttons. Edit local variables / action values after placing.',
			definitions: [
				{
					id: 'fg',
					type: 'simple',
					name: 'Function Group',
					presets: ['fg_spread_example'],
				},
				{
					id: 'scene',
					type: 'simple',
					name: 'Scene',
					presets: ['scene_recall_example'],
				},
				{
					id: 'enspace',
					type: 'simple',
					name: 'En-Space',
					presets: ['enspace_room_example'],
				},
			],
		})

		self.setPresetDefinitions(structure, presets)
	},
}
