# @moddable-node-red/mcu_lfo

LFO (low-frequency oscillator) node for [Node-RED MCU Edition](https://github.com/phoddie/node-red-mcu).

## Install

From npm (after publish):

```bash
cd ~/.node-red
npm install @moddable-node-red/mcu_lfo
```

From git:

```bash
cd ~/.node-red
npm install github:lescurej/node-red-mcu-lfo
```

Restart Node-RED. The node appears in the **MCU** palette as **LFO**.

## Requirements

- [Node-RED](https://nodered.org/) 3+
- [@ralphwetzel/node-red-mcu-plugin](https://www.npmjs.com/package/@ralphwetzel/node-red-mcu-plugin)
- Moddable SDK + ESP-IDF as required by the MCU plugin

## Usage

```
[mcu_lfo] → [function] → [mcu_neopixels]
```

Enable **Auto-start** or send `msg.payload = "start"` once.

Frequency: send a numeric `msg.payload` (Hz).

## Publish to npm

```bash
npm login
npm publish --access public
```

## License

LGPL-3.0-or-later
