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
	/** Value-display buttons (Gain, Delay, Spread, …) */
	display: {
		bgcolor: combineRgb(0, 0, 0),
		color: combineRgb(255, 255, 255),
	},
	/** Stream Deck rotary / encoder presets (no display feedback) */
	rotary: {
		bgcolor: combineRgb(0xff, 0xc0, 0xff),
		color: combineRgb(0, 0, 0),
	},
	/** Spezial Presets En-Space zone latch (text always green) */
	specialTextGreen: combineRgb(0, 255, 0),
	specialZoneOff: {
		bgcolor: combineRgb(0, 0, 0),
		color: combineRgb(0, 255, 0),
	},
	specialZone1On: {
		bgcolor: combineRgb(0, 0, 255),
		color: combineRgb(0, 255, 0),
	},
	specialZone2On: {
		bgcolor: combineRgb(255, 255, 255),
		color: combineRgb(0, 255, 0),
	},
	specialZone3On: {
		bgcolor: combineRgb(255, 0, 0),
		color: combineRgb(0, 255, 0),
	},
	specialZone4On: {
		bgcolor: combineRgb(0, 100, 0),
		color: combineRgb(0, 255, 0),
	},
}

export const buttonBaseStyle = {
	size: '14',
	...COLORS.grey,
}

export const displayButtonStyle = {
	size: '14',
	...COLORS.display,
}

export const rotaryButtonStyle = {
	size: '14',
	...COLORS.rotary,
}
