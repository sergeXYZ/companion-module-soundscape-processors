# Companion d&b Module — Research Notes

Compiled from research on [bitfocus/companion-module-dbaudiotechnik-dsp](https://github.com/bitfocus/companion-module-dbaudiotechnik-dsp).

**Local clone:** `/Users/serge/Projects/companion-module-dbaudiotechnik-dsp`

---

## Overview

The **Bitfocus Companion module for d&b audiotechnik DSPs** controls **d&b DS100 / DS100M** devices over **OSC/UDP** (ports **50010** / **50011**).

### Capabilities

| Feature | Description |
|---|---|
| **Actions** | Matrix input/output/node control, En-Scene positioning, En-Space, scenes, sound object routing, function groups |
| **Feedbacks** | Mute, delay, EQ, polarity states |
| **Variables** | Matrix parameters, scene info, etc. |
| **Presets** | Ready-made buttons |

### Project structure

| File / folder | Purpose |
|---|---|
| `index.js` | Main entry point, instance class |
| `src/actions.js` | Button actions |
| `src/feedbacks.js` | State feedbacks |
| `src/variables.js` | Variables |
| `src/presets.js` | Presets |
| `src/api.js` | OSC communication with the device |
| `src/config.js` | Module configuration UI |
| `src/constants.js` | Shared constants (OSC prefix `/dbaudio1`) |
| `companion/manifest.json` | Module metadata for Companion |

---

## All Parameters (Alphabetical)

Based on `actions.js`, `feedbacks.js`, `variables.js`, and `api.js`.

Each entry shows **where it applies** and whether it is **controllable** (Companion can send OSC to change it) or **monitor-only** (read via variables/feedbacks only).

### Controllable parameters (via Actions)

| Parameter | Applies to |
|---|---|
| **Channel Name** | Matrix Input, Matrix Output |
| **Coordinate Mapping Source Position X** | Coordinate Mapping Area × Sound Object |
| **Coordinate Mapping Source Position Y** | Coordinate Mapping Area × Sound Object |
| **Coordinate Mapping Source Position Z** | Coordinate Mapping Area × Sound Object |
| **Delay** | Function Group, Matrix Input, Matrix Node, Matrix Output |
| **Delay Enable** | Matrix Input, Matrix Node, Matrix Output |
| **Device Clear** | Device (system command) |
| **Enable** | Matrix Node (crosspoint routing) |
| **EQ Enable** | Matrix Input, Matrix Output, Reverb Input Processing |
| **Gain** | Matrix Input, Matrix Node, Matrix Output, Reverb Input, Reverb Input Processing, Sound Object Routing |
| **Level Meter** | Reverb Input Processing |
| **Level Meter Post Mute** | Matrix Output |
| **Level Meter Pre Mute** | Matrix Output |
| **Mute** | Matrix Input, Matrix Output, Reverb Input Processing, Sound Object Routing |
| **Polarity** | Matrix Input, Matrix Output |
| **Reverb Pre Delay Factor** | Matrix Settings (En-Space) |
| **Reverb Rear Level** | Matrix Settings (En-Space) |
| **Reverb Room ID** | Matrix Settings (En-Space) |
| **Reverb Send Gain** | Matrix Input |
| **Scene Recall** | Scenes (Previous, Next, by Major number, by Major/Minor) |
| **Source Delay Mode** | Positioning / En-Scene |
| **Source Position X** | Positioning / En-Scene |
| **Source Position Y** | Positioning / En-Scene |
| **Source Position Z** | Positioning / En-Scene |
| **Source Spread** | Positioning / En-Scene |
| **Spread Factor** | Function Group |

**Total: 26 unique controllable parameter types**

### Monitor-only parameters (Variables / Feedbacks, no write Action)

| Parameter | Applies to |
|---|---|
| **Channel Name** | Matrix Input, Matrix Output *(also controllable)* |
| **Coordinate Mapping Flip** | Coordinate Mapping Settings (4 areas) |
| **Coordinate Mapping Name** | Coordinate Mapping Settings (4 areas) |
| **Coordinate Mapping P1 Real** | Coordinate Mapping Settings |
| **Coordinate Mapping P1 Virtual** | Coordinate Mapping Settings |
| **Coordinate Mapping P2 Real** | Coordinate Mapping Settings |
| **Coordinate Mapping P3 Real** | Coordinate Mapping Settings |
| **Coordinate Mapping P3 Virtual** | Coordinate Mapping Settings |
| **Coordinate Mapping P4 Real** | Coordinate Mapping Settings |
| **Device Name** | Settings *(set action exists but is commented out)* |
| **Function Group Name** | Function Group (up to 16) |
| **Level Meter Post Mute** | Matrix Input *(Matrix Output is also controllable)* |
| **Level Meter Pre Mute** | Matrix Input *(Matrix Output is also controllable)* |
| **Scene Comment** | Current scene |
| **Scene Index** | Current scene |
| **Scene Name** | Current scene |
| **Speaker Position H** | Speaker positions |
| **Speaker Position V** | Speaker positions |
| **Speaker Position X** | Speaker positions |
| **Speaker Position Y** | Speaker positions |
| **Speaker Position Z** | Speaker positions |
| **Status – Audio Network Sample Status** | Device status |
| **Status – Matrix Input Count** | Device status |
| **Status – Matrix Output Count** | Device status |
| **Status Text** | Device status |

### Flat alphabetical list (all parameters combined)

1. Channel Name
2. Coordinate Mapping Flip *(monitor)*
3. Coordinate Mapping Name *(monitor)*
4. Coordinate Mapping P1 Real *(monitor)*
5. Coordinate Mapping P1 Virtual *(monitor)*
6. Coordinate Mapping P2 Real *(monitor)*
7. Coordinate Mapping P3 Real *(monitor)*
8. Coordinate Mapping P3 Virtual *(monitor)*
9. Coordinate Mapping P4 Real *(monitor)*
10. Coordinate Mapping Source Position X
11. Coordinate Mapping Source Position Y
12. Coordinate Mapping Source Position Z
13. Delay
14. Delay Enable
15. Device Clear
16. Device Name *(monitor only — action disabled)*
17. Enable *(Matrix Node)*
18. EQ Enable
19. Function Group Name *(monitor)*
20. Gain
21. Level Meter *(Reverb Input Processing)*
22. Level Meter Post Mute
23. Level Meter Pre Mute
24. Mute
25. Polarity
26. Reverb Pre Delay Factor
27. Reverb Rear Level
28. Reverb Room ID
29. Reverb Send Gain
30. Scene Comment *(monitor)*
31. Scene Index *(monitor)*
32. Scene Name *(monitor)*
33. Scene Recall
34. Source Delay Mode
35. Source Position X
36. Source Position Y
37. Source Position Z
38. Source Spread
39. Speaker Position H *(monitor)*
40. Speaker Position V *(monitor)*
41. Speaker Position X *(monitor)*
42. Speaker Position Y *(monitor)*
43. Speaker Position Z *(monitor)*
44. Spread Factor
45. Status – Audio Network Sample Status *(monitor)*
46. Status – Matrix Input Count *(monitor)*
47. Status – Matrix Output Count *(monitor)*
48. Status Text *(monitor)*

**Note:** Many parameters are **indexed** — e.g. Matrix Input 1–128, Matrix Output 1–64, Function Group 1–16, Sound Object 1–128 — depending on the **Matrix size** setting (S / L / XL).

---

## Sound Object Routing — Deep Dive

Sound Object Routing controls how a **Sound Object** (input source, numbered 1…128) is routed into a **Function Group** (1…16 in the UI, 1…32 in internal storage).

### Parameters

| Parameter | OSC path | Value type | Range |
|---|---|---|---|
| **Mute** | `/soundobjectrouting/mute/{functionGroup}/{soundObject}` | integer | `0` = Unmute, `1` = Mute |
| **Gain** | `/soundobjectrouting/gain/{functionGroup}/{soundObject}` | float | -120.0 to +10.0 dB |

Paths are sent with the prefix `/dbaudio1` (see `constants.js`).

Each parameter is addressed by:
- **Function Group**: 1–32 (in actions/feedbacks)
- **Sound Object**: 1 up to `matrixInputCount` (64 or 128, depending on matrix size)

### Where it appears in the code

#### Actions (`src/actions.js`) — 4 actions

- Sound Object Routing - **Mute**
- Sound Object Routing - **Gain**
- Sound Object Routing - **Increase Gain**
- Sound Object Routing - **Decrease Gain**

#### Feedbacks (`src/feedbacks.js`) — 2 feedbacks

- Sound Object Routing - **Mute** (boolean, fixed in v2.0.0)
- Sound Object Routing - **Gain** (advanced, shows dB on button — added in v2.0.0)

#### Variables (`src/variables.js`) — disabled

The variables block is **commented out**, so these are not exposed in Companion UI:
- `soundobjectrouting_mute_{functionGroup}_{soundObject}`
- `soundobjectrouting_gain_{functionGroup}_{soundObject}`

The API still receives and stores values in `self.DATA.soundObjectRouting` when the device sends OSC updates.

#### Data model (`src/api.js`)

```javascript
// Sound object routing data (functiongroup 1-32 x matrixInput 1-[iii])
soundObjectRouting: Array.from({ length: 33 }, () =>
  Array.from({ length: self.matrixInputCount + 1 }, () => ({
    mute: null,
    gain: null,
  }))
),
```

#### Presets

No Sound Object Routing presets in `presets.js`.

---

## Sound Object Routing — Mute & Gain (End-to-End)

### 1. Data storage (`api.js`)

On connect, the module creates a 2D table: Function Group × Sound Object (see data model above).

Incoming OSC from the DS100 updates this table:

```javascript
} else if (address.indexOf('/soundobjectrouting/mute/') !== -1) {
  let id = address.split('/')[4].toString()
  let id2 = address.split('/')[5].toString()
  self.DATA.soundObjectRouting[id][id2].mute = value
  variableObj = { [`soundobjectrouting_mute_${id}_${id2}`]: value }
} else if (address.indexOf('/soundobjectrouting/gain/') !== -1) {
  let id = address.split('/')[4].toString()
  let id2 = address.split('/')[5].toString()
  self.DATA.soundObjectRouting[id][id2].gain = value
  variableObj = { [`soundobjectrouting_gain_${id}_${id2}`]: value }
```

For OSC address `/dbaudio1/soundobjectrouting/mute/3/12`:
- `id` = Function Group **3**
- `id2` = Sound Object **12**
- `value` = mute state

### 2. OSC paths

All paths get the prefix `/dbaudio1` from `constants.js`:

```javascript
PREFIX: '/dbaudio1',
```

| Direction | Path | Example |
|---|---|---|
| **Companion → device** | `/dbaudio1/soundobjectrouting/mute/{group}/{object}` | `/dbaudio1/soundobjectrouting/mute/3/12` + arg `1` |
| **Companion → device** | `/dbaudio1/soundobjectrouting/gain/{group}/{object}` | `/dbaudio1/soundobjectrouting/gain/3/12` + arg `-6.0` |
| **Device → Companion** | same paths | device sends current values back |

On startup/polling, the module requests all values:

```javascript
self.sendCommand('/soundobjectrouting/mute/*/*', [])
self.sendCommand('/soundobjectrouting/gain/*/*', [])
```

The `*/*` wildcards ask the device for every Function Group × Sound Object combination.

### 3. Actions — sending commands (`actions.js`)

#### Mute action

- Options: Function Group (1–16), Sound Object (1–matrixInputCount), Mute/Unmute dropdown
- Sends OSC integer (`type: 'i'`, value `0` or `1`)
- Path: `/soundobjectrouting/mute/{functionGroup}/{soundObject}`

#### Gain action (set absolute value)

- Options: Function Group, Sound Object, Gain (-120.0 to +10.0 dB)
- Sends OSC float (`type: 'f'`)
- Path: `/soundobjectrouting/gain/{functionGroup}/{soundObject}`

#### Increase / Decrease Gain

- Reads **current cached value** from `self.DATA.soundObjectRouting[functionGroup][soundObject].gain`
- Adds/subtracts a step, then sends the new value
- **Important:** Only works if the module already knows the current gain (from device OSC). If `gain` is still `null`, nothing is sent.

### 4. Feedback — button color (`feedbacks.js`)

Mute feedback (fixed in v2.0.0) and Gain feedback (added in v2.0.0).

If mute is `1`, the button turns red (active style). Gain feedback displays the current dB value as button text.

### 5. Variables — disabled (`variables.js`)

Variables for mute/gain exist in code but are **commented out**:

```javascript
//sound object routing
/*for (let i = 1; i <= 16; i++) {
  for (let j = 1; j <= 64; j++) {
    variables.push({
      variableId: `soundobjectrouting_mute${i}_${j}`,
      name: `Sound Object Routing Mute ${i} - ${j}`,
    })
    variables.push({
      variableId: `soundobjectrouting_gain${i}_${j}`,
      name: `Sound Object Routing Gain ${i} - ${j}`,
    })
  }
}*/
```

**Inconsistency:** Variable IDs use `mute${i}_${j}` (no underscore before numbers), while the API uses `soundobjectrouting_mute_${id}_${id2}`.

### Flow overview

```
Companion Button → Module (actions.js) → DS100 DSP
                                              ↓
Companion Button ← Feedback (if working) ← Module stores in DATA.soundObjectRouting
```

1. Press "Mute FG3 / SO12"
2. Module sends OSC `/dbaudio1/soundobjectrouting/mute/3/12` `[1]`
3. DS100 replies with current mute state
4. Module stores in `DATA.soundObjectRouting[3][12].mute`
5. Feedback updates button color (if working)

### Summary table

| Feature | Mute | Gain |
|---|---|---|
| **Set action** | Yes | Yes |
| **Increase/Decrease** | No | Yes |
| **Feedback** | Yes (fixed v2.0.0) | Yes (added v2.0.0) |
| **Variables** | Disabled | Disabled |
| **OSC arg type** | integer (`i`) | float (`f`) |
| **Indexed by** | Function Group + Sound Object | same |

---

## Known Issues & Gaps

1. **Sound Object Routing — only Mute and Gain** — no other parameters (delay, enable, etc.) exist in this module.
2. **Variables are off** — uncomment the block in `variables.js` to expose them in Companion.
3. **No Sound Object Routing presets** in `presets.js`.
4. **Device Name action** is commented out in actions.
5. **Variable ID naming inconsistency** between `variables.js` and `api.js` for sound object routing.

## Resolved in v2.0.0

- Function Groups UI extended from 16 to 32 (`FUNCTION_GROUP_COUNT` in `constants.js`)
- Sound Object Routing Mute feedback fixed (option id + `self.DATA` path)
- Sound Object Routing Gain feedback added

---

*Source chat: [companion-module-dbaudiotechnik-dsp research](5d6c3b89-39ba-44bf-a455-b7c30d4bfc81)*
