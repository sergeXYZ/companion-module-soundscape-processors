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
			description: howToLocal('"functiongroup" and "soundobject"'),
			definitions: [
				{
					id: 'sor-mute',
					type: 'simple',
					name: 'Mute',
					presets: ['sor_mute_all', 'sor_mute_example'],
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
		addMomentaryExample({
			id: 'pos_delay_mode_off_example',
			name: 'Source Delay Mode Off — EXAMPLE: change "soundobject"',
			text: 'SO$(local:soundobject)\nOff',
			localVariables: [{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 }],
			actionId: 'setPositioningSourceDelayMode',
			options: { soundobject: expr('$(local:soundobject)'), sourcedelaymode: 0 },
		})
		addMomentaryExample({
			id: 'pos_delay_mode_tight_example',
			name: 'Source Delay Mode Tight — EXAMPLE: change "soundobject"',
			text: 'SO$(local:soundobject)\nTight',
			localVariables: [{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 }],
			actionId: 'setPositioningSourceDelayMode',
			options: { soundobject: expr('$(local:soundobject)'), sourcedelaymode: 1 },
			feedbacks: [
				{
					feedbackId: 'positioningSourceDelayModeTight',
					options: { soundobject: expr('$(local:soundobject)') },
					style: { ...COLORS.tight },
				},
			],
		})
		addMomentaryExample({
			id: 'pos_delay_mode_full_example',
			name: 'Source Delay Mode Full — EXAMPLE: change "soundobject"',
			text: 'SO$(local:soundobject)\nFull',
			localVariables: [{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 }],
			actionId: 'setPositioningSourceDelayMode',
			options: { soundobject: expr('$(local:soundobject)'), sourcedelaymode: 2 },
			feedbacks: [
				{
					feedbackId: 'positioningSourceDelayModeFull',
					options: { soundobject: expr('$(local:soundobject)') },
					style: { ...COLORS.full },
				},
			],
		})
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
				'Delay Mode: Off=grey, Tight=orange, Full=olive (from Colours/). ' + howToLocal('"soundobject"'),
			definitions: [
				{
					id: 'pos-delay-mode',
					type: 'simple',
					name: 'Source Delay Mode',
					presets: [
						'pos_delay_mode_off_example',
						'pos_delay_mode_tight_example',
						'pos_delay_mode_full_example',
					],
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

		function addRotaryExample({
			id,
			name,
			text,
			localVariables,
			increaseActionId,
			decreaseActionId,
			increaseOptions,
			decreaseOptions,
			feedbackId,
			feedbackOptions,
		}) {
			const feedbacks = []
			if (feedbackId && feedbackOptions) {
				feedbacks.push({
					feedbackId,
					options: feedbackOptions,
				})
			}

			presets[id] = {
				type: 'simple',
				name,
				keywords: ['rotary', 'encoder', 'streamdeck', 'example'],
				style: { ...buttonBaseStyle, text },
				localVariables,
				steps: [
					{
						down: [],
						up: [],
						rotate_left: [{ actionId: decreaseActionId, options: decreaseOptions }],
						rotate_right: [{ actionId: increaseActionId, options: increaseOptions }],
					},
				],
				feedbacks,
			}
		}

		addRotaryExample({
			id: 'rotary_matrix_input_gain',
			name: 'Rotary Matrix Input Gain — EXAMPLE: change "matrixinput" (and step "gain")',
			text: 'In $(local:matrixinput)\nGain',
			localVariables: [{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 }],
			increaseActionId: 'increaseMatrixInputGain',
			decreaseActionId: 'decreaseMatrixInputGain',
			increaseOptions: { matrixinput: expr('$(local:matrixinput)'), gain: 0.5 },
			decreaseOptions: { matrixinput: expr('$(local:matrixinput)'), gain: 0.5 },
			feedbackId: 'matrixInputGain',
			feedbackOptions: { matrixinput: expr('$(local:matrixinput)') },
		})

		addRotaryExample({
			id: 'rotary_matrix_output_gain',
			name: 'Rotary Matrix Output Gain — EXAMPLE: change "matrixoutput" (and step "gain")',
			text: 'Out $(local:matrixoutput)\nGain',
			localVariables: [{ variableType: 'simple', variableName: 'matrixoutput', startupValue: 1 }],
			increaseActionId: 'increaseMatrixOutputGain',
			decreaseActionId: 'decreaseMatrixOutputGain',
			increaseOptions: { matrixoutput: expr('$(local:matrixoutput)'), gain: 0.5 },
			decreaseOptions: { matrixoutput: expr('$(local:matrixoutput)'), gain: 0.5 },
			feedbackId: 'matrixOutputGain',
			feedbackOptions: { matrixoutput: expr('$(local:matrixoutput)') },
		})

		addRotaryExample({
			id: 'rotary_matrix_input_delay',
			name: 'Rotary Matrix Input Delay — EXAMPLE: change "matrixinput" (and step "delay")',
			text: 'In $(local:matrixinput)\nDelay',
			localVariables: [{ variableType: 'simple', variableName: 'matrixinput', startupValue: 1 }],
			increaseActionId: 'increaseMatrixInputDelay',
			decreaseActionId: 'decreaseMatrixInputDelay',
			increaseOptions: { matrixinput: expr('$(local:matrixinput)'), delay: 1 },
			decreaseOptions: { matrixinput: expr('$(local:matrixinput)'), delay: 1 },
			feedbackId: 'matrixInputDelay',
			feedbackOptions: { matrixinput: expr('$(local:matrixinput)') },
		})

		addRotaryExample({
			id: 'rotary_sor_gain',
			name: 'Rotary SOR Gain — EXAMPLE: change "functiongroup" + "soundobject" (and step "gain")',
			text: 'FG$(local:functiongroup) SO$(local:soundobject)\nGain',
			localVariables: [
				{ variableType: 'simple', variableName: 'functiongroup', startupValue: 1 },
				{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 },
			],
			increaseActionId: 'increaseSoundObjectRoutingGain',
			decreaseActionId: 'decreaseSoundObjectRoutingGain',
			increaseOptions: {
				functiongroup: expr('$(local:functiongroup)'),
				soundobject: expr('$(local:soundobject)'),
				gain: 0.5,
			},
			decreaseOptions: {
				functiongroup: expr('$(local:functiongroup)'),
				soundobject: expr('$(local:soundobject)'),
				gain: 0.5,
			},
			feedbackId: 'soundObjectRoutingGain',
			feedbackOptions: {
				functiongroup: expr('$(local:functiongroup)'),
				soundobject: expr('$(local:soundobject)'),
			},
		})

		addRotaryExample({
			id: 'rotary_pos_spread',
			name: 'Rotary Source Spread — EXAMPLE: change "soundobject" (and step "sourcespread")',
			text: 'SO$(local:soundobject)\nSpread',
			localVariables: [{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 }],
			increaseActionId: 'increasePositioningSourceSpread',
			decreaseActionId: 'decreasePositioningSourceSpread',
			increaseOptions: { soundobject: expr('$(local:soundobject)'), sourcespread: 0.1 },
			decreaseOptions: { soundobject: expr('$(local:soundobject)'), sourcespread: 0.1 },
			feedbackId: 'positioningSourceSpread',
			feedbackOptions: { matrixinput: expr('$(local:soundobject)') },
		})

		addRotaryExample({
			id: 'rotary_pos_x',
			name: 'Rotary Source Position X — EXAMPLE: change "soundobject" (and step "sourceposition")',
			text: 'SO$(local:soundobject)\nPos X',
			localVariables: [{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 }],
			increaseActionId: 'increasePositioningSourcePositionX',
			decreaseActionId: 'decreasePositioningSourcePositionX',
			increaseOptions: { soundobject: expr('$(local:soundobject)'), sourceposition: 0.1 },
			decreaseOptions: { soundobject: expr('$(local:soundobject)'), sourceposition: 0.1 },
			feedbackId: 'positioningSourcePositionX',
			feedbackOptions: { matrixinput: expr('$(local:soundobject)') },
		})

		addRotaryExample({
			id: 'rotary_pos_y',
			name: 'Rotary Source Position Y — EXAMPLE: change "soundobject" (and step "sourceposition")',
			text: 'SO$(local:soundobject)\nPos Y',
			localVariables: [{ variableType: 'simple', variableName: 'soundobject', startupValue: 1 }],
			increaseActionId: 'increasePositioningSourcePositionY',
			decreaseActionId: 'decreasePositioningSourcePositionY',
			increaseOptions: { soundobject: expr('$(local:soundobject)'), sourceposition: 0.1 },
			decreaseOptions: { soundobject: expr('$(local:soundobject)'), sourceposition: 0.1 },
			feedbackId: 'positioningSourcePositionY',
			feedbackOptions: { matrixinput: expr('$(local:soundobject)') },
		})

		pushSection({
			id: 'streamdeck-rotaries',
			name: 'Stream Deck Rotaries',
			description:
				'Encoder presets for Stream Deck +. Rotate right = increase, left = decrease. After placing: edit Local Variables (and step amount in the rotate actions). Grey base; advanced feedback shows the live value when polled.',
			definitions: [
				{
					id: 'rotary-matrix-input-gain',
					type: 'simple',
					name: 'Matrix Input Gain',
					description: 'Change local variable "matrixinput". Step amount is action option "gain" (default 0.5 dB).',
					presets: ['rotary_matrix_input_gain'],
				},
				{
					id: 'rotary-matrix-output-gain',
					type: 'simple',
					name: 'Matrix Output Gain',
					description: 'Change local variable "matrixoutput". Step amount is action option "gain" (default 0.5 dB).',
					presets: ['rotary_matrix_output_gain'],
				},
				{
					id: 'rotary-matrix-input-delay',
					type: 'simple',
					name: 'Matrix Input Delay',
					description: 'Change local variable "matrixinput". Step amount is action option "delay" (default 1 ms).',
					presets: ['rotary_matrix_input_delay'],
				},
				{
					id: 'rotary-sor-gain',
					type: 'simple',
					name: 'SOR Gain',
					description: 'Change "functiongroup" + "soundobject". Step amount is "gain" (default 0.5 dB).',
					presets: ['rotary_sor_gain'],
				},
				{
					id: 'rotary-pos-spread',
					type: 'simple',
					name: 'Source Spread',
					description: 'Change "soundobject". Step amount is "sourcespread" (default 0.1).',
					presets: ['rotary_pos_spread'],
				},
				{
					id: 'rotary-pos-x',
					type: 'simple',
					name: 'Source Position X',
					description: 'Change "soundobject". Step amount is "sourceposition" (default 0.1).',
					presets: ['rotary_pos_x'],
				},
				{
					id: 'rotary-pos-y',
					type: 'simple',
					name: 'Source Position Y',
					description: 'Change "soundobject". Step amount is "sourceposition" (default 0.1).',
					presets: ['rotary_pos_y'],
				},
			],
		})

		self.setPresetDefinitions(structure, presets)
	},
}
