export default {
	initVariables() {
		let self = this
		let variables = {}

		const add = (variableId, name) => {
			variables[variableId] = { name }
		}

		add('settings_device_name', 'Settings - Device Name')

		add('status_text', 'Status - Status Text')
		add('status_audio_network_sample_status', 'Status - Audio Network Sample Status')
		add('status_matrixinputcount', 'Status - Matrix Input Count')
		add('status_matrixoutputcount', 'Status - Matrix Output Count')

		for (let i = 1; i <= self.matrixInputCount; i++) {
			add(`matrixinput${i}_mute`, `Matrix Input ${i} - Mute`)
			add(`matrixinput${i}_gain`, `Matrix Input ${i} - Gain`)
			add(`matrixinput${i}_delay`, `Matrix Input ${i} - Delay`)
			add(`matrixinput${i}_delay_enable`, `Matrix Input ${i} - Delay Enable`)
			add(`matrixinput${i}_eq_enable`, `Matrix Input ${i} - EQ Enable`)
			add(`matrixinput${i}_polarity`, `Matrix Input ${i} - Polarity`)
			add(`matrixinput${i}_channel_name`, `Matrix Input ${i} - Channel Name`)
			add(`matrixinput${i}_level_meter_pre_mute`, `Matrix Input ${i} - Level Meter Pre Mute`)
			add(`matrixinput${i}_level_meter_post_mute`, `Matrix Input ${i} - Level Meter Post Mute`)
		}

		for (let i = 1; i <= self.matrixInputCount; i++) {
			for (let j = 1; j <= self.matrixOutputCount; j++) {
				add(`matrixnode${i}_${j}_enable`, `Matrix Node ${i} - ${j} - Enable`)
				add(`matrixnode${i}_${j}_gain`, `Matrix Node ${i} - ${j} - Gain`)
				add(`matrixnode${i}_${j}_delay_enable`, `Matrix Node ${i} - ${j} - Delay Enable`)
				add(`matrixnode${i}_${j}_delay`, `Matrix Node ${i} - ${j} - Delay`)
			}
		}

		for (let i = 1; i <= self.matrixOutputCount; i++) {
			add(`matrixoutput${i}_mute`, `Matrix Output ${i} - Mute`)
			add(`matrixoutput${i}_gain`, `Matrix Output ${i} - Gain`)
			add(`matrixoutput${i}_delay`, `Matrix Output ${i} - Delay`)
			add(`matrixoutput${i}_delay_enable`, `Matrix Output ${i} - Delay Enable`)
			add(`matrixoutput${i}_eq_enable`, `Matrix Output ${i} - EQ Enable`)
			add(`matrixoutput${i}_polarity`, `Matrix Output ${i} - Polarity`)
			add(`matrixoutput${i}_channel_name`, `Matrix Output ${i} - Channel Name`)
			add(`matrixoutput${i}_level_meter_pre_mute`, `Matrix Output ${i} - Level Meter Pre Mute`)
			add(`matrixoutput${i}_level_meter_post_mute`, `Matrix Output ${i} - Level Meter Post Mute`)
		}

		// scenes
		add('scene_index', 'Scene Index')
		add('scene_name', 'Scene Name')
		add('scene_comment', 'Scene Comment')

		// sound object routing (only expose combos used on control surfaces for now)
		add('soundobjectrouting_gain_1_1', 'Sound Object Routing Gain FG1 / SO1')
		add('soundobjectrouting_mute_1_1', 'Sound Object Routing Mute FG1 / SO1')

		self.setVariableDefinitions(variables)
	},
}
