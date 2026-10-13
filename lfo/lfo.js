import {Node} from "nodered";
import Timer from "timer";

const TAU = Math.PI * 2;

function sine(t, f) {
	return Math.sin(t * TAU * f);
}

function saw(t, f) {
	const n = ((t % (1 / f)) * f) % 1;
	return -1 + (2 * n);
}

function saw_i(t, f) {
	const n = ((t % (1 / f)) * f) % 1;
	return 1 - (2 * n);
}

function triangle(t, f) {
	return Math.abs(1 - t % (1 / f) * f * 2) * 2 - 1;
}

function square(t, f) {
	return t * f % 1 < 0.5 ? 1 : -1;
}

function sig(t, f) {
	return 1 / (1 + Math.pow(Math.E, (t * TAU * f) % 12));
}

const waveforms = Object.freeze({
	sine,
	saw,
	saw_i,
	triangle,
	square,
	sig
});

class LFONode extends Node {
	#timer;
	#t0;
	#frequency;
	#waveform;
	#interval;

	onStart(config) {
		super.onStart(config);
		this.#frequency = Number(config.frequency) || 1;
		this.#waveform = waveforms[config.waveform] ? config.waveform : "sine";
		this.#interval = Number(config.interval) || 20;
		this.#t0 = Date.now();
		if (config.autostart === true || config.autostart === "true")
			this.#start();
	}

	onMessage(msg, done) {
		const payload = msg.payload;

		if (typeof payload === "number" && !Number.isNaN(payload)) {
			this.#frequency = payload;
			this.status({fill: "blue", shape: "dot", text: `${payload} Hz`});
			done();
			return;
		}

		if (Object.hasOwn(msg, "waveform") && waveforms[msg.waveform]) {
			this.#waveform = msg.waveform;
			done();
			return;
		}

		if (payload === "stop") {
			this.#stop();
			this.status({fill: "grey", shape: "ring", text: "stopped"});
			done();
			return;
		}

		this.#start();
		done();
	}

	#start() {
		if (this.#timer)
			return;
		this.#t0 = Date.now();
		const sample = waveforms[this.#waveform];
		this.#timer = Timer.repeat(() => {
			const t = (Date.now() - this.#t0) / 1000;
			const value = sample(t, this.#frequency);
			this.send({payload: value, topic: "lfo"});
			this.status({fill: "green", shape: "dot", text: value.toFixed(2)});
		}, this.#interval);
		this.status({fill: "green", shape: "ring", text: "running"});
	}

	#stop() {
		if (!this.#timer)
			return;
		Timer.clear(this.#timer);
		this.#timer = undefined;
	}

	static type = "mcu_lfo";
	static {
		RED.nodes.registerType(this.type, this);
	}
}
