# companion-module-soundscape-processors

Bitfocus Companion module for **d&b audiotechnik Soundscape Processors** (DS110; DS100; DS100M) over OSC/UDP.

Fork of [bitfocus/companion-module-dbaudiotechnik-dsp](https://github.com/bitfocus/companion-module-dbaudiotechnik-dsp) v1.1.0.

Module id: `soundscape-processors` · Current version: **2.0.0-beta.15.13**

Requires **Companion 4.3+** (tested with Companion 5) — Module API 2.0 / Node 22.

See [`companion/HELP.md`](companion/HELP.md) for device setup and action/feedback overview. Internal research notes: [`COMPANION-DNB-MODULE-RESEARCH.md`](COMPANION-DNB-MODULE-RESEARCH.md).

## Features (beyond upstream)

- **Subscription-based polling** — only OSC paths used by active actions/feedbacks are polled (optional legacy full `*` poll)
- **Dual poll intervals** — continuous (gain, meters, positions) vs discrete (mute, enable, names, scene)
- Expanded **value/display feedbacks** (matrix gain/delay, SOR gain, function groups, positioning, En-Space, scene)
- Sound Object Routing support for up to **32 function groups**
- Mute presets with d&b R1-style colors (Input / Output / Reverb Processing / SOR)
- **Stable mute/parameter presets**: All + example buttons; active colors from Colours/ (Mute/Delay/EQ/Polarity/Tight/Full), else grey


## Development

```bash
# Needs Node 22+
yarn install
yarn build
```

Install the built package into Companion's modules folder (or use a local module path), then select version `2.0.0-beta.15.13` on the connection.

### Test page helper

[`scripts/create-test-page.mjs`](scripts/create-test-page.mjs) can rebuild a Companion page 1 layout for SOR testing. Quit Companion before running it.

## Version history

- **2.0.0-beta.15.22** — Spezial Presets: Display Input Name (polled channelname)
- **2.0.0-beta.15.21** — Spezial Send Display: line1 In N, line2 value dB only
- **2.0.0-beta.15.20** — Fix Spezial Send Display feedback; rename All In EnSp -120
- **2.0.0-beta.15.19** — Spezial Send: Display + Rotary; Inc/Dec without feedback; All Inputs Send -120
- **2.0.0-beta.15.18** — Spezial Presets: All Zones / All Inputs → -120 button
- **2.0.0-beta.15.17** — Zone toggles default -120; enabling one zone sets others to -120
- **2.0.0-beta.15.16** — Spezial Presets: En-Space Input Bank (shared input, send ±, zone -120/0)
- **2.0.0-beta.15.15** — Preset font size back to 14
- **2.0.0-beta.15.14** — Rotaries in category lists, pink (#FFC0FF), no feedback
- **2.0.0-beta.15.13** — Rotary presets for all Inc/Dec (↻ increase, ↺ decrease)
- **2.0.0-beta.15.11** — En-Space Send Inc/Dec All presets
- **2.0.0-beta.15.10** — Matrix Input presets for En-Space Send + Input Matrix (zone 1–4)
- **2.0.0-beta.15.9** — En-Space room labels (Modern-small …) + photo backgrounds for rooms 1–9
- **2.0.0-beta.15.7** — Fix En-Space Room ID polling; show room names on display
- **2.0.0-beta.15.6** — Inc/Dec presets for Gain, Delay, Spread, Spreadfactor, Position
- **2.0.0-beta.15.5** — Display presets: rename to Display + function, black background
- **2.0.0-beta.15.4** — Rename module to "d&b audiotechnik Soundscape Processors"
- **2.0.0-beta.15.3** — Delay Mode buttons show Off/Tight/Full on the display
- **2.0.0-beta.15.2** — SOR Mute All per Function Group (local variable functiongroup)
- **2.0.0-beta.15.1** — Source Delay Mode: cycle button + All latch (replaces three single-state presets)
- **2.0.0-beta.15** — Presets for main parameters; Colours/ state colors (Delay/EQ/Polarity/Tight/Full) + grey default
- **2.0.0-beta.14** — Stable mute presets: grey R1 example buttons + clear how-to text (no purple)
- **2.0.0-beta.13** — Purple mute examples: inverted feedback for grey unmuted + red muted
- **2.0.0-beta.12** — Mute presets: Mute All + purple configure-me examples (no template flood)
- **2.0.0-beta.11** — Module API 2.0; mute presets as template groups; SOR Mute All
- **2.0.0-beta.10** — R1 mute colors; mute presets (Input/Output/Reverb/SOR); advanced feedback green text size 14
- **2.0.0-beta.9** — Test release
- **2.0.0-beta.8** — Dual polling intervals (continuous / discrete)
- **2.0.0-beta.7** — Subscription-based polling; more display feedbacks
- **2.0.0-beta.6** — SOR/matrix variable display fixes
- **2.0.0-beta.2** — Renamed product branding for Soundscape Engines
- **2.0.0-beta.1** — Fork from upstream v1.1.0; module id `soundscape-processors`

## License

MIT — see [`LICENSE`](LICENSE).
