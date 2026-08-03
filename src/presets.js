const { combineRgb } = require('@companion-module/base')

module.exports = {
	initPresets: function () {
		let self = this
		let presets = {}

		const r1MuteOnBg = combineRgb(216, 43, 43)
		const r1MuteOffBg = combineRgb(135, 135, 135)
		const r1MuteText = combineRgb(255, 255, 255)

		const inputCount = 128
		const outputCount = 64
		const functionGroupCount = self.FUNCTION_GROUP_COUNT || 32
		const reverbZoneCount = 4
		// Keep SOR preset count manageable for Companion UI (full 32×128 floods the preset panel)
		const sorSoundObjectCount = 64

		const muteStyle = {
			size: '14',
			color: r1MuteText,
			bgcolor: r1MuteOffBg,
		}

		const muteFeedbackStyle = {
			color: r1MuteText,
			bgcolor: r1MuteOnBg,
		}

		function addLatchMutePreset({ id, category, name, text, actionId, muteOptions, unmuteOptions, feedbackId, feedbackOptions }) {
			const preset = {
				type: 'button',
				category,
				name,
				style: {
					...muteStyle,
					text,
				},
				steps: [
					{
						down: [{ actionId, options: muteOptions }],
						up: [],
					},
					{
						down: [{ actionId, options: unmuteOptions }],
						up: [],
					},
				],
				feedbacks: [],
			}

			if (feedbackId && feedbackOptions) {
				preset.feedbacks.push({
					feedbackId,
					options: feedbackOptions,
					style: muteFeedbackStyle,
				})
			}

			presets[id] = preset
		}

		function addToggleMutePreset({ id, category, name, text, actionId, actionOptions, feedbackId, feedbackOptions }) {
			presets[id] = {
				type: 'button',
				category,
				name,
				style: {
					...muteStyle,
					text,
				},
				steps: [
					{
						down: [{ actionId, options: actionOptions }],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId,
						options: feedbackOptions,
						style: muteFeedbackStyle,
					},
				],
			}
		}

		// --- Matrix Input Mute (1–128) ---
		for (let i = 1; i <= inputCount; i++) {
			addLatchMutePreset({
				id: `matrix_input_mute_${i}`,
				category: 'Matrix Input Mute',
				name: `Matrix Input ${i} Mute`,
				text: `In ${i}\nMute`,
				actionId: 'setMatrixInputMute',
				muteOptions: { matrixinput: i, mute: 1 },
				unmuteOptions: { matrixinput: i, mute: 0 },
				feedbackId: 'matrixInputMute',
				feedbackOptions: { matrixinput: i },
			})
		}

		addLatchMutePreset({
			id: 'matrix_input_mute_all',
			category: 'Matrix Input Mute',
			name: 'Matrix Input Mute All',
			text: 'In ALL\nMute',
			actionId: 'setMatrixInputMuteAll',
			muteOptions: { mute: 1 },
			unmuteOptions: { mute: 0 },
		})

		// --- Matrix Output Mute (1–64) ---
		for (let i = 1; i <= outputCount; i++) {
			addLatchMutePreset({
				id: `matrix_output_mute_${i}`,
				category: 'Matrix Output Mute',
				name: `Matrix Output ${i} Mute`,
				text: `Out ${i}\nMute`,
				actionId: 'setMatrixOutputMute',
				muteOptions: { matrixoutput: i, mute: 1 },
				unmuteOptions: { matrixoutput: i, mute: 0 },
				feedbackId: 'matrixOutputMute',
				feedbackOptions: { matrixoutput: i },
			})
		}

		addLatchMutePreset({
			id: 'matrix_output_mute_all',
			category: 'Matrix Output Mute',
			name: 'Matrix Output Mute All',
			text: 'Out ALL\nMute',
			actionId: 'setMatrixOutputMuteAll',
			muteOptions: { mute: 1 },
			unmuteOptions: { mute: 0 },
		})

		// --- Reverb Input Processing Mute (zones 1–4) ---
		for (let i = 1; i <= reverbZoneCount; i++) {
			addLatchMutePreset({
				id: `reverb_input_processing_mute_${i}`,
				category: 'Reverb Input Processing Mute',
				name: `Reverb Processing Zone ${i} Mute`,
				text: `Rev Z${i}\nMute`,
				actionId: 'setReverbInputProcessingMute',
				muteOptions: { matrixinput: i, mute: 1 },
				unmuteOptions: { matrixinput: i, mute: 0 },
				feedbackId: 'reverbInputProcessingMute',
				feedbackOptions: { reverbinputprocessing: i },
			})
		}

		addLatchMutePreset({
			id: 'reverb_input_processing_mute_all',
			category: 'Reverb Input Processing Mute',
			name: 'Reverb Processing Mute All',
			text: 'Rev ALL\nMute',
			actionId: 'setReverbInputProcessingMuteAll',
			muteOptions: { mute: 1 },
			unmuteOptions: { mute: 0 },
		})

		// --- Sound Object Routing Mute (FG × SO, capped SO count for UI performance) ---
		for (let fg = 1; fg <= functionGroupCount; fg++) {
			const category = `SOR Mute FG ${String(fg).padStart(2, '0')}`
			for (let so = 1; so <= sorSoundObjectCount; so++) {
				addToggleMutePreset({
					id: `sor_mute_fg${fg}_so${so}`,
					category,
					name: `SOR FG${fg} SO${so} Mute`,
					text: `FG${fg} SO${so}\nMute`,
					actionId: 'toggleSoundObjectRoutingMute',
					actionOptions: { functiongroup: fg, soundobject: so },
					feedbackId: 'soundObjectRoutingMute',
					feedbackOptions: { functiongroup: fg, soundobject: so },
				})
			}
		}

		self.setPresetDefinitions(presets)
	},
}
