# d&b audiotechnik Soundscape Processor: DS110; DS100; DS100M

This module controls d&b audiotechnik Soundscape Processor devices using the OSC protocol over UDP.

## Supported Devices

-   **DS110** – Soundscape engine (OSC control via this module)
-   **DS100** – En-Scene and En-Space DSP/matrix device with Dante audio networking. Supports up to 128 inputs and 64 outputs depending on scalable I/O option.
-   **DS100M** – En-Scene and En-Space DSP/matrix device with Milan™/AES67 and MADI audio networking. Supports the same matrix sizes as the DS100 and additionally 96 kHz at Extra-large capacity.

The module automatically queries the active matrix size from the device at startup and adapts accordingly. This requires firmware V3.00.01 or later. You can also configure the expected matrix size manually to prepare actions and variables before the device is online.

## Scalable I/O options

The DS100 Signal Engine comprises an audio matrix with scalable I/O options:

| Size | Inputs | Outputs | DS100 sample rates | DS100M sample rates |
|---|---|---|---|---|
| **S** – Small | 64 | 24 | 48 kHz, 96 kHz | 48 kHz, 96 kHz |
| **L** – Large | 64 | 64 | 48 kHz, 96 kHz | 48 kHz, 96 kHz |
| **XL** – Extra-large | 128 | 64 | 48 kHz | 48 kHz, 96 kHz |

## Configuration

-   Enter the IP address of the device.
-   The default OSC sending port (Companion → device) is **50010**.
-   The default OSC receiving port (device → Companion) is **50011**.
-   These ports should not be changed unless required by your network setup.
-   **Only one application** on this computer can listen on port 50011 at a time. If another Companion connection, OSC tool, or bridge (e.g. `bridge.main`) is already using it, this module will show a connection error instead of OK.
-   The device communicates over **UDP**.
-   Set **Matrix size** to match the scalable I/O option of your device. This configures the number of inputs and outputs available in actions, feedbacks and variables. The module will update this automatically when the device reports its actual size, but setting it correctly here ensures the correct buttons and variables are available before the device is online.
-   Enable **Polling** if you want the module to periodically refresh state (useful for environments where other controllers may change values).
-   **Polling Mode**:
    -   **Only used parameters (recommended)** – polls only OSC paths for buttons that currently use matching actions or feedbacks. This greatly reduces network traffic.
    -   **Full wildcard poll (legacy)** – queries all parameters with `*` as in older module versions.
-   **Dual intervals** (subscribed mode):
    -   **Continuous** (default 500 ms) – gain, meters, positions, delay values, spread, etc.
    -   **Discrete** (default 2000 ms) – mute, enable, EQ enable, polarity, names, scene, plus lightweight status.
-   Display-only buttons that use variables should also include the matching **feedback** (or an action) so subscribed polling knows to query that parameter.

## Actions

The module provides actions for:

-   Matrix Input: Mute, Gain, Delay, Delay Enable, EQ Enable, Polarity, Channel Name
-   Matrix Node: Enable, Gain, Delay, Delay Enable
-   Matrix Output: Mute, Gain, Delay, Delay Enable, EQ Enable, Polarity, Channel Name
-   En-Scene Positioning: Source Spread, Delay Mode, Source Position (X/Y/Z)
-   En-Space: Room selection, Predelay Factor, Rear Level, Reverb Send Gain
-   Scenes: Recall (previous, next, by number), query current scene
-   Sound Object Routing: Mute, Gain (per Function Group, 1–32)
-   Function Groups: Spread Factor, Delay (supports up to 32 Function Groups)

## Feedbacks

Feedbacks reflect the current state of mute, delay, EQ, polarity, and level meters for Matrix Inputs, Outputs, and Nodes.

Value/display feedbacks are also available (button text shows the live value):

-   Matrix Input / Output / Node: Gain, Delay, Channel Name
-   Sound Object Routing: Mute (boolean style), Gain (value)
-   Function Group: Name, Spread Factor, Delay
-   Positioning: Source Spread, Position X / Y
-   En-Space: Reverb Room Id, Predelay Factor, Rear Level
-   Scene: Index / Name

-   **Sound Object Routing - Mute**: Button style when the selected Function Group / Sound Object routing is muted.
-   **Sound Object Routing - Gain**: Button text shows the current gain in dB for the selected Function Group / Sound Object routing.

## Variables

Variables are available for all matrix input, output, and node parameters, as well as scene index, name, and comment.

## Presets

Structured preset sections: Matrix Input/Output/Node, Reverb Processing, Sound Object Routing, Scene, En-Space, and **Special Presets** (En-Space Input Bank).

**Full guide (German):** [Preset manual — variables, displays, rotary encoders](../docs/PRESETS-MANUAL.md)

Quick summary:

- **EXAMPLE** presets use **Local Variables** (`matrixinput`, `functiongroup`, …) — set after placing, duplicate the button for more channels.
- **Latch** = two-step on/off with color feedback; **All** = all channels (grey / active / yellow ≠ when mixed).
- **Display** = black button, live value via feedback only (no press action).
- **Rotary** = Stream Deck Plus encoder; hold while turning for coarse steps.
- **Special Presets** share one module-wide Matrix Input selector for En-Space send, name, and zone controls.

