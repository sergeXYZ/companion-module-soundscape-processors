import { combineRgb } from '@companion-module/base'

/**
 * Button state colors sampled from:
 * Companion Modules/Soundscape Processors/Colours/{Delay,EQ,Polarity,tight,full}.png
 * Mute from R1 reference. Inactive / unspecified states use grey.
 */
export const COLORS = {
	grey: {
		bgcolor: combineRgb(135, 135, 135),
		color: combineRgb(255, 255, 255),
	},
	mute: {
		bgcolor: combineRgb(216, 43, 43),
		color: combineRgb(255, 255, 255),
	},
	delay: {
		bgcolor: combineRgb(244, 160, 10),
		color: combineRgb(0, 0, 0),
	},
	eq: {
		bgcolor: combineRgb(0, 114, 168),
		color: combineRgb(255, 255, 255),
	},
	polarity: {
		bgcolor: combineRgb(246, 196, 13),
		color: combineRgb(0, 0, 0),
	},
	tight: {
		bgcolor: combineRgb(250, 160, 0),
		color: combineRgb(0, 0, 0),
	},
	full: {
		bgcolor: combineRgb(150, 155, 0),
		color: combineRgb(0, 0, 0),
	},
}

export const buttonBaseStyle = {
	size: '14',
	...COLORS.grey,
}
