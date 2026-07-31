module.exports = {
	initVariables() {
		let self = this
		let variables = []

		variables.push({ variableId: 'settings_device_name', name: 'Settings - Device Name' })

		variables.push({ variableId: 'status_text', name: 'Status - Status Text' })
		variables.push({
			variableId: 'status_audio_network_sample_status',
			name: 'Status - Audio Network Sample Status',
		})
		variables.push({ variableId: 'status_matrixinputcount', name: 'Status - Matrix Input Count' })
		variables.push({ variableId: 'status_matrixoutputcount', name: 'Status - Matrix Output Count' })

		for (let i = 1; i <= self.matrixInputCount; i++) {
			variables.push({ variableId: `matrixinput${i}_mute`, name: `Matrix Input ${i} - Mute` })
			variables.push({ variableId: `matrixinput${i}_gain`, name: `Matrix Input ${i} - Gain` })
			variables.push({ variableId: `matrixinput${i}_delay`, name: `Matrix Input ${i} - Delay` })
			variables.push({ variableId: `matrixinput${i}_delay_enable`, name: `Matrix Input ${i} - Delay Enable` })
			variables.push({ variableId: `matrixinput${i}_eq_enable`, name: `Matrix Input ${i} - EQ Enable` })
			variables.push({ variableId: `matrixinput${i}_polarity`, name: `Matrix Input ${i} - Polarity` })
			variables.push({ variableId: `matrixinput${i}_channel_name`, name: `Matrix Input ${i} - Channel Name` })
			variables.push({
				variableId: `matrixinput${i}_level_meter_pre_mute`,
				name: `Matrix Input ${i} - Level Meter Pre Mute`,
			})
			variables.push({
				variableId: `matrixinput${i}_level_meter_post_mute`,
				name: `Matrix Input ${i} - Level Meter Post Mute`,
			})
		}

		for (let i = 1; i <= self.matrixInputCount; i++) {
			for (let j = 1; j <= self.matrixOutputCount; j++) {
				variables.push({ variableId: `matrixnode${i}_${j}_enable`, name: `Matrix Node ${i} - ${j} - Enable` })
				variables.push({ variableId: `matrixnode${i}_${j}_gain`, name: `Matrix Node ${i} - ${j} - Gain` })
				variables.push({
					variableId: `matrixnode${i}_${j}_delay_enable`,
					name: `Matrix Node ${i} - ${j} - Delay Enable`,
				})
				variables.push({ variableId: `matrixnode${i}_${j}_delay`, name: `Matrix Node ${i} - ${j} - Delay` })
			}
		}

		for (let i = 1; i <= self.matrixOutputCount; i++) {
			variables.push({ variableId: `matrixoutput${i}_mute`, name: `Matrix Output ${i} - Mute` })
			variables.push({ variableId: `matrixoutput${i}_gain`, name: `Matrix Output ${i} - Gain` })
			variables.push({ variableId: `matrixoutput${i}_delay`, name: `Matrix Output ${i} - Delay` })
			variables.push({ variableId: `matrixoutput${i}_delay_enable`, name: `Matrix Output ${i} - Delay Enable` })
			variables.push({ variableId: `matrixoutput${i}_eq_enable`, name: `Matrix Output ${i} - EQ Enable` })
			variables.push({ variableId: `matrixoutput${i}_polarity`, name: `Matrix Output ${i} - Polarity` })
			variables.push({ variableId: `matrixoutput${i}_channel_name`, name: `Matrix Output ${i} - Channel Name` })
			variables.push({
				variableId: `matrixoutput${i}_level_meter_pre_mute`,
				name: `Matrix Output ${i} - Level Meter Pre Mute`,
			})
			variables.push({
				variableId: `matrixoutput${i}_level_meter_post_mute`,
				name: `Matrix Output ${i} - Level Meter Post Mute`,
			})
		}

		/*for (let i = 1; i <= 64; i++) {
			variables.push({ variableId: `positioning_${i}_source_spread`, name: `Positioning ${i} - Source Spread` })
			variables.push({
				variableId: `positioning_${i}_source_delay_mode`,
				name: `Positioning ${i} - Source Delay Mode`,
			})
			variables.push({
				variableId: `positioning_${i}_source_position_x`,
				name: `Positioning ${i} - Source Position X`,
			})
			variables.push({
				variableId: `positioning_${i}_source_position_y`,
				name: `Positioning ${i} - Source Position Y`,
			})
			variables.push({
				variableId: `positioning_${i}_source_position_z`,
				name: `Positioning ${i} - Source Position Z`,
			})
		}*/

		/*for (let i = 1; i <= 4; i++) {
			for (let j = 1; j <= 64; j++) {
				variables.push({
					variableId: `coordinatemapping_source_position_${i}_${j}_x`,
					name: `Coordinate Mapping ${i} - ${j} - Source Position X`,
				})
				variables.push({
					variableId: `coordinatemapping_source_position_${i}_${j}_y`,
					name: `Coordinate Mapping ${i} - ${j} - Source Position Y`,
				})
				variables.push({
					variableId: `coordinatemapping_source_position_${i}_${j}_z`,
					name: `Coordinate Mapping ${i} - ${j} - Source Position Z`,
				})
			}
		}*/

		/*variables.push({ variableId: 'matrixsettings_reverb_room_id', name: 'Matrix Settings - Reverb Room Id' })
		variables.push({
			variableId: 'matrixsettings_reverb_pre_delay_factor',
			name: 'Matrix Settings - Reverb Pre Delay Factor',
		})
		variables.push({ variableId: 'matrixsettings_reverb_rear_level', name: 'Matrix Settings - Reverb Rear Level' })

		for (let i = 1; i <= 64; i++) {
			variables.push({
				variableId: `matrixinput${i}_reverb_send_gain`,
				name: `Matrix Input ${i} - Reverb Send Gain`,
			})
		}

		for (let i = 1; i <= 64; i++) {
			for (let j = 1; j <= 4; j++) {
				variables.push({
					variableId: `reverbinput_gain${i}_zone${j}`,
					name: `Reverb Input Gain ${i} Zone ${j}`,
				})
			}
		}

		for (let i = 1; i <= 4; i++) {
			variables.push({
				variableId: `reverbinputprocessing_mute${i}`,
				name: `Reverb Input Processing ${i} - Mute`,
			})
			variables.push({
				variableId: `reverbinputprocessing_gain${i}`,
				name: `Reverb Input Processing ${i} - Gain`,
			})
			variables.push({
				variableId: `reverbinputprocessing_level_meter${i}`,
				name: `Reverb Input Processing ${i} - Level Meter`,
			})
			variables.push({
				variableId: `reverbinputprocessing_eq_enable${i}`,
				name: `Reverb Input Processing ${i} - EQ Enable`,
			})
		}*/

		//scenes
		variables.push({ variableId: 'scene_index', name: 'Scene Index' })
		variables.push({ variableId: 'scene_name', name: 'Scene Name' })
		variables.push({ variableId: 'scene_comment', name: 'Scene Comment' })

		//sound object routing (only expose combos used on control surfaces for now)
		variables.push({
			variableId: 'soundobjectrouting_gain_1_1',
			name: 'Sound Object Routing Gain FG1 / SO1',
		})
		variables.push({
			variableId: 'soundobjectrouting_mute_1_1',
			name: 'Sound Object Routing Mute FG1 / SO1',
		})

		//function group
		/*for (let i = 1; i <= 16; i++) {
			variables.push({ variableId: `functiongroup_name_${i}`, name: `Function Group Name ${i}` })
			variables.push({ variableId: `functiongroup_spread_factor${i}`, name: `Function Group Spread Factor ${i}` })
			variables.push({ variableId: `functiongroup_delay_${i}`, name: `Function Group Delay ${i}` })
		}*/

		//speaker positions
		/*for (let i = 1; i <= 64; i++) {
			variables.push({ variableId: `speakerposition_x_${i}`, name: `Speaker Position X ${i}` })
			variables.push({ variableId: `speakerposition_y_${i}`, name: `Speaker Position Y ${i}` })
			variables.push({ variableId: `speakerposition_z_${i}`, name: `Speaker Position Z ${i}` })
			variables.push({ variableId: `speakerposition_h_${i}`, name: `Speaker Position H ${i}` })
			variables.push({ variableId: `speakerposition_v_${i}`, name: `Speaker Position V ${i}` })
		}*/

		//coordinate mapping settings
		/*for (let i = 1; i <= 4; i++) {
			variables.push({ variableId: `coordinatemapping_p1_real_${i}`, name: `Coordinate Mapping P1 Real ${i}` })
			variables.push({ variableId: `coordinatemapping_p2_real_${i}`, name: `Coordinate Mapping P2 Real ${i}` })
			variables.push({ variableId: `coordinatemapping_p3_real_${i}`, name: `Coordinate Mapping P3 Real ${i}` })
			variables.push({ variableId: `coordinatemapping_p4_real_${i}`, name: `Coordinate Mapping P4 Real ${i}` })
			variables.push({
				variableId: `coordinatemapping_p1_virtual_${i}`,
				name: `Coordinate Mapping P1 Virtual ${i}`,
			})
			variables.push({
				variableId: `coordinatemapping_p3_virtual_${i}`,
				name: `Coordinate Mapping P3 Virtual ${i}`,
			})
			variables.push({ variableId: `coordinatemapping_flip_${i}`, name: `Coordinate Mapping Flip ${i}` })
			variables.push({ variableId: `coordinatemapping_name_${i}`, name: `Coordinate Mapping Name ${i}` })
		}*/

		self.setVariableDefinitions(variables)
	},
}
